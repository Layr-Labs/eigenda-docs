---
title: Technical Overview
---

# Technical Diff Overview 
Many modifications were made to successfully support fraud proofs and secure batch posting. The following is an in-depth summary which describes the key changes made to the core Arbitrum stack to enable secure compatibility with EigenDA.

### Batch Submission & Derivation
#### [Nitro](https://github.com/Layr-Labs/nitro)

- [Extended](https://github.com/Layr-Labs/nitro/blob/e8981ff2f09720b6627e751d8bd3146277c7a01b/arbnode/batch_poster.go#L113) batch poster to take in an `eigenDAWriter` struct that writes blobs to DA via eigenda-proxy
    - [Embed](https://github.com/Layr-Labs/nitro/blob/e8981ff2f09720b6627e751d8bd3146277c7a01b/arbnode/batch_poster.go#L1030-L1075) ABI calldata for tx submissions to `SequencerInbox`
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

## Peripheral Stack 

### [Orbit SDK](https://github.com/Layr-Labs/eigenda-orbit-sdk)

### [Orbit Setup Script](https://github.com/Layr-Labs/eigenda-orbit-setup-script)