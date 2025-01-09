---
sidebar_position: 1
title: Golang Client
---

# EigenDA Payment and Blob Dispersal Guide
This guide walks through the process of setting up payments and dispersing blobs using EigenDA.

## Setup
### Setting your account up
To disperse to the network you will need a balance to pull from. If you would like to learn more about EigenDA's Payment Module, check the reference *here*.

To start make sure you eth on holesky testnet, we'll deposit into the payment vault and then any other DA requests charges will be pulled from here. 

To start we will deposit into the payment vault using `Foundry's` `cast`. If you have not installed foundry, follow their commands [here](https://book.getfoundry.sh/getting-started/installation). 

This will deposit 1 ETH into the Payment Vault on Holesky.

```bash
cast send --rpc-url <YOUR_RPC_URL> \
 --private-key <YOUR_PRIVATE_KEY> \
 0x3660d586f792320a1364637715ca7e9439daa2c7 \
 "depositOnDemand(address)" \
<YOUR_ADDRESS> \
 --value 100000000000000000
```
Now that we have the account setup for on-demand payments, let's disperse a blob.

### Setting your disperser client
After depositing to the payment vault we'll set up the Disperser Client then send requests to the disperse 

Let's start by setting up a project directory
```
mkdir v2disperse
cd v2disperse
```
Setup your environment by setting your private key in a `.env` file with the `EIGENDA_AUTH_PK` value set to your private key for the account dispersing data. 

#### Dispersing data

***insert script*** 

