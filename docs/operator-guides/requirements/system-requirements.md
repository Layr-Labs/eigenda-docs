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

*TL;DR Each 1% of TQS needs roughly 4.5MB/s network, and 2.3TB storage*

Note:
* The 4.5MB/s is the **actual steady-state data transfer throughput** needed between EigenDA Disperser and Node (i.e. not just the ingress bandwidth of the node). Currently, the Disperser is located in AWS us-east-1, which may be subject to change and moving towards decentralization.
* Actual bandwidth may be affected by transportation via the public internet over geographic distances.
* This doesn't include the resource needed for other services (if any) on the same machine.

For reference, the following tables summarize requirements based on TQS:

<table>
  <tr>
   <td><strong>Total Quorum Stake (%)</strong>
   </td>
   <td><strong>Network throughput (MB/s)</strong>
   </td>
   <td><strong>Storage (GB)</strong>
   </td>
  </tr>
  <tr>
   <td>1
   </td>
   <td>4.8
   </td>
   <td>2,322.43
   </td>
  </tr>
  <tr>
   <td>0.9
   </td>
   <td>4.34
   </td>
   <td>2,099.87
   </td>
  </tr>
  <tr>
   <td>0.8
   </td>
   <td>3.88
   </td>
   <td>1,877.30
   </td>
  </tr>
  <tr>
   <td>0.7
   </td>
   <td>3.42
   </td>
   <td>1,654.73
   </td>
  </tr>
  <tr>
   <td>0.6
   </td>
   <td>2.96
   </td>
   <td>1,432.17
   </td>
  </tr>
  <tr>
   <td>0.5
   </td>
   <td>2.5
   </td>
   <td>1,209.60
   </td>
  </tr>
  <tr>
   <td>0.4
   </td>
   <td>2.04
   </td>
   <td>987.03
   </td>
  </tr>
  <tr>
   <td>0.3
   </td>
   <td>1.58
   </td>
   <td>764.47
   </td>
  </tr>
  <tr>
   <td>0.2
   </td>
   <td>1.12
   </td>
   <td>541.90
   </td>
  </tr>
  <tr>
   <td>0.1
   </td>
   <td>0.66
   </td>
   <td>319.33
   </td>
  </tr>
  <tr>
   <td>0.09
   </td>
   <td>0.614
   </td>
   <td>297.08
   </td>
  </tr>
  <tr>
   <td>0.08
   </td>
   <td>0.568
   </td>
   <td>274.82
   </td>
  </tr>
  <tr>
   <td>0.07
   </td>
   <td>0.522
   </td>
   <td>252.56
   </td>
  </tr>
  <tr>
   <td>0.06
   </td>
   <td>0.476
   </td>
   <td>230.31
   </td>
  </tr>
  <tr>
   <td>0.05
   </td>
   <td>0.43
   </td>
   <td>208.05
   </td>
  </tr>
  <tr>
   <td>0.04
   </td>
   <td>0.384
   </td>
   <td>185.79
   </td>
  </tr>
  <tr>
   <td>0.03
   </td>
   <td>0.338
   </td>
   <td>163.54
   </td>
  </tr>
  <tr>
   <td>0.02
   </td>
   <td>0.292
   </td>
   <td>141.28
   </td>
  </tr>
  <tr>
   <td>0.01
   </td>
   <td>0.246
   </td>
   <td>119.02
   </td>
  </tr>
</table>



<table>
  <tr>
   <td><strong>Total Quorum Stake (%)</strong>
   </td>
   <td><strong>Network throughput (MB/s)</strong>
   </td>
   <td><strong>Storage (GB)</strong>
   </td>
  </tr>
  <tr>
   <td>1
   </td>
   <td>4.8
   </td>
   <td>2,322.43
   </td>
  </tr>
  <tr>
   <td>2
   </td>
   <td>9.4
   </td>
   <td>4,548.10
   </td>
  </tr>
  <tr>
   <td>3
   </td>
   <td>14
   </td>
   <td>6,773.76
   </td>
  </tr>
  <tr>
   <td>4
   </td>
   <td>18.6
   </td>
   <td>8,999.42
   </td>
  </tr>
  <tr>
   <td>5
   </td>
   <td>23.2
   </td>
   <td>11,225.09
   </td>
  </tr>
  <tr>
   <td>6
   </td>
   <td>27.8
   </td>
   <td>13,450.75
   </td>
  </tr>
  <tr>
   <td>7
   </td>
   <td>32.4
   </td>
   <td>15,676.42
   </td>
  </tr>
  <tr>
   <td>8
   </td>
   <td>37
   </td>
   <td>17,902.08
   </td>
  </tr>
  <tr>
   <td>9
   </td>
   <td>41.6
   </td>
   <td>20,127.74
   </td>
  </tr>
  <tr>
   <td>10
   </td>
   <td>46.2
   </td>
   <td>22,353.41
   </td>
  </tr>
  <tr>
   <td>11
   </td>
   <td>50.8
   </td>
   <td>24,579.07
   </td>
  </tr>
  <tr>
   <td>12
   </td>
   <td>55.4
   </td>
   <td>26,804.74
   </td>
  </tr>
  <tr>
   <td>13
   </td>
   <td>60
   </td>
   <td>29,030.40
   </td>
  </tr>
  <tr>
   <td>14
   </td>
   <td>64.6
   </td>
   <td>31,256.06
   </td>
  </tr>
  <tr>
   <td>15
   </td>
   <td>69.2
   </td>
   <td>33,481.73
   </td>
  </tr>
  <tr>
   <td>16
   </td>
   <td>73.8
   </td>
   <td>35,707.39
   </td>
  </tr>
  <tr>
   <td>17
   </td>
   <td>78.4
   </td>
   <td>37,933.06
   </td>
  </tr>
  <tr>
   <td>18
   </td>
   <td>83
   </td>
   <td>40,158.72
   </td>
  </tr>
  <tr>
   <td>19
   </td>
   <td>87.6
   </td>
   <td>42,384.38
   </td>
  </tr>
  <tr>
   <td>20
   </td>
   <td>92.2
   </td>
   <td>44,610.05
   </td>
  </tr>
  <tr>
   <td>21
   </td>
   <td>96.8
   </td>
   <td>46,835.71
   </td>
  </tr>
  <tr>
   <td>22
   </td>
   <td>101.4
   </td>
   <td>49,061.38
   </td>
  </tr>
  <tr>
   <td>23
   </td>
   <td>106
   </td>
   <td>51,287.04
   </td>
  </tr>
  <tr>
   <td>24
   </td>
   <td>110.6
   </td>
   <td>53,512.70
   </td>
  </tr>
  <tr>
   <td>25
   </td>
   <td>115.2
   </td>
   <td>55,738.37
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
