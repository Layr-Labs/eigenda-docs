---
sidebar_position: 1
title: Golang Client
---

# EigenDA Payment and Blob Dispersal Guide
This guide walks through the process of setting up payments and dispersing blobs using EigenDA.

## On Demand Data Dispersal
### On-chain setup
To disperse to the network you will need a balance to pull from. If you would like to learn more about EigenDA's Payment Module, check the reference *here (insert ref to Payments)*.

To start make sure you have ETH on the Ethereum Holesky testnet, we'll deposit into the payment vault and then any other DA requests charges will be pulled from here. 

To start we will deposit into the payment vault using `Foundry's` `cast`. If you have not installed Foundry, follow their install commands [here](https://book.getfoundry.sh/getting-started/installation). 

This will deposit 1 ETH into the Payment Vault on Holesky.


```bash
cast send --rpc-url <YOUR_RPC_URL> \
 --private-key <YOUR_PRIVATE_KEY> \
 0x3660d586f792320a1364637715ca7e9439daa2c7 \
 "depositOnDemand(address)" \
<YOUR_ADDRESS> \
 --value 100000000000000000
```
Now that we have the account setup for on-demand payments, let's disperse data.

## Dispersing Data
### Setup
To disperse a data, we'll start by setting up our `Disperser Client` to interact with the EigenDA disperser.

Let's start by setting up a project directory
```bash
mkdir v2disperse
cd v2disperse
```
Setup your environment by setting your private key in a `.env` file with the `EIGENDA_AUTH_PK` value set to your private key for the account dispersing data. 
```bash
echo "EIGENDA_AUTH_PK=your_private_key_here" > .env
```

We'll be working out of a `main.go` file
```bash
touch main.go
```
### Implementation
#### 1. Import Dependencies
```Golang
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/Layr-Labs/eigenda/api/clients/v2"
	authv2 "github.com/Layr-Labs/eigenda/core/auth/v2"
	corev2 "github.com/Layr-Labs/eigenda/core/v2"
	"github.com/Layr-Labs/eigenda/encoding/utils/codec"
)
``` 

#### 2. Create Disperser Client
<!-- Notes -->
<!-- This should be the same account as you deposited using -->
<!-- Each request will be  -->
:::note
Your signer should be the same address you deposited from
:::
```Golang
signer := authv2.NewLocalBlobRequestSigner(authKey)
disp, err := clients.NewDisperserClient(&clients.DisperserClientConfig{
	Hostname:          "disperser-preprod-holesky.eigenda.xyz",
	Port:              "443",
	UseSecureGrpcFlag: true,
}, signer, nil, nil)
if err != nil {
	println("Error creating disperser client")
	panic(err)
}
```


#### 3. Setup Context and Data
```Golang
ctx, cancel := context.WithTimeout(context.Background(), time.Second*30)
defer cancel()
```

#### 4. Data to Send
```Golang
bytesToSend := []byte("Hello, World!")
bytesToSend = codec.ConvertByPaddingEmptyByte(bytesToSend)
quorums := []uint8{0, 1}
```
#### 5. Dispersing Data
Call `DisperseBlob()` to send your data to EigenDA
```Golang
status, request_id, err := disp.DisperseBlob(ctx, bytesToSend, 0, quorums, 0)
if err != nil {
	panic(err)
}
```