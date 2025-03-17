---
sidebar_position: 2
---

# OP Stack and EigenDA

[OP Stack](https://stack.optimism.io/) is the set of [software
components](https://github.com/ethereum-optimism/optimism) that run the [Optimism](https://www.optimism.io/) rollup and can be
deployed independently to power third-party rollups.

By default, the OP Stack sequencer's [op-batcher](https://github.com/ethereum-optimism/optimism/tree/develop/op-batcher) writes batches to Ethereum in the form of calldata or 4844 blobs to commit to the transactions included in the canonical L2 chain. In Alt-DA mode, the op-batcher and op-nodes (validators) are configured to talk to a third-party HTTP proxy server for writing (op-batcher) and reading (op-node) tx batches to and from DA. Optimism's Alt-DA [spec](https://specs.optimism.io/experimental/alt-da.html) contains a more in-depth breakdown of how these systems interact.

To implement this server spec, EigenDA provides [EigenDA Proxy](../../../eigenda-proxy.md) which is run as a dependency alongside OP Stack sequencers and full nodes to securely communicate with the EigenDA disperser.

## Deploying

### Deploying EigenDA Proxy

First check out the version of the EigenDA proxy corresponding to the version of OP Stack you are deploying, and follow their `README.md` in that version:

| OP Stack Version                                                            | Compatible EigenDA Proxy Version                                         |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [v1.7.6](https://github.com/ethereum-optimism/optimism/releases/tag/v1.7.6) | [v1.0.0](https://github.com/Layr-Labs/eigenda-proxy/releases/tag/v1.0.0) |
| [v1.7.7](https://github.com/ethereum-optimism/optimism/releases/tag/v1.7.7) | [v1.2.0](https://github.com/Layr-Labs/eigenda-proxy/releases/tag/v1.2.0) |
| [v1.9.0](https://github.com/ethereum-optimism/optimism/releases/tag/v1.9.0) | [v1.4.0](https://github.com/Layr-Labs/eigenda-proxy/releases/tag/v1.4.0) |
| [v1.9.3](https://github.com/ethereum-optimism/optimism/releases/tag/v1.9.3) | [v1.5.0](https://github.com/Layr-Labs/eigenda-proxy/releases/tag/v1.5.0) |
| [v1.9.4](https://github.com/ethereum-optimism/optimism/releases/tag/v1.9.4) | [v1.6.0](https://github.com/Layr-Labs/eigenda-proxy/releases/tag/v1.6.0) |

The v1.9.3 op-stack release contains our concurrent batch submission [PR](https://github.com/ethereum-optimism/optimism/pull/11698) which is required for high-throughput EigenDA deployments.

:warning: PSA: High throughput rollups should not update to the [holocene hardfork](https://docs.optimism.io/builders/notices/holocene-changes#for-node-operators)! The new strict batch ordering rules (see [here](https://docs.optimism.io/builders/notices/holocene-changes) and [here](https://specs.optimism.io/protocol/holocene/derivation.html)) broke our concurrent blob submission flow. If you are forced to upgrade, due to following the superchain for eg., make sure to set MAX_CONCURRENT_DA_REQUESTS=1. This will unfortunately reduce your throughput. We have a fix [PR](https://github.com/ethereum-optimism/optimism/pull/13169) that is in the process of getting reviewed.

### Deploying OP Stack

Next deploy the OP Stack components according to the official OP Stack [deployment docs](https://docs.optimism.io/builders/chain-operators/tutorials/create-l2-rollup), but with the following modifications:

#### op-node rollup.json configuration

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
Only `da_commitment_type` is important, because eigenDA does not use da challenges.


#### op-node CLI configuration

The following env config values should be set to ensure proper communication between op-node and eigenda-proxy, replacing `{EIGENDA_PROXY_URL}` with the URL of your EigenDA Proxy server.

- `OP_NODE_ALTDA_ENABLED=true`
- `OP_NODE_ALTDA_DA_SERVICE=true`
- `OP_NODE_ALTDA_VERIFY_ON_READ=false`
- `OP_NODE_ALTDA_DA_SERVER={EIGENDA_PROXY_URL}`

#### op-batcher CLI configuration

The following env config values should be set accordingly to ensure proper communication between OP Batcher and EigenDA Proxy, replacing `{EIGENDA_PROXY_URL}` with the URL of your EigenDA Proxy server.

- `OP_BATCHER_ALTDA_ENABLED=true`
- `OP_BATCHER_ALTDA_DA_SERVICE=true`
- `OP_BATCHER_ALTDA_VERIFY_ON_READ=false`
- `OP_BATCHER_ALTDA_DA_SERVER={EIGENDA_PROXY_URL}`
- `OP_BATCHER_ALTDA_MAX_CONCURRENT_DA_REQUESTS=11000`
- `OP_BATCHER_TARGET_NUM_FRAMES=1`

Our high-throughput integration still sends single frames (128KiB each) as EigenDA blobs, but it's able to send them in parallel. Do make sure to set `OP_BATCHER_TARGET_NUM_FRAMES=1`, to pass this [check](https://github.com/ethereum-optimism/optimism/pull/11698/files#diff-c734d1296b2fd691221b92df3edf09c7533c507a74c2316117745c75c3ad5776R577). To reach a desired throughput, `OP_BATCHER_ALTDA_MAX_CONCURRENT_DA_REQUESTS` can then be set to allow submitting enough parallel EigenDA blobs. Blob dispersals on EigenDA mainnet currently take 10 mins for batching and 12 mins for Ethereum finality, which means a blob submitted to the eigenda-proxy could take up to 22 mins before returning. Thus, assuming we want to reach a throughput of 1MiB/s, which means 8 requests per second each blocking for possibly up to 22mins, we would need to send up to `8*60*22=10560` parallel requests. Above, we set `OP_BATCHER_ALTDA_MAX_CONCURRENT_DA_REQUESTS` to 11_000 to leave some breathing room in case of jitter.

The current settings don't make full use of EigenDA's large blobs capability, and force us to send small 128KiB blobs. We have an upstream [PR](https://github.com/ethereum-optimism/optimism/pull/12400) to enable multi-frame blobs to be constructed. The above settings could then be changed to `OP_BATCHER_TARGET_NUM_FRAMES=8` and `OP_BATCHER_ALTDA_MAX_CONCURRENT_DA_REQUESTS=1375` to send the same throughput but via 1MiB blobs (submitting larger blobs is currently not permitted by the op-node's derivation pipeline).

### Mainnet Keypair Registration

When you are ready to onboard your rollup to mainnet you can fill out the following form to get your keypair whitelisted: [https://forms.gle/niMzQqj1JEzqHEny9](https://forms.gle/niMzQqj1JEzqHEny9).

## Security Guarantees

This setup provides Stage 0 security guarantees without adding an unnecessary trust assumption on the EigenDA disperser. The EigenDA Proxy [docs page](../../../eigenda-proxy.md) and [repo readme](https://github.com/Layr-Labs/eigenda-proxy/blob/main/README.md) explain how this is achieved.

### OP Stack DA Challenge Contract

One new component of the OP Alt-DA interface is the [DA challenge contract](https://specs.optimism.io/experimental/alt-da.html#data-availability-challenge-contract), which allows L2 asset-holders to prevent a data withholding attack executed by the sequencer or DA network. EigenDA does not make use of the challenge contract because uploading high-throughput bandwidth onto Ethereum is not physically possible.

The EigenDA team has roadmap plans to implement fault proof support for EigenDA cert validity in order to provide full safety/liveness guarantees for OP Stack x EigenDA deployments.

## Roadmap

The EigenDA Rollup Integrations team is working to support OP Stack fault proofs and will post updates to [@eigen_da](https://x.com/eigen_da?lang=en).

## Contact

If you are a Rollup considering integrating with EigenDA and OP Stack - reach
out to our team to discuss how we can support and accelerate your onboarding:
[https://contact.eigenda.xyz/](https://contact.eigenda.xyz/)

If you are a Rollup developer and have questions on the integration - reach out
to our Support team via:
[https://support.eigenlayer.xyz/](https://support.eigenlayer.xyz/)
