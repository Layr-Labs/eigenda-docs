---
sidebar_position: 1
---

# Mainnet

## Quick Links

* [AVS Page][2]
* [Blob Explorer][1]
* [Deployed Contract Addresses][3]

## V1 Specs (Deprecated)

| Property | Value |
| --- | --- |
| Disperser Address | `disperser.eigenda.xyz:443` |
| DataAPI Address | `dataapi.eigenda.xyz` |
| Churner Address | `churner.eigenda.xyz:443` |
| Batch Confirmation Interval | Every 10 minutes (may vary based on network health) |
| Max Blob Size | 16 MiB |
| Stake Sync (AVS-Sync) Interval | Every 6 days |
| Ejection Cooldown Period | 3 days |

## Blazar (V2) Specs

| Property | Value |
| --- | --- |
| Disperser Address | `disperser.eigenda.xyz:443` |
| DataAPI Address | `dataapi.eigenda.xyz` |
| Churner Address | `churner.eigenda.xyz:443` |
| Batch Dispersal Interval | Every 1 second (may vary based on network health) |
| Min Blob Size | 128 KiB |
| Max Blob Size | 16 MiB |
| Stake Sync (AVS-Sync) Interval | Every 6 days |
| Ejection Cooldown Period | 3 days |

## Contract Addresses

| Contract | Address |
| --- | --- |
| RegistryCoordinator | [0x0baac79acd45a023e19345c352d8a7a83c4e5656](https://etherscan.io/address/0x0baac79acd45a023e19345c352d8a7a83c4e5656) |
| StakeRegistry | [0x006124ae7976137266feebfb3f4d2be4c073139d](https://etherscan.io/address/0x006124ae7976137266feebfb3f4d2be4c073139d) |
| IndexRegistry | [0xbd35a7a1cdef403a6a99e4e8ba0974d198455030](https://etherscan.io/address/0xbd35a7a1cdef403a6a99e4e8ba0974d198455030) |
| BLSApkRegistry | [0x00a5fd09f6cee6ae9c8b0e5e33287f7c82880505](https://etherscan.io/address/0x00a5fd09f6cee6ae9c8b0e5e33287f7c82880505) |
| EigenDAServiceManager | [0x870679e138bcdf293b7ff14dd44b70fc97e12fc0](https://etherscan.io/address/0x870679e138bcdf293b7ff14dd44b70fc97e12fc0) |
| BLSOperatorStateRetriever | [0xEC35aa6521d23479318104E10B4aA216DBBE63Ce](https://etherscan.io/address/0xEC35aa6521d23479318104E10B4aA216DBBE63Ce) |
| PaymentVault | [0xb2e7ef419a2A399472ae22ef5cFcCb8bE97A4B05](https://etherscan.io/address/0xb2e7ef419a2A399472ae22ef5cFcCb8bE97A4B05) |

## Quorums

| Quorum Number | Token |
| --- | --- |
| 0 | ETH, LSTs |
| 1 | [EIGEN](https://etherscan.io/address/0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83) |
| 2 | [reALT](https://etherscan.io/address/0xF96798F49936EfB1a56F99Ceae924b6B8359afFb) |

[1]: https://blobs.eigenda.xyz/
[2]: https://app.eigenlayer.xyz/avs/0x870679e138bcdf293b7ff14dd44b70fc97e12fc0
[3]: https://github.com/Layr-Labs/eigenlayer-middleware/?tab=readme-ov-file#current-mainnet-deployment
