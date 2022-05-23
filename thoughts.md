# To Be Researched
1. While reading the messages, decrypt from the public key and store them separately. Once de-crypted, the messages should be re-encrypted with only the recerivers private key and stored in IPFS. 
Issue: How to track the IPFS address. Emitting another event doesn't make sense.
Things to explore:
a) Lazy Update in bulk later using a server, let the application take a gas fee hit (use the cheapest chain to track this).
b) Some sort of linked list (linked bucker of messsages) with the latest stored in a determined location. 

2. Custom Script to do the one-time key encrytion/decryption instead of relying on metamask. Ideal to support multi-chain (non-EVM chains as well)(for eg: privy )

3. Supporting Bulk sending, bcc etc.
4. Support for ENS/Unstoppable domains.
5. Labeling Messages.
6. Some way to index/search the mails while keeping it private.
7. Suppport for attachements.
8. Delete Mails.
9. Interoperability with SMTP.
10. Make Sender Anonymous
11. Add Sender Signed Message to maintain proof for forwarding and future optimizations.
12. Add reply to message.
13. Create Closures While handling Keys, inorder to handle keys securely.
14. Anti-Spam (Pay to view - Click on Open mail to claim coin)
15. Explore GraphQL experimental features for IPFS (ipfs.cat, etc)
16. Create Mail/Key Payload versions to ensure backword compatibility for future releases.

## References
1. https://docs.metamask.io/guide/rpc-api.html#restricted-methods
2. https://www.npmjs.com/package/@metamask/eth-sig-util
3. https://betterprogramming.pub/exchanging-encrypted-data-on-blockchain-using-metamask-a2e65a9a896c
4. https://web3.storage/docs/how-tos/retrieve/
5. https://github.com/ThirdRockEngineering/Sytime/tree/226de703df460dbdc770edc549836e25bb8d4cd0
6. https://github.com/Web3Modal/web3modal
7. https://docs.unstoppabledomains.com/login-with-unstoppable/login-integration-guides/web3-modal-guide/
8. https://docs.unstoppabledomains.com/login-with-unstoppable/login-integration-guides/login-ui-configuration/
9. https://docs.google.com/document/d/1FhnxFq43EbScZwQiipu6et3exWkc_YcnFepCXVrFc8k/edit
10. https://github.com/unstoppabledomains/uauth/blob/main/examples/web3modal/src/Web3ModalContext.tsx
11. https://medium.com/codex/creating-a-basic-dapp-with-web3-and-nextjs-2ee94af06517
12. https://stackoverflow.com/questions/42420531/what-is-the-best-way-to-manage-a-users-session-in-react
13. https://hmh.engineering/using-react-contextapi-usereducer-as-a-replacement-of-redux-as-a-state-management-architecture-336452b2930e
14. https://github.com/openpgpjs/openpgpjs
15. https://github.com/grizzthedj/react-session