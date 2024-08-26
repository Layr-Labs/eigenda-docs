---
title: Overview
---
# Arbitrum Orbit Overview

[Arbitrum
Orbit](https://docs.arbitrum.io/launch-orbit-chain/orbit-gentle-introduction) is
a Rollup Development Kit (RDK) developed by [Offchain
Labs](https://www.offchainlabs.com/) to enable rollup developers to build
rollups using the same software that powers *Arbitrum One* and *Arbitrum Nova*.
In partnership with AltLayer, we have forked the core component of Orbit,
[Nitro](https://github.com/layr-Labs/nitro), to add
[M0](../integrations-overview.md#M0) support for EigenDA. The M0 status of
this integration means that it is only designed for testnet.

## How to deploy a Rollup Creator integrated with EigenDA

0. Assuming you have yarn and hardhat installed. 

1. Download the nitro contract source [code](https://github.com/Layr-Labs/nitro-contracts) from the EigenDA fork.

2. Specify required environment variables: `DEPLOYER_PRIVKEY`, `PARENT_CHAIN_RPC`, and `EIGENDA_ROLLUP_MANAGER_ADDRESS`. Optionally, you can also specify `MAX_DATA_SIZE`, `FEE_TOKEN_ADDRESS`, and `CREATOR_DEPLOYMENT_INFO`.

3. Run the rollup creator deployment script that deploys all necessary contracts and sets up the rollup creator template.
```
yarn hardhat run scripts/local-deployment/deployCreator.ts
```

The script will take a few minutes to complete as it prints out the addresses of the deployed contracts along the way. Lastly, the script will store the deployed contracts into the CREATOR_DEPLOYMENT_INFO file you specified. Upon completion, your rollup creator is ready to use. 

## How to deploy a Rollup

While you can interact with the deployed Rollup creator directly, we recommend using the [EigenDA x Orbit chain deployment portal](https://orbit.eigenda.xyz/) to deploy a rollup for a friendly UX. 

1. Start by clicking the button to "Launch on holesky testnet" and connect a wallet through your preferred wallet provider. 

2. Customize your rollup's configurations, such as the chain name, chain id, max data size, Batch posters, validators, EigenDA Rollup Managers, and more. 

3. Click "Deploy" and sign the transaction to create the rollup. 

4. Once rollup is deployed, you will be redirected to view the rollup configurations, where you can download chain config and node config files. Store these files somewhere handy. 

5. Go to the next page and follow the instructions there to set up nitro nodes using the downloaded config files to power the rollup. If you've completed these steps successfully, you are now running an Orbit rollup that uses EigenDA!



> Deploying the rollup creator and creating a rollup can be ran together with one command: `yarn hardhat run scripts/local-deployment/deployCreatorAndCreateRollup.ts`, but the provided UI separates these concerns and is more user friendly. 

This documentation is under construction and will continue to change. For
technical questions and hand-on support please reach out to
[contact.eigenda.xyz](https://contact.eigenda.xyz).
