# EigenDA Proxy (V1)

## About
See [this page](../../../eigenda-proxy.md) for a high level description of the proxy.

### Key Releases
| version | (mainnet) max blob size | (holesky) max blob size | supported stacks   | Cert version(s) |
|---------|-------------------------|-------------------------|--------------------|-----------------|
|  v1.3.1 |        `2mib`           |          `2mib`         |      OP Stack      |      v0         |
|  v1.4   |        `4mib`           |          `16mib`        |      OP Stack      |      v0         |
|  v1.4.1 |        `16mib`          |          `16mib`        |  OP Stack, Orbit   |      v0         |

## Recommended Config Types
Different security measures and runtime optimizations can be applied through various proxy configurations.
To view the extensive list of available flags/env-vars to configure a given version of eigenda-proxy, run `eigenda-proxy --help`.
The following recommendations are advised for different rollup node actor types:

### Batchers
Privileged roles that are responsible for submitting rollup batches to EigenDA should have the following presets:
- Certificate verification enabled. If the rollup (stage = 0) doesn't verify DA certs against the `EigenDAServiceManager` for writing then a `ETH_CONFIRMATION_DEPTH` should be reasonably set (i.e, >= 6). Otherwise, a certificate could be submitted to the sequencer's inbox using an EigenDA blob batch header which is reorged from Ethereum.

### Bridge Validators
Validators that are responsible for defending or progressing a child --> parent chain withdraw bridge should be configured with the following:
- Certificate verification enabled
- Read fallback configured with a secondary backend to ensure blobs can be read in the event of EigenDA retrieval failure

### Permissionless Verifiers
- Certificate verification enabled
- Use of a cached backend provider which ensures data read from EigenDA is only done once
