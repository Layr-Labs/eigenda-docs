---
sidebar_position: 2
title: Security FAQs
---

# Security FAQs

The purpose of this post is to review frequently asked questions and better understand security tradeoffs when using DA solutions to Ethereum as an Ethereum L2. Outside of the scope of this is a holistic security assessment of DA. 

## What kinds of security can L2-DA solutions provide for Ethereum L2s?

BFT security and cryptoeconomic security are the only types of security possible for L2-DA. A detailed discussion about how EigenDA achieves both of these forms of security is provided in [Security Model](./security-model.md).

Even for DA protocols which purport to provide unilateral verifiability to a light client operator of a Data Availability Sampling (DAS) protocol, this function cannot be evaluated by an L1 smart contract, since it requires networking capabilities which are not available in that context. Thus, rollup bridges cannot verify that the data is available from the DA providers before accepting a DA attestation. In other words, the observation of the light nodes cannot be provably bridged to layer-1.

In this sense, every DA solution which provides BFT and Cryptoeconomic security provides qualitatively equivalent security guarantees from the standpoint of an Ethereum rollup. 

## How does slashing work in DA protocols?

Data availability cannot be objectively proven or disproven; it can only be subjectively observed. This is because virtually all common networking primitives allow for data to be selectively served to one party but not another.

For this reason, the only known way to achieve cryptoeconomic security in DA protocols under a dishonest majority is through the ability to fork the chain or the staking asset in response to a safety failure. The idea is straightforward: if a majority of nodes collude to violate safety—such as by withholding data they claim to be available—the honest minority can fork the chain or the token used for staking. The broader community can then evaluate both forks and decide which one to support, allowing the market to economically penalize the dishonest majority by devaluing their fork.

Data availability is an implied function of blockchains such as Ethereum and Solana. An assumption that is made about these blockchains is that in the event of a data availability withholding attack, the chain would fork and the stake of the offending validators would be slashed, as inspection by community members surfaced the withholding attack. DA protocols such as EigenDA which utilize the token forking mechanism for slashing inherit this default posture toward cryptoeconomic security. 

## Does EigenDA have slashing? How does slashing work?

Slashing is the main instrument of the cryptoeconomic security model described in the previous question. 

We have slashing for EIGEN by token forking, which is equivalent to chain forking (see more in  [EIGEN Token Whitepaper](https://docs.eigenlayer.xyz/assets/files/EIGEN_Token_Whitepaper-0df8e17b7efa052fd2a22e1ade9c6f69.pdf)). 

Whenever there is a safety failure when the malicious stake controls more than a threshold of staked assets in the quorum (see more in [Security Model](./security-model.md)), a community member can trigger an alarm for data unavailability. If enough community members agree that the safety is violated, they can start the token forking to slash the dishonest majority. 

EIGEN can support multiple Eigen forks where marketplace can inflict slashing, while the solution using Tendermint consensus may face the challenge of non-progress on the minority fork, when the honest minority try to slash dishonest majority using chain forking.

## What are the limitations of DAS?

DAS generally has two purposes for DA protocols. 

1. Improved observability: Improving community observability of DA faults in order to support slashing. 
2. Verifiability: Enabling end users to make a judgement about availability to verify that the rollup is in good status and trust the service, decreasing time to effective finality for users transacting on the rollup. 

However, current instantiations of Data Availability Sampling tend to have severe limitations which limit their value proposition. 

1. Limited utility for L2: As mentioned previously, the verification of data availability cannot be performed within the L1 bridge contract due to inherent limitations of smart contracts. 
2. Poor detection properties: Most DAS protocols are presented at a level of abstraction which hides important network level assumptions which are not satisfied in practice in any existing system. This makes it possible for a large number of light clients to be fooled into believing that data is available in a potentially targeted way. Specifically, malicious data storage nodes may selectively release chunks to a specific light node, fooling it into believing that the data is available, while the released chunks are not enough to recover the original data (i.e. the data is not available). More discussion on this topic can be found in the [blog post of Joachim Neu](https://www.paradigm.xyz/2022/08/das).
3. Incomplete recovery mechanism: While many DAS protocols aim to detect whether data has been collectively released to the set of light nodes (in the sense that the data can theoretically be reconstructed from the chunks held by the light nodes), many protocols do not provide a mechanism for performing this construction in a fully performant manner or at all. This means that an adversary can release data to the light nodes while denying data to actual data consumers, in such a way that *all* light nodes are fooled about the status of the data. 
4. Hidden trust assumptions: Many DAS protocols rely on trust assumptions which call into question the overall properties afforded by the protocol. For example, Celestia requires that each light node be connected to an honest full node in order to receive fraud proofs in the event of incorrect encoding. Based on network topologies, this can translate to a variety of different BFT-style trust assumptions on the limited collection of Celestia full nodes. 

## Is EigenDA building a DAS protocol?

Yes, EigenDA is actively developing a scalable DAS protocol which addresses many of the limitations of the previous section. A whitepaper of EigenDA DAS will be published soon.

## Is EigenDA a DAC? How decentralized is EigenDA?

As we discussed above, the DAC vs. DAS distinction is not meaningful. EigenDA provides slashing and BFT security, just like the DA solution using public blockchain, like Celestia. 

Most L2-DA solutions classified as DAC suffers from small sizes of committee members and lack of diversity. EigenDA is permission-less and highly decentralized. There remains a limited ability for EigenDA governance to influence operator makeup, but this is being progressively removed.

As of March 19, 2025, EigenDA's restaked ETH quorum consists of 148 validators, with the top 5 controlling approximately 40% of the total stake. Around \$8.8B worth of ETH has been re-staked in this quorum. In the quorum where EIGEN is the staked asset, there are 130 validators, with the top 5 holding about 44% of the total stake. Roughly \$472M worth of EIGEN is staked in this quorum.

For comparison, Celestia has 100 active validators out of a total of 254. The top 5 validators hold around 29% of the voting power, with approximately \$1.2B worth of TIA staked.

## What security does restaked ETH provide EigenDA?

Each EigenDA is additionally validated by a quorum of over \$8.8B of ETH restaked, meaning that a colluding set of operators would need to receive over \$4.4B* in delegation from ETH re-stakers in order to attack the system.

## What does EigenDA use KZG Polynomial Commitments for?

In EigenDA, KZG commitment is used to guarantee that the data chunks are correctly encoded from the data blob. This enables the validators to efficiently verify the validity of the chunks they received from the disperser. In comparison, fraud proofs require longer time window and extra trust assumptions to ensure the validity of data chunks.

## What’s the Plan to Address the Security Risks of EigenDA listed on L2BEAT?

Our plan is summarized below:

| **Risk Category** | **Current Status** | **Roadmap** |
| --- | --- | --- |
| Fraud Detection | Red - No Fraud Detection | **Current Status**: EigenDA has been developing a Data Availability Sampling (DAS) protocol designed to scale to very high throughputs. <br /> **Next Steps**: We will be publishing a research publication during Q2 2025 and building on the protocol throughout 2025. |
| Economic Security | Red - No Slashing | **Current Status**: EigenDA utilizes the forkable EigenToken as a securing asset.  <br /> **Next Steps**: Slashing for data availability withholding can be enabled once fraud detection mechanisms are in place later in the year. |
| Committee Security | Orange - Permissioned | **Current Status:** EigenDA utilizes a permissioned off-chain entity to facilitate churning low stake operators when new operators join; additionally, operators can be ejected from EigenDA quorums by governance.  <br /> **Next Steps:** The EigenDA churner and governance-owned ejector functionalities are expected to be deprecated following the V2 mainnet launch, at which point EigenDA will be permissionless |
| Relayer Failure / Censorship | Red - Rollups can be censored by disperser | **Current Status:** All end users must communicate with the network via the centralized disperser. <br /> **Next Steps:** A permissionless dispersal protocol has been designed and will be shipped in Q2, 2025 |
| Upgradeability / Exit Window | Red - No Delay | **Current Status:** Contracts can be upgraded either instantly from the 9/11 community multisig or after a 10 day timelock from the 3/5 ops multisig <br /> **Next Steps:** Move contract governance to EigenDA specific multisigs and evaluate the tradeoff between instant upgradability to mitigate critical bugs and purely timelocked upgradability. As with most rollup settlement contracts themselves and other DA bridges, EigenDA bridge settlement contracts have not yet shed their governance-moderated upgradeability; however, this is an update that can be expected over time as protocols reach new stages of maturity. |

*This conclusion is based on a confirmation threshold of 63%, which corresponds to a safety threshold of 50%. A more detailed analysis is available in [Security Model](./security-model.md).
