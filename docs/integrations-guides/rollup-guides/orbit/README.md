---
title: Overview
---
# Arbitrum Orbit Overview

[Arbitrum
Orbit](https://docs.arbitrum.io/launch-orbit-chain/orbit-gentle-introduction) is
a Rollup Development Kit (RDK) developed by [Offchain
Labs](https://www.offchainlabs.com/) to enable rollup developers to build
 using the same software that powers *Arbitrum One* and *Arbitrum Nova*.


## How to deploy a Rollup Creator integrated with EigenDA

0. Assuming you have yarn and hardhat installed. 

1. Download the nitro contract source [code](https://github.com/Layr-Labs/nitro-contracts) from the EigenDA fork.

2. Specify required environment variables: `DEPLOYER_PRIVKEY`, `PARENT_CHAIN_RPC`, and `EIGENDA_ROLLUP_MANAGER_ADDRESS`. Optionally, you can also specify `MAX_DATA_SIZE`, `FEE_TOKEN_ADDRESS`, and `CREATOR_DEPLOYMENT_INFO`.

3. Run the rollup creator deployment script that deploys all necessary contracts and sets up the rollup creator template.
```
yarn hardhat run scripts/local-deployment/deployCreator.ts
```

The script will take a few minutes to complete as it prints out the addresses of the deployed contracts along the way. Lastly, the script will write the deployed contracts to the CREATOR_DEPLOYMENT_INFO file you specified. Upon completion, your rollup creator is ready to use. 

## How to deploy a Rollup on Testnet

While you can interact with the deployed Rollup creator directly, we recommend using the [EigenDA x Orbit chain deployment portal](https://orbit.eigenda.xyz/) to deploy a rollup for a friendly UX. Currently, the only supported tesnet is Ethereum Holesky. 

1. Start by clicking the button "Launch on holesky testnet" and connect a wallet using your preferred wallet provider. 

2. Choose EigenDA as the Chain Type, and click Next.

3. Customize your rollup's configurations, such as the Chain ID, Chain Name, Batch posters, Validators, EigenDA Rollup Manager, and more. 

4. Click "Deploy" and sign the transaction to create the rollup contracts. 

5. Once your rollup is deployed, you will be redirected to review the rollup configurations. Make sure to download the zip file containing your chain and node config files, and store them somewhere handy.

6. Go to the next page and follow the instructions there to set up nitro nodes using the downloaded config files to power the rollup. If you've completed these steps successfully, you are now running an Orbit rollup that uses EigenDA!

### Troubleshooting

1. If your nitro node encounters a warning `error getting latest batch count: no contract code at given address`, you can check the deployed contracts using the following command:

Check the deployed sequencer inbox address specified in your `OrbitSetupScriptConfig.json` file:
```
## Check if the sequencer inbox address has code deployed
curl --location $ETH_RPC_URL \ 
--header 'Content-Type: application/json' \
--data '{"method":"eth_getCode","params":["__SEQUENCER_INBOX_ADDRESS__","latest"],"id":1,"jsonrpc":"2.0"}'
```

If the deployment process was successful, you should see the code for the sequencer inbox contract. If you received `0x` as the response, something went wrong in the deployment process. This should not have happened. You might want to try deploying the rollup again or contact support. This warning might process for up to an hour for the batch poster to eventually find the correct block number where the sequencer inbox has been deployed. 

> Deploying the rollup creator and creating a rollup can be run together with one command: `yarn hardhat run scripts/local-deployment/deployCreatorAndCreateRollup.ts`, but the provided UI separates these concerns and is more user friendly. 

# Changeset Overview
Many modifications were made to successfully support fraud proofs and secure batch posting. A technical summary is explained below:

### Batch Submission & Derivation
#### [Nitro](https://github.com/Layr-Labs/nitro)

- Extended batch poster to take in an `eigenDAWriter` struct that writes blobs to DA via eigenda-proxy
    - Embed ABI calldata for tx submissions to `SequencerInbox`
- Extended inbox reader to support type processing for an eigenda batch type (i.e, `0xed` prefix)
- Compute `batchHeaderHash` locally using `batchHeader` fields when querying blobs from eigenda proxy
- Updated batch poster config to support 2MB batches when using eigenda

#### [Nitro Contracts](https://github.com/Layr-Labs/nitro-contracts)

- Extended `SequencerInbox.sol`  to support new entry-point function for processing eigenda batch types (i.e, `addSequencerL2BatchFromEigenDA`)
    - Verifies certificates against stateful dependency `RollupManager.sol` contract which handles communication with `EigenDAServiceManager.sol`
    - Verifies `L1BlockReferenceNumber` to ensure the certificate was confirmed within the last 100 L1 blocks
    - Updated data hash computation where `hash = keccak256(msgHeader, bytePrefixFlag, abi.Pack(commitment.X, commitment.Y, blob.len()))`
- Updated forge unit tests to verify inbox submission flow
- Updated deployment scripts to deploy a `RollupManager` contract which lives as part of the `RollupDeployer` contract parameters and is set to the `SequencerInbox` storage after deployment
- Updated core node configuration to support eigenda config type
    - Support `MaxEigenDABatchSize`  which current upper limit of `2,000,000` bytes

#### [Nitro TestNode](https://github.com/Layr-Labs/nitro-testnode)

- Updated `config.ts` to enable eigenda system flow
- Updated `docker-compose.yml` to use eigenda-proxy dependency with mem-store
- Updated core bash script to deploy and teardown eigenda-proxy resource

#### [Nitro Go-Ethereum](https://github.com/Layr-Labs/nitro-go-ethereum-private)

- Updated system configs to use eigenda field

## Fraud Proofs & Stateless Block Execution

#### [Nitro](https://github.com/Layr-Labs/nitro)
- Default encode blobs (i.e, modulo encode, length prefix encoding, pad to nearest of 2) before pre-image injection to ensure data is in proper format for generating kzg commitments and witness proofs 
- Decode blobs to raw binary or nitro compressed batch representation when reading
- Generate pre-image hashes using the length and commitment fields provided by the eigenda certificate which is persisted into the sequencer inbox

**Arbitrator**

- Extended arbitrator to use an eigenda preimage type which is targeted during transpilation from host go code (i.e, `WavmReadEigenDAHashPreimage`)
- Embed mainnet SRS values into test-files subdirectory (i.e, `g1.point`, `g2.point`, `g2.point.powerOf2`)
- Updated machine proof serialization logic to target `prove_kzg_preimage_bn254` when `preimage.type() == PreimageType::EigenDAHash`
- Add custom proof generation logic for `READPREIMAGE` opcode with `EigenDAHash` type which computes a machine state proof containing a kzg proof using a point opening at the 32 byte offset. The machine state proof buffer format is as follows:

```jsx
            // [:32] - preimage hash (eigenlayer)
            // [32:64] - evaluation point
            // [64:96] - expected output
            // [96:224] - g2TauMinusG2z
            // [224:288] - kzg commitment (g1)
            // [288:352] - proof (g1)
            // [352:358] - preimage length
```
- Extended E2E proof equivalence tests to serialize machine state proofs using EigenDA preimage types and ensure that post-states when one step proven on-chain match the post-state machine hashes generated by the off-chain arbitrator opcode test
- Built [kzg-bn254 library](https://github.com/Layr-Labs/rust-kzg-bn254) for performing kzg operations over the bn254 curve in rust 

**Validator**

**Updated** replay script (`replay/main.go`)  to use `eigenDAReader` when populating pre-image oracle for stateless block execution. EigenDA preimage hashes are computed as:

```jsx
keccak256(commitment.X, commitment.Y, preimage.len())
```

Computing the length as part of the preimage hash is necessary for removing a trust assumption on the one-step-proof challenger. Unlike 4844, EigenDA preimages are variadic in size. 

#### [Nitro Contracts](https://github.com/Layr-Labs/nitro-contracts)

- Extended `OneStepProverHostIO.sol` to perform bn254 kzg verification for an opening proof provided by a challenger
- Added forge tests to assert the correctness of proof verification logic

## Deployment Tooling

#### [Orbit SDK](https://github.com/Layr-Labs/eigenda-orbit-sdk)
- Extended orbit SDK to generate rollup system configurations using EigenDA metadata fields.
- Updated rollup creator addresses to use EigenDA rollup creator for bootstrapping new chains.s


#### [Orbit Setup Script](https://github.com/Layr-Labs/eigenda-orbit-setup-script)
- Extended setup script docker compose to use an eigenda-proxy container configured for communication with holesky

#### [Orbit Deployment UI](https://github.com/Layr-Labs/eigenda-orbit-deployment-ui)
- Reworked orbit deployment UI to support deploying system contracts through EigenDA rollup creator
- 