---
title: Payments
sidebar_position: 4
---

# Payments

EigenDA's payment system is currently centralized and coupled with the disperser. This document describes key components, use cases, design principles, and the system architecture. The aim is to facilitate reservation and on-demand payments for data dispersal, ensuring scalability and flexibility for users and operators. 

The system supports two payment methods:
- **Reservation Payments**: Pre-paid throughput guaranteed services for a fixed time period, preferential for users with consistent and predictable data dispersal needs.
- **On-Demand Payments**: Pre-paid services without throughput guarantees, allowing flexibility with data dispersal based on network conditions.

The system leverages a centralized disperser to handle accounting, metering, and validation of incoming payment requests. This initial approach assumes a trust model where participants trust the disperser for accurate metering and accounting.


## How Payments Work
### Involved Parties
- **Users**: Negotiate reservations with the EigenDA team and/or permissionlesslydeposit tokens for on-demand payments.
- **Disperser Clients**: Users runs a client instance to submit data for dispersal and manages payments.
- **Disperser Server**: The central entity responsible for processing payments and dispersing data.
- **Payment Vault**: Onchain smart contract for managing reservations and on-demand payments.
- **EigenDA Governance**: The EigenDA governance wallet manages the payment vault global parameters and reservations.


### Reservations

A reservation is defined on-chain, and is used to reserve a specific amount of throughput for a client, represented by a wallet address. The reservation is defined by a limit per period (`symbolsPerSecond`), start time (`startTimestamp`), end time (`endTimestamp`), allowed custom quorum numbers (`quorumNumbers`), and corresponding quorum splits (`quorumSplits`). All reservations shares global parameters including the reservation interval (`reservationPeriodInterval`) and minimum number of symbols per dispersal (`minNumSymbols`).

Symbols per second and the reservation period interval defines the maximum number of symbols that can be dispersed in a single reservation period. A symbol is defined as 32 bytes, and is measured by the length of the erasure coded blob. A disperser client attaches a reservation period index in the payment header to indicate which reservation period the request belongs to. The disperser server accounts for both delay in receival and reservation overflows. If the requests exceeds the allowed delay period or reservation overflows, then the request will be rejected. Once a reservation period is over, the disperser server and client will start considering a new reservation period. If the reservation limit is hit before the period ends, the client will switch to on-demand payments if it is available, or wait for the next reservation period.

As a default, EigenDA team will set reservation period interval to be 5 minutes, and minimum number of symbols per dispersal to be 4096 symbols (This is the size of a 128 KiB blob including metadata). As a user, consider sending requests with respect to these two parameters and your particular reservation's limited symbols per second. If you have a reservation with 100 symbols per second, the disperser will allow for 1 MiB of data to be dispersed every 5 minutes. If you would like to adjust your reservation limit, please contact the EigenDA team.


Below we provide a timeline of the reservation lifecycle.

```mermaid
timeline
title Reservation Lifecycle

section Before Reservation
Initialization: EigenDA sets on-chain reservation with ratelimit and active timestamps. 
: User sends data. Reservation not active -> Rejected/fallback.

section Reservation Active

Period 1    : startTimestamp -> Reservation active.
                        : User sends data. Within limit -> Dispersal OK.
                        : Overflow attempt -> Within overflow limit -> OK.

Period 2    : User sends data. Within regular limit -> OK.
            : User sends data. Overflow attempt -> exceeds overflow limit -> Reject.
            : User sends data -> Reject.

Period 3    : User sends data. Continue usage measurement from overflow bin at Period 1.

Period 4    : User sends data. Within limit -> OK.

section After Reservation End
 Post-expiry 
 : User sends data -> Rejected/fallback.
 : Contact EigenDA team to update validity timestamps

```

### On-Demand Payments

A on-demand payment can be created by depositing tokens into the payment vault contract for a particular account, in which the contract stores the total payment deposited to that account (`cumulativePayment`). All on-demand payments shares global parameters including the global symbols per second (`globalSymbolsPerSecond`), global rate interval (`globalRatePeriodInterval`), minimum number of symbols per dispersal (`minNumSymbols`), and the price per symbol (`pricePerSymbol`).

When a disperser client uses the on-demand payment method, the client will calculate the payment amount that is limited by `pricePerSymbol`, `minNumSymbols`, the size of the data to disperse, and the previously sent request. The disperser server take into account of the requests being received out of order and maintain the usages within a global rate limit. If the payment is not enough to cover the request or not valid with respect to previously received requests, or the dispersal is hitting global rate limit, the request will be rejected.

Initially, EigenDA team will set the price per symbol to be 0.4470 gwei, aiming for the price of `0.015ETH/GB`, or `2000gwei/128Kib` dispersal. We limit the global on-demand rate to be 131072 symbols per second and 30 second rate intervals; this allows for ~4 MiB of data to be dispersed every second on average, and the maximum single spike of dispersal to be ~120MiB over 30 seconds.

### Disperser Client requirements

A user may choose to implement their own accountant for the disperser client to use, or use the one implemented by EigenDA, which statelessly tracks the payment states. 

By interacting with the disperser server, the client trusts the disperser server to provide correct on-chain and off-chain payment information upon initialization.

To use the EigenDA's disperser client, as described above, the user will need either negotiate a reservation with the EigenDA team, or permissionlessly deposit tokens into the payment vault contract for the account they want to use. They will supply the corresponding private key to the client, which will be used to sign the blob dispersal requests.


#### System Architecture Diagrams


```mermaid
erDiagram
    DISPERSER

    PAYMENT_VAULT_CONTRACT

    BLOB_HEADER

    PAYMENT_HEADER
    
		
    CLIENT

    %% Relationships
    BLOB_HEADER }|--|| DISPERSER : "receive"
    BLOB_HEADER ||--|| PAYMENT_HEADER : "contain"

    DISPERSER ||--o| DISPERSER : "validate header"

    DISPERSER ||--|| PAYMENT_VAULT_CONTRACT : "periodic polls"

    DISPERSER ||--|{ Meterer : "usage tracking"

    DISPERSER ||--o| CLIENT : "dispersal response"
    BLOB_HEADER ||--o| CLIENT : "dispersal request"
```

Disperser client send a dispersal request containing payment header to the disperser, which will be verified by the disperser's meterer. If the payment is valid, the disperser will disperse the data and update the offchain payment state. The meterer maintains the payment state in the offchain state, and syncs to the payment contract onchain periodically. Currently, the meterer only reads from the on-chain payment contract, and does not make any state changes to the payment contract. Clients can query the disperser for their own offchain state for payment and usage information.


```mermaid
stateDiagram

    state PaymentSetup {
        EigenDAGovernance --> PaymentVault : set global parameters
        EigenDAGovernance --> PaymentVault : set reservations
        Client --> PaymentVault : permissionlessly deposit tokens
    }
    
        ClientRequest --> PaymentVault: Read state
    state ClientRequest {
        [*] --> Accountant: disperal request
        Accountant --> PaymentHeader: reservation or on-demand
        PaymentHeader --> BlobHeader : Fill in Payment
        ClientSigner --> BlobHeader : Signs
        PaymentHeader --> Accountant : Update local view
        BlobHeader --> [*] : Send Dispersal request
    }

    ClientRequest --> Disperser : client's blob header request
    Disperser --> DisperserCheck
    
    DisperserCheck --> PaymentVault: Read state
    state DisperserCheck {
        [*] --> ValidateRequest
        ValidateRequest --> RequestAuthenticated : Payment Authenticated
        ValidateRequest --> [*] : Invalid Authentication
        RequestAuthenticated --> [*]: Process payments
    }


		
    
    DisperserCheck --> ClientUpdate: Response

    state ClientUpdate {
        [*] --> Nothing: SuccessResponse
        [*] --> RollbackAndRetry : Rate-limit Failure
        [*] --> RollbackUpdateAndRetry : InsufficientService
    }
```

Client can query the disperser for their own offchain payment state, which includes the cumulative payment and the recent period usages. Clients' accountant will priortize using reservations before using on-demand payments.

 A client has their specific reservation parameters set on-chain, including timestamp validity, and period limit; all reservations adhere to the same reservation period interval. The disperser will track at least 4 periods per reservation, starting from the previous period to the period after next period. The previous period is used in case of request latency, and the period after next period is used to allow for reasonable overflows. 
 
 If a client used up the available symbols per a reservation period, the client can either wait for the next reservation period, or switch to on-demand payments. Our implementation of disperser client will automatically switch to on-demand payments when the reservation period's usage is depleted. The cumulative payment is incremented by the number of symbols in the blob times the price per symbol. Disperser will check the dispersal requests' cumulative payment against the local payment state, such that the partition of deposted tokens holds with respect to symbols per requests even if the requests arrived out of order. If the cumulative payment exceeds the client's on-chain deposit, cannot fit with the existing payment partitions, or hits the global rate limit, the request will be rejected.

