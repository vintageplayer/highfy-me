# HighFy Me
## Introduction
HighFy Me is a fully decentralized, web3 native, wallet-to-wallet messaging system.
The motivation was to avoid the spam and missed out updates while using discord & twitter.

## Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Deep-Dive](#deep-dive):
	- [Scenarios](#scenarios)
	- [Application Screenshots](#application-screenshots)
	- [Architecture](#architecture)
	- [IPFS Screenshots](#ipfs-screenshots)
4. [Using it locally](#using-it-locally)

## Features:
1. Decentralized: Uses IFPS to store data and blockchain events to maintain provenance
2. End-to-End Encrypted: The messages stored are encrypted such that only the wallet owner can decrypt and see the contents.
3. Anti-Spam: Any message is by default sent to spam. In order to get out spam, either the address is whitelisted by the receiver, or the sender needs to pay some credits to the receiver to read the message.
4. Cross-Chain: Since it's a wallet-to-wallet service, any EVM address can send it to any other, irrespective of the chain they are in.
5. Gasless: The messages can be signed my the sender and submitted in a gasless way. (The application will submit it to polygon).

Note:
1. The gasless/cross-chain features are in a separate branch, they will be deployed once the EIP-712 standards are implemented for message signing.
2. Currently the addrCredits feature is not shown on UI to keep up with the cross-chain functionality. Credits are added separately by interacting with the contract.

Checkout [thoughts.md](https://github.com/vintageplayer/highfy-me/blob/master/thoughts.md) for reference and upcoming list of features.

## Deep-Dive

### Scenarios
1. New Message, New Sender, 0 credits: Any message from a sender not whitelisted, goes directly to spam. Any message back from the receiver goes to the sender's inbox.
2. Attach Label: A receiver can whitelist an address to Inbox or Subscription or mark as spam. Any future messages from the address is added to the respective categoy.
3. Collect: Any message (whether from a whitelisted address or a new address), if has credits, it's shown in the collect menu. The receiver can either accept the credits and whitelist the address, refund the credits while whitelisting the address or accept the credits while marking as spam.

### Application Screenshots

1. Inbox:
![Inbox](https://github.com/vintageplayer/highfy-me/blob/master/docs/images/SampleInbox.png?raw=true)

2. Sending Mail:
![Send Mail](https://github.com/vintageplayer/highfy-me/blob/master/docs/images/SendMailWithCredits.png?raw=true)

3. Respond to Mail With Credits
![Collect](https://github.com/vintageplayer/highfy-me/blob/master/docs/images/SampleCreditsMailResponse.png?raw=true)

### Architecture
Components:
1. IPFS
2. Blockchain
3. Graph Indexer
4. Wallet Provider
5. Javascript Client & Server

![ArchitectureImage](https://github.com/vintageplayer/highfy-me/blob/master/docs/images/HighFyMeWeb3.png?raw=true)

Note: The contract code and graph indexer schema & mapping can be found [here](https://github.com/vintageplayer/highfy-me-graph).

Sample Files:
1. [Mail IFPS File](https://bafybeic5zyqu332obv3rvfvtex3wfgx5ipknxdgz4hzmemkw7vuxz5k4ku.ipfs.dweb.link)
2. [Key IPFS File](https://bafybeibg4hlpyosc7iswtzch5kjhdxss3r526r6ywvlykt2osynxjgjp5e.ipfs.dweb.link)

### IPFS Screenshots
1. User Keys IPFS File: 
![UserKeysFile](https://github.com/vintageplayer/highfy-me/blob/master/docs/images/SampleKeyFile.png?raw=true)

2. User Private Key IPFS Content:
![UserPrivateKeysData](https://github.com/vintageplayer/highfy-me/blob/master/docs/images/PrivateKeySample.png?raw=true)

3. User Public Key IPFS Content:
![UserPublicKeysData](https://github.com/vintageplayer/highfy-me/blob/master/docs/images/PublicKeySample.png?raw=true)

4. Encrypted Message Stored on IPFS:
![EncryptedMessageOnIPFS](https://github.com/vintageplayer/highfy-me/blob/master/docs/images/MessageSample.png?raw=true)


## Using It Locally
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Getting Started

First install dependencies & run the development server:

```bash
npm install && npm run dev
# or
yarn install && yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
