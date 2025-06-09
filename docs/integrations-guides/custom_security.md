---
title: Custom Security
sidebar_position: 5
---

# Custom Quorums And Thresholds

EigenDA allows users to tailor their data availability solution while maintaining security guarantees.

This is done by lettings users define their own [custom quorum](../core-concepts/security/security-model.md#quorums-and-security-models) and [security thresholds](../core-concepts/security/security-model.md#safety-and-liveness-analysis). 
Rollups that do so must enforce that the DA Certificate they receive from the disperser meets the `thresholds` they have set for each quorum, including their custom quorum.

Dispersing to a custom quorum effectively additionally replicates the data to the set of operators which hold the custom token that defines the custom quorum.
This means a rollup's token holders can decide, by delegating their tokens, which operators they trust to ensure the data availability of their rollup.

## Overview

Custom quorums and thresholds enable rollups and other users to:
- Define specific operator sets for data verification via delegation of their own token
- Enforce verification of the custom quorum's signature, starting at a specific activation block number
- Set custom confirmation thresholds for data availability confirmation
- Securely upgrade these thresholds as security needs evolve

## Economic Utility for Native Tokens

A key benefit of custom quorums is the ability for users to provide economic utility to their native ERC20 tokens. Rollups can:
- Create dedicated quorums that require re-staking of their native token
- Establish economic security backed by their own token ecosystem
- Enable token holders to participate in securing the rollup's data availability

This creates a powerful economic flywheel where the rollup's success directly enhances the utility and value of its native token, while leveraging that token to strengthen the rollup's security.

## Securely Upgradeable Cert Verification

Backward-compatible secure updates to custom quorums and thresholds are implemented using the exact same mechanism that is used for seamlessly (and securely) updating EigenDA Cert verification logic.
This allows cert verification to be securely added to rollup stacks without requiring major changes to the rollup's architecture, nor hard forks.

TODO: Link to the spec page ethen is writing after https://github.com/Layr-Labs/eigenda/pull/1642 gets merged.

### EigenDACertVerifier

Each EigenDACertVerifier is meant to be deployed immutably (not behind a proxy) and defines/contains:
- A versioned [EigenDACert](https://github.com/Layr-Labs/eigenda/blob/3e670ff3dbd3a0a3f63b51e40544f528ac923b78/contracts/src/periphery/cert/EigenDACertTypes.sol#L11) struct (which needs to be constructed from a [BlobStatusReply](https://github.com/Layr-Labs/eigenda/blob/3e670ff3dbd3a0a3f63b51e40544f528ac923b78/api/proto/disperser/v2/disperser_v2.proto#L106) from a dispersing client)
- Threshold requirements (i.e, adversarial and liveness signing stake thresholds)
- A [checkDACert](https://github.com/Layr-Labs/eigenda/blob/3e670ff3dbd3a0a3f63b51e40544f528ac923b78/contracts/src/periphery/cert/interfaces/IEigenDACertVerifierBase.sol#L8) function to verify the validity of an `EigenDACert` of the correct version
- A [CertVersion](https://github.com/Layr-Labs/eigenda/blob/3e670ff3dbd3a0a3f63b51e40544f528ac923b78/contracts/src/periphery/cert/interfaces/IVersionedEigenDACertVerifier.sol#L12) to return the version (single digit "major" version) of the Cert, which is used by dispersing clients to know which version of the cert to build.

The verification logic works uniformly for every quorum, meaning that custom quorums don't have any custom verification logic: they are verified exactly like the ETH and EIGEN quorums.
Dispersals specify in the BlobHeader the [quorum_numbers](https://github.com/Layr-Labs/eigenda/blob/3e670ff3dbd3a0a3f63b51e40544f528ac923b78/api/proto/common/v2/common_v2.proto#L24) that are required to sign, and each quorum is then verified to have reached the required threshold.

### EigenDACertVerifierRouter

Given the immutable nature of the EigenDACertVerifier, changing its logic or thresholds requires deploying a new contract. Secure rollup stacks then need to securely point their derivation pipeline to the new contract, which would require a hard fork. To solve this problem, we introduce the EigenDACertVerifierRouter, which is a custom proxy contract which "reifies implementation update history" by maintaining a mapping of activation block numbers to CertVerifier contracts. This enabled onchain verification of historical certs, as well as offchain verification without requiring an archive node (since the entire mapping is stored in storage). It overall:
- Maintains a mapping of activation block number (ABN) → `EigenDACertVerifier` address: new verifiers can be added at any future block
- Routes `checkDACert` requests to the appropriate EigenDACertVerifier contract based on reference block number (RBN) in the abi.encoded cert

Note that the Router is only compatible with EigenDACertVerifiers versions >= 3.

Each rollup stack will need to integrate the Router in different ways to maintain a secure integration. We refer users to their respective rollup stack docs:
- [OP Stack Integration](./rollup-guides/op-stack/README.md)
- [Arbitrum Orbit Integration](./rollup-guides/orbit/overview.md)
- [zkSync ZK Stack Integration](./rollup-guides/zksync/README.md)

## Quick Start

The flow to get setup with a CertVerifierRouter and enabling custom quorums would typically look like:
1. Rollup integrates with EigenDA via the [proxy](./eigenda-proxy/eigenda-proxy.md), using the network-default [EigenDACertVerifier](https://github.com/Layr-Labs/eigenda-proxy/releases/tag/v1.8.1) deployed by EigenDA.
2. Rollup decides it wants a custom quorum, or to change its security thresholds.
3. Rollup deploys its own EigenDACertVerifierRouter contract, [initializing](https://github.com/Layr-Labs/eigenda/blob/5fa94eab470823c8fdd829fc5974fe2969068a21/contracts/src/periphery/cert/router/EigenDACertVerifierRouter.sol#L41) it with the same EigenDACertVerifier address it's been using as its ABN=0 verifier. The following deployment [script](https://github.com/Layr-Labs/eigenda/tree/master/contracts/script/deploy/router) can be used for this.
4. Rollup operators restart their [eigenda-proxy](./eigenda-proxy/eigenda-proxy.md) instance, changing the [--eigenda.v2.cert-verifier-router-or-immutable-verifier-addr](https://github.com/Layr-Labs/eigenda-proxy/blob/34ff55add522a9c7ade281919efa46cd9ac78ce1/docs/help_out.txt#L56) flag to point to the router.
5. Rollup deploys a new EigenDACertVerifier contract with [_quorumNumbersRequired](https://github.com/Layr-Labs/eigenda/blob/5fa94eab470823c8fdd829fc5974fe2969068a21/contracts/src/periphery/cert/EigenDACertVerifier.sol#L43) including its custom quorum number.
6. Rollup calls [addCertVerifier](https://github.com/Layr-Labs/eigenda/blob/5fa94eab470823c8fdd829fc5974fe2969068a21/contracts/src/periphery/cert/router/EigenDACertVerifierRouter.sol#L44) on the router, activating the new cert verifier at any future block number of its choice.
7. Rollup sings [Kumbaya](https://youtu.be/zJG0Zg4oi7g?si=WP6GaqpF5opCT-EJ&t=14)
