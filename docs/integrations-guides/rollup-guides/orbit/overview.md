---
title: Technical overview
---
# Overview

Defined below is a technical breakdown of the key changes we've made to securely enable fraud proofs and high throughput for Arbitrum with EigenDA. This also goes over some key caveats and features. 

## Runbook

Core Arbitrum is a highly complicated composition of many software repositories and programming languages. To better demystify key system flows, we've developed an operational developer [runbook](https://eigen-labs.notion.site/Arbitrum-x-EigenDA-Developer-Runbook-12466062c1a7495ebc1d803169c37644?pvs=4) which describes core testing and system procedures.

## ETH L2 vs L3 deployments

L2s using Arbitrum with EigenDA are a M0 integration unlike L3s which are M1. This means both degraded security and throughput when currently using L3s with EigenDA. Please advise our Integrations [Overview](../integrations-overview.md) for a more comprehensive overview of different EigenDA rollup stages.

EigenDA bridging is currently only supported on Ethereum, meaning that L3s settling to a L2 can't:
- Rely on cert verification within the `Sequencer Inbox` contract
- Await disperser confirmations via eigenda proxy for accrediting batches

Currently for L3 deployments, we recommend ensuring that:

- `EIGENDA_PROXY_EIGENDA_ETH_CONFIRMATION_DEPTH` is set closer to ETH finalization (i.e, 64 blocks or two consensus epochs) since a reorg'd EigenDA bridge confirmation tx wouldn't be detectable by the rollup itself. This risk is nonexistent for L2s settling to Ethereum since the inbox's EigenDA certificate tx would read storage states on the `EigenDAServiceManger` which are set by the EigenDA bridge confirmation tx; meaning that a reorg of the EigenDA bridge confirmation tx would result in a reorg of the inbox's EigenDA certificate tx.

- If you wish to support higher throughput L3s with reduced risk, you can configure your EigenDA proxy instance with secondary storage fallbacks. This would at least ensure that if the blob certificate were to be invalidated the data would still be partially available. This would compromise the trust model of the rollup given an honest verifier node could when syncing from a confirmed chain head could halt in the event of a reorg'd since it wouldn't have access to the sequencer's secondary store.

### System Testing

We've extended many of Arbitrum Nitro's core system tests to ensure E2E correctness when using EigenDA; i.e:
- [Added](https://github.com/Layr-Labs/nitro/blob/206560b02e42b801cdece9194dc005a93f539ca5/system_tests/eigenda_test.go#L28-L65) batch posting and derivation test
- [Added](https://github.com/Layr-Labs/nitro/blob/206560b02e42b801cdece9194dc005a93f539ca5/system_tests/eigenda_test.go#L67-L255) programmatic failover tests to ensure EigenDA successfully rollovers to native Arbitrum DA destinations in the event of `ServiceUnavailable` status codes
- [Extended](https://github.com/Layr-Labs/nitro/blob/206560b02e42b801cdece9194dc005a93f539ca5/system_tests/full_challenge_impl_test.go#L337-L641) E2E fraud proof tests to assert correctness of OSP dispute for `READINBOXMESSAGE` when using an EigenDA batch destination type.

For replicating EigenDA interactions in a local testing environment, we utilize a local proxy [instance](https://github.com/Layr-Labs/nitro/blob/206560b02e42b801cdece9194dc005a93f539ca5/scripts/start-eigenda-proxy.sh) configured using a memstore backend to provide rapid iteration cycles. We've also added full compatibility with [Github Actions CI](https://github.com/Layr-Labs/nitro/actions) to ensure best practice node development.

### EigenDA Proxy

[EigenDA Proxy](https://github.com/Layr-Labs/eigenda-proxy) is used for secure and optimized communication between the rollup and the EigenDA disperser. Arbitrum uses the [*Simple Commitment Mode*](https://github.com/Layr-Labs/eigenda-proxy?tab=readme-ov-file#simple-commitment-mode) for client/server interaction and representing DA certificates. Read more about EigenDA Proxy and its respective security features [here](./../../dispersal/clients/eigenda-proxy.md).

### Posting batches to EigenDA

Please ensure that changes made to batch poster configs are globally applied across all your batch poster instances. If not, there could be inconsistencies that arise due to deviations in collective processing logic. To learn more about the Arbitrum batch poster please advise our following overview [spec](https://hackmd.io/@epociask/ByHk6x_TC).

**Adjusting maximum batch size**

Currently, the batch poster defaults to a maximum of `16mib` when dispersing batches to EigenDA. This can be adjusted to a lower threshold directly within the batch poster section of your node config:

```
    "node": {
        ...
        "batch-poster": {
            "enable": true,
            ...
            "max-eigenda-batch-size": 12_000_000, // 12 MB
        }
    }
```


**Enabling Failover**

To remove a trust assumption on the liveness of EigenDA for the liveness of the rollup, we've extended the Arbitrum Nitro batch poster's logic to support opt-in failover to other DA destinations (e.g, AnyTrust, EIP-4844, calldata) in the event of indicated service unavailability from EigenDA. This logic is disabled by default but can be enabled by making the following update to your batch poster config with the following field:
```
    "node": {
        ...
        "batch-poster": {
            "enable": true,
            ...
            "enable-eigenda-failover": true, 
        }
    }
```

To learn more about our Arbitrum failover design methodology, please advise the following [spec](https://hackmd.io/@epociask/SJUyIZlZkx).

# Diff Overview 

Many modifications were made to successfully support fraud proofs and secure batch posting. The following is an in-depth summary which describes the key changes made to the core Arbitrum stack to enable secure compatibility with EigenDA.

### Batch Submission & Derivation

#### [Nitro](https://github.com/Layr-Labs/nitro)

- [Extended](https://github.com/Layr-Labs/nitro/blob/e8981ff2f09720b6627e751d8bd3146277c7a01b/arbnode/batch_poster.go#L113) batch poster to take in an `eigenDAWriter` struct that writes blobs to DA via eigenda-proxy
    - [Embed](https://github.com/Layr-Labs/nitro/blob/e8981ff2f09720b6627e751d8bd3146277c7a01b/arbnode/batch_poster.go#L1030-L1075) ABI calldata for tx submissions to `SequencerInbox`
    - [Provide](https://github.com/Layr-Labs/nitro/pull/46) programmatic failover feature to use other DA destinations when EigenDA is unavailable.
- [Extended](https://github.com/Layr-Labs/nitro/blob/e8981ff2f09720b6627e751d8bd3146277c7a01b/arbnode/sequencer_inbox.go#L174-L211) inbox message derivation to support type processing for an eigenda batch type (i.e, `0xed` prefix)
- [Compute](https://github.com/Layr-Labs/nitro/blob/e8981ff2f09720b6627e751d8bd3146277c7a01b/eigenda/types.go#L126-L140) `batchHeaderHash` locally using `batchHeader` fields when querying blobs from eigenda proxy
- [Updated](https://github.com/Layr-Labs/nitro/blob/e8981ff2f09720b6627e751d8bd3146277c7a01b/arbnode/batch_poster.go#L155-L156) batch poster config to support 16Mib batches when using eigenda
- Increased `maxDecompressedLen` batch encoding [limit](https://github.com/Layr-Labs/nitro/blob/ca4415e1d9041423e085bb873da43e4342f47499/arbstate/inbox.go#L48) to support 40mib batches post-compression 

#### [Nitro Contracts](https://github.com/Layr-Labs/nitro-contracts)

- Extended [`SequencerInbox.sol`](https://github.com/Layr-Labs/nitro-contracts/blob/3318395f2f428c126b7963a33e91cad16ae30510/src/bridge/SequencerInbox.sol) to support new entry-point function for processing eigenda batch types (i.e, `addSequencerL2BatchFromEigenDA`)
    - Verifies certificates against stateful dependency `RollupManager.sol` contract which handles communication with `EigenDAServiceManager.sol`
    - Updated data hash computation where `hash = keccak256(msgHeader, bytePrefixFlag, abi.Pack(commitment.X, commitment.Y, blob.len()))`
- Updated forge [tests](https://github.com/Layr-Labs/nitro-contracts/blob/3318395f2f428c126b7963a33e91cad16ae30510/test/foundry/SequencerInbox.t.sol#L568-L691) to verify inbox submission flow
- Updated deployment scripts to deploy a contract adhering to the `RollupManager` interface which lives as part of the `RollupDeployer` contract parameters and is set to the `SequencerInbox` storage after deployment. Currently the only supported contracts with this interface are the `L1BlobVerifier` and `L2BlobVerifier` contracts which perform alternative verifications based on the parent chain depth. 

#### [Nitro TestNode](https://github.com/Layr-Labs/nitro-testnode)

- [Updated](https://github.com/Layr-Labs/nitro-testnode/blob/000763087e26b23f13930e5c91f8066a45b5adfa/scripts/config.ts) `config.ts` to enable eigenda system flow
- [Updated](https://github.com/Layr-Labs/nitro-testnode/blob/000763087e26b23f13930e5c91f8066a45b5adfa/docker-compose.yaml#L364-L373) `docker-compose.yml` to use eigenda-proxy dependency with
- [Updated](https://github.com/Layr-Labs/nitro-testnode/blob/000763087e26b23f13930e5c91f8066a45b5adfa/test-node.bash#L219) core bash script to deploy and teardown eigenda-proxy resource
- Added a monitoring [flag](https://github.com/Layr-Labs/nitro-testnode/blob/345f178d26692456df1e1ad8d72ad90676529777/test-node.bash#L205) to bash script to allow for spinning up observability (i.e, grafana, loki log aggregation)
- Added a flood [script](https://github.com/Layr-Labs/nitro-testnode/blob/345f178d26692456df1e1ad8d72ad90676529777/scripts/flood.ts) to support traffic generation for specific data throughput rates (e.g, kb/s) against a testnode sequencer

#### [Nitro Go-Ethereum](https://github.com/Layr-Labs/nitro-go-ethereum-private)

- [Updated](https://github.com/Layr-Labs/nitro-go-ethereum-private/blob/5a2943cbed319de002d3cc326f9404e8c083950d/params/config_arbitrum.go#L138-L147) system configs to use eigenda field

## Fraud Proofs & Stateless Block Execution

### [Nitro](https://github.com/Layr-Labs/nitro)
- Default [encode](https://github.com/Layr-Labs/nitro/blob/e8981ff2f09720b6627e751d8bd3146277c7a01b/eigenda/reader.go#L61-L67) blobs (i.e, modulo encode, length prefix encoding, pad to nearest of 2) before pre-image injection to ensure data is in proper format for generating kzg commitments and witness proofs 
- [Decode](https://github.com/Layr-Labs/nitro/blob/e8981ff2f09720b6627e751d8bd3146277c7a01b/cmd/replay/main.go#L158-L178) blobs to raw binary or nitro compressed batch representation when reading
- [Generate](https://github.com/Layr-Labs/nitro/blob/e8981ff2f09720b6627e751d8bd3146277c7a01b/eigenda/types.go#L25-L40) pre-image hashes using the length and commitment fields provided by the eigenda certificate which is persisted into the sequencer inbox

**Arbitrator**

- [Extended](https://github.com/Layr-Labs/nitro/blob/e8981ff2f09720b6627e751d8bd3146277c7a01b/arbitrator/arbutil/src/types.rs#L23) arbitrator to use an eigenda preimage type which is targeted during transpilation from host go code (i.e, `WavmReadEigenDAHashPreimage`)
- Embed mainnet SRS values into test-files subdirectory (i.e, `g1.point`, `g2.point`, `g2.point.powerOf2`)
- [Updated](https://github.com/Layr-Labs/nitro/blob/e8981ff2f09720b6627e751d8bd3146277c7a01b/arbitrator/prover/src/machine.rs#L3051-L3055) machine proof serialization logic to target `prove_kzg_preimage_bn254` when `preimage.type() == PreimageType::EigenDAHash`
- Add custom proof generation logic for `READPREIMAGE` opcode with `EigenDAHash` type which computes a machine state proof containing a kzg proof using a point opening at the 32 byte offset.
- [Extended](https://github.com/Layr-Labs/nitro/blob/e8981ff2f09720b6627e751d8bd3146277c7a01b/arbitrator/prover/src/kzgbn254.rs) E2E proof equivalence tests to serialize machine state proofs using EigenDA preimage types and ensure that post-states when one step proven on-chain match the post-state machine hashes generated by the off-chain arbitrator opcode test
- Built [kzg-bn254 library](https://github.com/Layr-Labs/rust-kzg-bn254) for performing kzg operations over the bn254 curve in rust 

**Validator**

[Updated](https://github.com/Layr-Labs/nitro/blob/e8981ff2f09720b6627e751d8bd3146277c7a01b/cmd/replay/main.go#L244) replay script (`replay/main.go`)  to use `eigenDAReader` when populating pre-image oracle for stateless block execution. EigenDA preimage type hashes are computed as:

```jsx
keccak256(commitment.X, commitment.Y, preimage.len())
```

Computing the length as part of the preimage hash is necessary for removing a trust assumption on a bridge validator. Unlike 4844, EigenDA preimages are variadic in size. 

### [Nitro Contracts](https://github.com/Layr-Labs/nitro-contracts)

- [Extended](https://github.com/Layr-Labs/nitro-contracts/blob/3318395f2f428c126b7963a33e91cad16ae30510/src/osp/OneStepProverHostIo.sol#L320-L407) `OneStepProverHostIO.sol` to perform bn254 kzg pairing verifications for an opening proof provided by a challenger
- [Added](https://github.com/Layr-Labs/nitro-contracts/blob/3318395f2f428c126b7963a33e91cad16ae30510/test/foundry/KZGbn254.t.sol) forge tests to assert the correctness of proof verification logic
