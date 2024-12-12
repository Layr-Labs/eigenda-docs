---
title: Deploying a new chain
---

# Arbitrum Orbit Deployment

[Arbitrum
Orbit](https://docs.arbitrum.io/launch-orbit-chain/orbit-gentle-introduction) is
a Rollup Development Kit (RDK) developed by [Offchain
Labs](https://www.offchainlabs.com/) to enable rollup developers to build
 using the same software that powers *Arbitrum One* and *Arbitrum Nova*.

## EigenDA Proxy

Arbitrum nodes communicate with EigenDA via the proxy for secure communication and low code overhead. More information can be found [here](./../../dispersal/clients/eigenda-proxy.md). An instance of proxy **must** be spun-up to use this integration. In your node config, this will look like:
```
"eigen-da": {"enable": true,"rpc": "http://eigenda_proxy:4242"}
```

## How to deploy a Rollup Creator integrated with EigenDA

1. Assuming you have yarn and hardhat installed. 

2. Download the nitro contracts source [code](https://github.com/Layr-Labs/nitro-contracts) from the EigenDA fork using latest stable version.

3. Specify required environment variables: `DEPLOYER_PRIVKEY`, `PARENT_CHAIN_RPC`, and `EIGENDA_ROLLUP_MANAGER_ADDRESS`. Optionally, you can also specify `MAX_DATA_SIZE`, `FEE_TOKEN_ADDRESS`, and `CREATOR_DEPLOYMENT_INFO`. 

    **If the `EIGENDA_ROLLUP_MANAGER_ADDRESS` is unspecified, then one will be deployed automatically based on the parent chain context.**

4. Run the rollup creator deployment script that deploys all necessary contracts and sets up the rollup creator template.
```
yarn hardhat run scripts/local-deployment/deployCreator.ts
```

The script will take a few minutes to complete as it prints out the addresses of the deployed contracts along the way. Lastly, the script will write the deployed contracts to the `CREATOR_DEPLOYMENT_INFO` file you specified. Upon completion, your rollup creator factory is ready to use to deploy new chains. 

## How to deploy a Rollup using our Rollup Creators
We support rollup creators using EigenDA contracts on the following networks:

| version | network | address |
|---------|---------|---------|
| v2.1.0  | Ethereum Holesky | 0x4449adCcad953ce8feB2FD50707B17f876bBDEf4 |
| v2.1.0  | Arbitrum Sepolia | 0x1d9038cA6EF28a21Ef768db7BA697bD0794b48C4 |

### Deploy using our hosted Rollup Creators
The Orbit [documentation](https://docs.arbitrum.io/launch-orbit-chain/how-tos/orbit-sdk-deploying-rollup-chain) provides a comprehensive overview for how one can trigger new chain deployments using already deployed rollup creators. If you'd like to leverage the orbit-sdk please use our fork [here](https://github.com/Layr-Labs/eigenda-orbit-sdk).

## How to deploy a Rollup on Testnet using our UI

While you can interact with the deployed Rollup creator directly, we recommend using our [orbit chain deployment portal](https://orbit.eigenda.xyz/) to deploy a rollup for a friendlier devx and easy-to-use configs. Currently, the only supported testnets are:
- Ethereum Holesky
- Arbitrum Sepolia

### Steps

1. Start by clicking the button "Launch on holesky testnet" and connect a wallet using your preferred wallet provider. 

2. Choose EigenDA as the Chain Type, and click Next.

3. Customize your rollup's configurations, such as the Chain ID, Chain Name, Batch posters, Validators, EigenDA Rollup Manager, and more. 

4. Click "Deploy" and sign the transaction to create the rollup contracts. 

5. Once your rollup is deployed, you will be redirected to review the rollup configurations. Make sure to download the zip file containing your chain and node config files, and store them somewhere handy.

6. Go to the next page and follow the instructions there to set up a nitro sequencer using the downloaded config files to power the rollup. If you've completed these steps successfully, you are now running an Arbitrum Orbit rollup that uses EigenDA!

## Token Bridge

The Arbitrum token bridge can be enabled to support L1 to/from L2 bridging of ERC-20 assets. Since the token bridge is a wrapper on-top of the existing L1 to/from L2 native bridge, there are no changes necessary to enable it. Additionally, the [existing](https://docs.arbitrum.io/build-decentralized-apps/reference/contract-addresses#token-bridge-smart-contracts) token bridge creators maintained by Offchain labs can be leveraged to deploy token bridges on-top of existing inboxes integrated EigenDA.


### Troubleshooting

1. If your nitro setup script node encounters a warning `error getting latest batch count: no contract code at given address`, you should first verify that:
    A. That the `SequencerInbox` entry in your `/config/orbitSetupScriptConfig` maps to a successfully deployed contract
    B. Your RPC provider is sufficiently reliably. Transient errors are common when leveraging free and public RPC providers
