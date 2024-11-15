---
title: API Error Codes
sidebar_position: 4
---

# Centralized Payments Documentation

This documentation provides an overview of the Centralized Payments MVP for EigenDA. It describes key components, use cases, design principles, and the system architecture to implement centralized payments using a disperser-based solution. The aim is to facilitate reservation and on-demand payments for data dispersal, ensuring scalability and flexibility for users and operators. The document will also provide a high level roadmap for decentralizing the payments system.

EigenDA's centralized payments are designed to allow users to pre-pay for services, with two primary payment methods:
- **Reservation Payments**: Pre-paid throughput guaranteed services for a fixed time period.
- **On-Demand Payments**: Pre-paid services without throughput guarantees, allowing flexibility with data dispersal based on network conditions.

The system leverages a centralized disperser to handle accounting, metering, and validation of incoming payment requests. This initial approach assumes a trust model where participants trust the disperser for accurate metering and accounting.

### Design Principle
- Minimize locking mechanisms using optimistic concurrency control, allowing high-throughput concurrency.
- Assume no conflicts by default, with rollback mechanisms for data inconsistencies when required.

## Functionalities and Use Cases
### Supported Use Cases
1. **Reservation Payments**: Users can sign up for reserved bandwidth by pre-paying tokens. These reservations are defined by a fixed time period, rate limits, and other parameters negotiated between users and the EigenDA team.
2. **On-Demand Payments**: Users can deposit tokens to receive services on a pay-as-you-go basis without guaranteed bandwidth. This payment mode is deducted only upon successful data dispersal.
3. **Client Utility Functions**: Functions that allow users to determine their preferences for either reservation or on-demand services, enabling flexible service use.
4. **DA Node Operators**: DA node operators are not directly involved in the payments, which simplifies their operation and responsibilities.
5. **Statistics and APIs**: Disperser exposes statistics on pricing and reservation schedules to authenticated users.

### System Actors
- **Disperser Client**: Submits data for dispersal and manages payments via reservation or on-demand deposits.
- **Disperser**: The central entity responsible for processing payments, dispersing data, and managing reservations.
- **Payment Contract**: On-chain smart contract for managing reservations and on-demand payments.
- **DA Node Operator**: Provides data availability services and interacts indirectly with payment mechanisms.

## System Architecture
### High-Level Overview
The centralized payments system revolves around the following key entities:
- **Disperser**: The primary entity responsible for handling payments, metering, and data dispersal.
- **Client Request**: Users initiate requests to either create reservations or make on-demand payments. The disperser processes these requests according to predefined rules and parameters.
- **Meterer**: Handles accounting and tracks the usage of reserved or on-demand payments.
- **On-Chain and Off-Chain State**: A combination of on-chain smart contracts for reservations and persistent off-chain storage for on-demand state management.

> [!TODO]
>
> Add an ER diagram of the system architecture
> 
> Add a flowchart diagram of the payment flow

## Security Analysis
### Assumptions
- The disperser acts honestly, ensuring that all accounting and dispersal actions are performed correctly.
- Payments are pre-validated, ensuring that users can only receive services when they have a sufficient balance.

### Threats and Mitigations
- **Insufficient Payment Validation**: If a request does not meet the payment requirements, the disperser will reject the request to prevent unauthorized data dispersal.
- **Global Rate Limits**: Enforced to ensure that no single user can monopolize network resources, ensuring fair use among all participants.
- **Optimistic Concurrency**: Payment updates and rate checks are performed optimistically to minimize locking and prevent bottlenecks.

## Future Enhancements

### High-Level Roadmap to Decentralization

- **Decentralized Disperser**: The first step towards decentralization involves replacing the centralized disperser with a distributed network of dispersers. This approach will help eliminate single points of failure and improve the system's resilience. Each disperser node will be responsible for metering, payment validation, and data dispersal in a decentralized manner.
- **Global Rate Limiting**: Implement a decentralized global rate limiting mechanism. Instead of relying on a single disperser to enforce rate limits, a distributed consensus mechanism can be used to ensure fair bandwidth allocation across the network. 
- **Payment State Tracking**: Transition payment state tracking to a decentralized model. This will involve using distributed ledger systems to record payment transactions, ensuring that all payment actions are transparent and verifiable. Smart contracts can be employed to handle payment verification and updates.
- **Client-Side Payment Management**: Empower clients to manage their own payment states in a decentralized manner. Clients should be able to interact directly with smart contracts for both reservation and on-demand payments and independently verify their payment status and usage metrics.

