---
sidebar_position: 2
---

# OP Stack and EigenDA

[OP Stack](https://github.com/ethereum-optimism/optimism) is the set of software
components that run the [Optimism](https://l2beat.com/scaling/projects/op-mainnet) rollup and can be
deployed independently to power third-party rollups.

By default, the OP Stack sequencer's [op-batcher](https://github.com/ethereum-optimism/optimism/tree/develop/op-batcher) writes batches to Ethereum in the form of calldata or 4844 blobs to commit to the transactions included in the canonical L2 chain. In Alt-DA mode, the op-batcher and op-nodes (validators) are configured to talk to a third-party HTTP proxy server for writing (op-batcher) and reading (op-node) tx batches to and from DA. Optimism's Alt-DA [spec](https://specs.optimism.io/experimental/alt-da.html) contains a more in-depth breakdown of how these systems interact.

To implement this server spec, EigenDA provides [EigenDA Proxy](../../eigenda-proxy/eigenda-proxy.md) which is run as a dependency alongside OP Stack sequencers and full nodes to securely communicate with the EigenDA disperser.

## Our OP Fork

We currently maintain a [fork](https://github.com/Layr-Labs/optimism) of the OP Stack to provide [3 features](https://github.com/Layr-Labs/optimism?tab=readme-ov-file#fork-features) missing from the upstream OP Stack:
1. Performance: we enable high-throughput rollups via parallel blob submissions (see [Release 2](https://github.com/Layr-Labs/optimism/releases/tag/op-node%2Fv1.11.1-eigenda.2))
2. Liveness: we provide failover to Ethereum calldata if EigenDA is unavailable (see [Release 1](https://github.com/Layr-Labs/optimism/releases/tag/op-node%2Fv1.11.1-eigenda.1))
3. Safety: we are working on a fully secure integration, using our [hokulea](https://github.com/Layr-Labs/hokulea) extension to op's [rust derivation pipeline](https://github.com/op-rs/kona)

## Kurtosis Devnet

For a quick start to explore an eigenda-powered op rollup, we [extended](https://github.com/Layr-Labs/optimism/tree/eigenda-develop/kurtosis-devnet) op's kurtosis-devnet. Start by cloning the repo and cd'ing to the correct directory:
```bash
git clone git@github.com:Layr-Labs/optimism.git
cd optimism/kurtosis-devnet
```
Then take a look at the different just commands related to our devnet:
```bash
$ just --list
  [...] # other commands
  [eigenda]
  eigenda-devnet-add-tx-fuzzer ENCLAVE_NAME="eigenda-devnet" *ARGS=""
  eigenda-devnet-clean ENCLAVE_NAME="eigenda-devnet"
  eigenda-devnet-configs ENCLAVE_NAME="eigenda-devnet"
  eigenda-devnet-failback ENCLAVE_NAME="eigenda-devnet"
  eigenda-devnet-failover ENCLAVE_NAME="eigenda-devnet" # to failover to ethDA. Use `eigenda-devnet-failback` to revert.
  eigenda-devnet-grafana ENCLAVE_NAME="eigenda-devnet"
  eigenda-devnet-restart-batcher ENCLAVE_NAME="eigenda-devnet" # Restart batcher with new flags or image.
  eigenda-devnet-start VALUES_FILE="eigenda-template-values/memstore-concurrent-large-blobs.json" ENCLAVE_PREFIX="eigenda" # We also start a tx-fuzzer separately, since the optimism-package doesn't currently have that configurable as part of its package.
  eigenda-devnet-sync-status ENCLAVE_NAME="eigenda-devnet"
  eigenda-devnet-test-holesky *ARGS=""               # Take a look at how CI does it in .github/workflows/kurtosis-devnet.yml .
  eigenda-devnet-test-memstore *ARGS=""              # meaning with a config file in eigenda-template-values/memstore-* .
```

You can run `just eigenda-devnet-start` to start a devnet which will spin-up an [eigenda-proxy](../../eigenda-proxy/eigenda-proxy.md) in memstore mode, simulating EigenDA. To interact with the actual EigenDA [holesky](../../../networks/holesky.md) testnet, you can run `just eigenda-devnet-start "eigenda-template-values/holesky-concurrent-small-blobs.json"`. You will need to fill in the two missing secret values in that [config file](https://github.com/Layr-Labs/optimism/blob/e1d636081550caacae42d88b79404899f0e45888/kurtosis-devnet/eigenda-template-values/holesky-concurrent-small-blobs.json): `eigenda-proxy.secrets.eigenda.signer-private-key-hex` and `eigenda-proxy.secrets.eigenda.eth-rpc`. Feel free to modify any other values, or even modify the kurtosis eigenda [template file](https://github.com/Layr-Labs/optimism/blob/e1d636081550caacae42d88b79404899f0e45888/kurtosis-devnet/eigenda.yaml) directly if needed.

## Deploying

Deploy your OP Stack according to the official OP [deployment docs](https://docs.optimism.io/builders/chain-operators/tutorials/create-l2-rollup). Our fork currently only modifies the op-batcher and op-node, so make sure to also read the instructions below to deploy those.

### Deploying EigenDA Proxy

We push docker images to our [ghcr registry](https://github.com/Layr-Labs/eigenda-proxy/pkgs/container/eigenda-proxy) on every [release](https://github.com/Layr-Labs/eigenda-proxy/releases).

Make sure to read the different [features](https://github.com/Layr-Labs/eigenda-proxy?tab=readme-ov-file#features-and-configuration-options-flagsenv-vars) provided by the proxy, to understand the different flag options. We provide an example [holesky config](https://github.com/Layr-Labs/eigenda-proxy/blob/f2f4c94fc655965b7b3d414c89452bdbcc7659be/.env.example.holesky) for integrating with EigenDA V1.


### Deploying OP Node

In the op-node `rollup.json` configuration the following should be set:

```json
{
  "alt_da": {
    "da_commitment_type": "GenericCommitment",
    "da_challenge_contract_address": "0x0000000000000000000000000000000000000000",
    "da_challenge_window": 300,
    "da_resolve_window": 300
  }
}
```
Make sure to set `da_commitment_type` to use generic commitment instead of [keccak commitments](https://specs.optimism.io/experimental/alt-da.html#input-commitment-submission)! In generic mode, the dachallenge contract won't get deployed (see our analysis [analysis](#da-challenge-contract) as to why we don't use it). The other values are meaningless,
but they still need to be set somehow.


**op-node CLI configuration**

The following env config values should be set to ensure proper communication between op-node and eigenda-proxy, replacing `{EIGENDA_PROXY_URL}` with the URL of your EigenDA Proxy server.

- `OP_NODE_ALTDA_ENABLED=true`
- `OP_NODE_ALTDA_DA_SERVICE=true`
- `OP_NODE_ALTDA_VERIFY_ON_READ=false`
- `OP_NODE_ALTDA_DA_SERVER={EIGENDA_PROXY_URL}`

### Deploying OP Batcher

**op-batcher CLI configuration**

The following env config values should be set accordingly to ensure proper communication between OP Batcher and EigenDA Proxy, replacing `{EIGENDA_PROXY_URL}` with the URL of your EigenDA Proxy server.

- `OP_BATCHER_ALTDA_ENABLED=true`
- `OP_BATCHER_ALTDA_DA_SERVICE=true`
- `OP_BATCHER_ALTDA_VERIFY_ON_READ=false`
- `OP_BATCHER_ALTDA_DA_SERVER={EIGENDA_PROXY_URL}`
- `OP_BATCHER_ALTDA_MAX_CONCURRENT_DA_REQUESTS=1320`
- `OP_BATCHER_TARGET_NUM_FRAMES=8`

The above settings of `OP_BATCHER_TARGET_NUM_FRAMES=8` and `OP_BATCHER_ALTDA_MAX_CONCURRENT_DA_REQUESTS=1320` achieve a throughput of 1MiB blobs: submitting larger blobs (frames) is currently not permitted by the [op-node's derivation pipeline](https://github.com/ethereum-optimism/optimism/blob/c05f5adda536d6c24109613b51c01e0be859cef6/op-node/rollup/derive/frame.go#L14).

**Throughput analysis**

To reach a desired throughput, `OP_BATCHER_ALTDA_MAX_CONCURRENT_DA_REQUESTS` should be set to allow submitting enough parallel EigenDA blobs. Blob dispersals on EigenDA V1 mainnet currently take 10 mins for batching and 12 mins for Ethereum finality, which means a blob submitted to the eigenda-proxy could take up to 22 mins before returning. Thus, assuming blobs of 1MiB/s by setting `OP_BATCHER_TARGET_NUM_FRAMES=8`, in order to reach a throughput of 1MiB/s, which means 8 requests per second each blocking for possibly up to 22mins, we would need to send up to `60*22=1320` parallel requests.

**Failover**

Failover was added in this [PR](https://github.com/Layr-Labs/optimism/pull/34), and is automatically supported by the batcher. Each channel will first attempt to disperse to EigenDA via the proxy. If a `503` HTTP error is received, that channel will failover and be submitted as calldata to ethereum instead. To configure when the proxy returns `503` errors, see the [failover signals](https://github.com/Layr-Labs/eigenda-proxy?tab=readme-ov-file#failover-signals-) section of the Proxy README.

## Security Guarantees

The above setup provides a [trusted integration](../integrations-overview.md#trusted-integration) level of security guarantees without adding an unnecessary trust assumption on the EigenDA disperser.

### DA Challenge Contract

OP's Alt-DA spec includes a [DA challenge contract](https://specs.optimism.io/experimental/alt-da.html#data-availability-challenge-contract), which allows L2 asset-holders to prevent a data withholding attack executed by the sequencer or DA network. EigenDA does not make use of the challenge contract because not only is uploading high-throughput bandwidth onto Ethereum not physically possible, but even for low throughput rollups, the challenge contract is not economically viable. See [l2beat's analysis of the redstone rollup](https://l2beat.com/scaling/projects/redstone#da-layer-risk-analysis) or donnoh's [Universal Plasma and DA challenges](https://ethresear.ch/t/universal-plasma-and-da-challenges/18629) article for an economic analysis of the challenge contract.

This means that even if our op stack fork were to implement failover to keccak commitments (currently it is only possible to failover to ethereum calldata), using the challenge contract would not provide any additional security guarantees, which is why we recommend that every eigenda-op rollup uses GenericCommitments in their [rollup.json](#deploying-op-node) config.