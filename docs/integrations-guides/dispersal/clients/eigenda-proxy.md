# EigenDA Proxy

## About
EigenDA proxy is a sidecar server ran as part of a rollup node cluster for communication with the EigenDA network. 

### Key Releases
| version | (mainnet) max blob size | (holesky) max blob size | supported stacks   | Cert version |
|---------|-------------------------|-------------------------|--------------------|--------------|
|  v1.3.1 |        `2mib`           |          `2mib`         |      OP Stack      |      v0      |
|  v1.4   |        `4mib`           |          `16mib`        |      OP Stack      |      v0      |

### Example Rollup interaction diagram
*Shown below is a high level flow of how proxy is used across a rollup stack by different network roles (i.e, sequencer, verifier). Any rollup node using an eigenda integration who wishes to sync directly from the parent chain inbox or a safe head must run this service to do so.*


![Proxy usage diagram](/img/eigenda/eigenda-proxy-usage-diagram.png)


### Usage
Different actors in the rollup topology will have to use proxy for communicating with EigenDA in the following ways:
- **Rollup Sequencer:** posts batches to proxy and submits accredited DA certificates to batch inbox
- **Rollup Verifier Nodes:** read batches from proxy to update a local state view (*assuming syncing from parent chain directly)*

- **Prover Nodes:** both rollup types (i.e, optimistic, zero knowledge) will have some way of deriving child chain state from the parent's inbox for the purpose of generating child --> parent bridge withdraw proofs. These "proving pipelines" will also read from proxy as well; either for settling disputes in optimistic rollups with working fraud proofs or for generating zero knowledge proofs attesting to the validity of some batch execution. 

*E.g, In Arbitrum there is a `MakeNode` validator that posts state claims to the parent chain's rollup assertion chain. In the event of a challenge, both asserter/challenger players will have to pre-populate their local pre-image stores with batches read from the proxy to compute the WAVM execution traces that they will bisect over.*

## Technical Details

[EigenDA Proxy](https://github.com/Layr-Labs/eigenda-proxy) wraps the [high-level EigenDA client](https://github.com/Layr-Labs/eigenda/blob/master/api/clients/eigenda_client.go) with an HTTP server, and performs additional verification tasks when reading and writing blobs that eliminate any trust assumption on the EigenDA disperser service. Instructions for building and running the service can be found [here](https://github.com/Layr-Labs/eigenda-proxy/blob/main/README.md).

### Security Features

When writing to EigenDA, the proxy verifies that the BN254 KZG commitment of the data matches the commitment that the EigenDA Disperser dispersed, ensuring that the Disperser hasn't tampered with the data during dispersal. The proxy also verifies the DA certificate returned by the disperser upon successful dispersal. It does this by checking that the batch was successfully dispersed, i.e. that the aggregated batch signature was written to the EigenDAServiceManager contract on Ethereum, that the signature was valid, and that the blob appears within the batch merkle tree.

When reading from EigenDA, the proxy does something similar. After retrieving a blob from the disperser, it recomputes the blob's KZG commitment and verifies that it matches the expected commitment in the DA certificate. This ensures that the sequencer could never read incorrect data from EigenDA, and avoids a trust assumption on the EigenDA disperser.

