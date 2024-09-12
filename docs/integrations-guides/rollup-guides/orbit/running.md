---
title: Deployment Overview
---

# Arbitrum Orbit Deployment Overview

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
