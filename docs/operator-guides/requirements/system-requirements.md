---
sidebar_position: 1
---

# System Requirements

## Hardware Requirements

The EigenDA network design dictates that operators with greater stake will
be asked to store a larger number of blob chunks/shards. As a result, an operator's node requirements are a
function of the total amount of stake they wield across all quorums, which we
call `Total Quorum Stake` (TQS). For example, if an operator Foobar has 3% stake
on the restaked ETH quorum, and 5% ETH on a staked WETH quorum, then operator
Foobar's TQS is 8%.

The requirements here are designed to support max system throughput of 20MiB/s.

### CPU and RAM requirements

| Total Quorum Stake (TQS) | vCPUs |  RAM (GB)|
| ------------------------ | ----------------------- | -------------------- |
| Up to 0.02% (Solo staker)      | 2 | 8   |
| Up to 0.2%                     |  4 | 16        |
| Up to 20%                      |  16 | 64     |

For reference, these requirements generally match the large, xlarge and 4xlarge in [EigenLayer node class](https://docs.eigenlayer.xyz/eigenlayer/operator-guides/eigenlayer-node-classes#general-purpose-eigenlayer-node-classes). Operators could provision the node following this standardized node class based on their stake percentage.

### Network and Storage Requirements

*TL;DR Each 1% of TQS needs 4MB/s network, and 2TB storage*

Note:
* The 4MB/s is the **actual steady-state data transfer throughput** needed between EigenDA Disperser and Node (i.e. not just the ingress bandwidth of the node). Currently, the Disperser is located in AWS us-east-1, which may be subject to change and moving towards decentralization.
* Actual bandwidth may be affected by transportation via the public internet over geographic distances.

For reference, the following tables summarize requirements based on TQS:

<table>
  <tr>
   <td><strong>TotalQuorumStake (%)</strong>
   </td>
   <td><strong>Network throughput (MB/s)</strong>
   </td>
   <td><strong>Storage (GB)</strong>
   </td>
  </tr>
  <tr>
   <td>1
   </td>
   <td>4
   </td>
   <td>2,000.00
   </td>
  </tr>
  <tr>
   <td>0.8
   </td>
   <td>3.2
   </td>
   <td>1,600.00
   </td>
  </tr>
  <tr>
   <td>0.6
   </td>
   <td>2.4
   </td>
   <td>1200
   </td>
  </tr>
  <tr>
   <td>0.4
   </td>
   <td>1.6
   </td>
   <td>800
   </td>
  </tr>
  <tr>
   <td>0.2
   </td>
   <td>0.8
   </td>
   <td>400
   </td>
  </tr>
  <tr>
   <td>0.1
   </td>
   <td>0.4
   </td>
   <td>200
   </td>
  </tr>
  <tr>
   <td>0.08
   </td>
   <td>0.32
   </td>
   <td>160
   </td>
  </tr>
  <tr>
   <td>0.06
   </td>
   <td>0.24
   </td>
   <td>120
   </td>
  </tr>
  <tr>
   <td>0.04
   </td>
   <td>0.16
   </td>
   <td>80
   </td>
  </tr>
  <tr>
   <td>0.02
   </td>
   <td>0.08
   </td>
   <td>40
   </td>
  </tr>
  <tr>
   <td>0.01
   </td>
   <td>0.04
   </td>
   <td>20
   </td>
  </tr>
</table>



<table>
  <tr>
   <td><strong>TotalQuorumStake (%)</strong>
   </td>
   <td><strong>Network throughput (MB/s)</strong>
   </td>
   <td><strong>Storage (GB)</strong>
   </td>
  </tr>
  <tr>
   <td>1
   </td>
   <td>4
   </td>
   <td>2,000.00
   </td>
  </tr>
  <tr>
   <td>2
   </td>
   <td>8
   </td>
   <td>4,000.00
   </td>
  </tr>
  <tr>
   <td>3
   </td>
   <td>12
   </td>
   <td>6,000.00
   </td>
  </tr>
  <tr>
   <td>4
   </td>
   <td>16
   </td>
   <td>8,000.00
   </td>
  </tr>
  <tr>
   <td>5
   </td>
   <td>20
   </td>
   <td>10,000.00
   </td>
  </tr>
  <tr>
   <td>6
   </td>
   <td>24
   </td>
   <td>12,000.00
   </td>
  </tr>
  <tr>
   <td>7
   </td>
   <td>28
   </td>
   <td>14,000.00
   </td>
  </tr>
  <tr>
   <td>8
   </td>
   <td>32
   </td>
   <td>16,000.00
   </td>
  </tr>
  <tr>
   <td>9
   </td>
   <td>36
   </td>
   <td>18,000.00
   </td>
  </tr>
  <tr>
   <td>10
   </td>
   <td>40
   </td>
   <td>20,000.00
   </td>
  </tr>
  <tr>
   <td>11
   </td>
   <td>44
   </td>
   <td>22,000.00
   </td>
  </tr>
  <tr>
   <td>12
   </td>
   <td>48
   </td>
   <td>24,000.00
   </td>
  </tr>
  <tr>
   <td>13
   </td>
   <td>52
   </td>
   <td>26,000.00
   </td>
  </tr>
  <tr>
   <td>14
   </td>
   <td>56
   </td>
   <td>28,000.00
   </td>
  </tr>
  <tr>
   <td>15
   </td>
   <td>60
   </td>
   <td>30,000.00
   </td>
  </tr>
  <tr>
   <td>16
   </td>
   <td>64
   </td>
   <td>32,000.00
   </td>
  </tr>
  <tr>
   <td>17
   </td>
   <td>68
   </td>
   <td>34,000.00
   </td>
  </tr>
  <tr>
   <td>18
   </td>
   <td>72
   </td>
   <td>36,000.00
   </td>
  </tr>
  <tr>
   <td>19
   </td>
   <td>76
   </td>
   <td>38,000.00
   </td>
  </tr>
  <tr>
   <td>20
   </td>
   <td>80
   </td>
   <td>40,000.00
   </td>
  </tr>
  <tr>
   <td>21
   </td>
   <td>84
   </td>
   <td>42,000.00
   </td>
  </tr>
  <tr>
   <td>22
   </td>
   <td>88
   </td>
   <td>44,000.00
   </td>
  </tr>
  <tr>
   <td>23
   </td>
   <td>92
   </td>
   <td>46,000.00
   </td>
  </tr>
  <tr>
   <td>24
   </td>
   <td>96
   </td>
   <td>48,000.00
   </td>
  </tr>
  <tr>
   <td>25
   </td>
   <td>100
   </td>
   <td>50,000.00
   </td>
  </tr>
</table>

:::info
The rough size of the message sent from the EigenDA disperser to a DA node can be estimated using the following formula:

```
<batch size (MB)>  = <throughput (MB/s)>  * <batch interval (s)>  * <coding rate> * <% stake>
```

Where `<coding rate> = 5` for all current EigenDA quorums. So if the network is operating at 1MB/s with a 10 minute batch interval, and a node has 5% of the stake, then that node will receive roughly 150MB per message from the disperser.
:::

## System Upgrades

Since system requirements scale dynamically in accordance with the amount of stake delegated to the operator, node operators may from time to time need to upgrade their system setups in order to continue meeting the [Protocol SLA](protocol-SLA/). Guidance for performing such upgrades is covered in [System Upgrades](../upgrades/system-upgrades/)

## IP Stability Requirements

Currently, the EigenDA protocol requires DA nodes to publish their IP address to the Ethereum L1 so providers and consumers of data can reach the node at this address. Consequently, node operators must be able to meet certain IP address stability and reachability requirements, as summarized in the table below.

|                        | Shared IP                                                                                                                           | Dedicated IP                                                                                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stable IP              | ❌ Note: this will still work, if operators themselves figure out how to make the IP:Port reachable, e.g. configure port forwarding. | ✅ This is the ideal case for an EigenDA operator.                                                                                                                |
| Unstable (Changing) IP | ❌ Note: this will still work, if operators themselves figure out how to make the IP:Port reachable, e.g. configure port forwarding. | ✅ Although this will work, operators are encouraged to have a stable IP, because changing IP will incur an Eth transaction (to update IP on-chain) and cost gas. |
