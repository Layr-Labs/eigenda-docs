---
title: Deployment Overview
---

# Arbitrum Orbit Deployment Overview

[Arbitrum
Orbit](https://docs.arbitrum.io/launch-orbit-chain/orbit-gentle-introduction) is
a Rollup Development Kit (RDK) developed by [Offchain
Labs](https://www.offchainlabs.com/) to enable rollup developers to build
 using the same software that powers *Arbitrum One* and *Arbitrum Nova*.


 ## ETH Layer2 vs Layer3 deployments
Layer3s using Arbitrum with EigenDA are a [M0 integration](../integrations-overview.md#trusted-verification-strategy-m0-m0) unlike Layer2s which are [M1](../integrations-overview.md#l2-inbox-certificate-verification-strategy-m1-m1). This means both degraded security and throughput when currently using L3s with EigenDA. 

EigenDA bridging is currently only supported on Ethereum, meaning that layer 3s settling to a layer2 can't:
- Rely on cert verification within the `Sequencer Inbox` contract
- Await disperser confirmations via eigenda proxy for accrediting batches

Currently for L3 deployments, we recommend ensuring that `EIGENDA_PROXY_EIGENDA_ETH_CONFIRMATION_DEPTH` is set closer to ETH finalization (i.e, 64 blocks or two consensus epochs) since a reorg'd EigenDA bridge confirmation tx wouldn't be detectable by the rollup itself. This risk is nonexistent for L2s settling to Ethereum since the inbox's EigenDA certificate tx would read storage states on the `EigenDAServiceManger` which are set by the EigenDA bridge confirmation tx; meaning that a reorg of the EigenDA bridge confirmation tx would result in a reorg of the inbox's EigenDA certificate tx.

If you wish to support higher throughput L3s with reduced risk, you can configure your EigenDA proxy instance with secondary storage fallbacks. This would at least ensure that if the blob certificate were to be invalidated the data would still be partially available. This could have dramatic effects to and would compromise the trust model of the rollup given an honest verifier node could when syncing from a confirmed chain head and would have to trust the sequencer.

## EigenDA Proxy
Arbitrum nodes communicate with EigenDA via the proxy for secure communication and low code overhead. More information can be found [here](./../../dispersal/clients/eigenda-proxy.md). An instance of proxy **must** be spun-up to use this integration. In your node config, this would look something like:
```
"eigen-da": {"enable": true,"rpc": "http://eigenda_proxy:4242"}
```


## How to deploy a Rollup Creator integrated with EigenDA

0. Assuming you have yarn and hardhat installed. 

1. Download the nitro contracts source [code](https://github.com/Layr-Labs/nitro-contracts) from the EigenDA fork using latest stable version.

2. Specify required environment variables: `DEPLOYER_PRIVKEY`, `PARENT_CHAIN_RPC`, and `EIGENDA_ROLLUP_MANAGER_ADDRESS`. Optionally, you can also specify `MAX_DATA_SIZE`, `FEE_TOKEN_ADDRESS`, and `CREATOR_DEPLOYMENT_INFO`. If the `EIGENDA_ROLLUP_MANAGER_ADDRESS` is unspecified, then one will be deployed automatically based on the parent chain context. 

3. Run the rollup creator deployment script that deploys all necessary contracts and sets up the rollup creator template.
```
yarn hardhat run scripts/local-deployment/deployCreator.ts
```

The script will take a few minutes to complete as it prints out the addresses of the deployed contracts along the way. Lastly, the script will write the deployed contracts to the `CREATOR_DEPLOYMENT_INFO` file you specified. Upon completion, your rollup creator factory is ready to use to deploy new chains. 

## How to deploy a Rollup on Testnet

While you can interact with the deployed Rollup creator directly, we recommend using the [EigenDA x Orbit chain deployment portal](https://orbit.eigenda.xyz/) to deploy a rollup for a friendly UX and easy-to-use configs. Currently, the only supported testnets are Ethereum Holesky and Arbitrum Sepolia.

1. Start by clicking the button "Launch on holesky testnet" and connect a wallet using your preferred wallet provider. 

2. Choose EigenDA as the Chain Type, and click Next.

3. Customize your rollup's configurations, such as the Chain ID, Chain Name, Batch posters, Validators, EigenDA Rollup Manager, and more. 

4. Click "Deploy" and sign the transaction to create the rollup contracts. 

5. Once your rollup is deployed, you will be redirected to review the rollup configurations. Make sure to download the zip file containing your chain and node config files, and store them somewhere handy.

6. Go to the next page and follow the instructions there to set up a nitro sequencer using the downloaded config files to power the rollup. If you've completed these steps successfully, you are now running an Arbitrum Orbit rollup that uses EigenDA!

## Token Bridge
The Arbitrum token bridge can be enabled to support L1 <-> L2 bridging of ERC-20 assets. Since the token bridge is a wrapper on-top of the existing L1 <-> L2 native bridge, there are no changes necessary to enable it. Additionally, the [existing](https://docs.arbitrum.io/build-decentralized-apps/reference/contract-addresses#token-bridge-smart-contracts) token bridge creators maintained by Offchain labs can be leveraged to deploy token bridges on-top of existing inboxes integrated EigenDA.


### Troubleshooting

1. If your nitro setup script node encounters a warning `error getting latest batch count: no contract code at given address`, you should first verify that:
    A. That the `SequencerInbox` entry in your `/config/orbitSetupScriptConfig` maps to a successfully deployed contract
    B. Your RPC provider is sufficiently reliably. Transient errors are common when leveraging free and public RPC providers
