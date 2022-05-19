// import { Web3Storage, File } from 'web3.storage'
// import { storeFilesOnIPFS, makeFileObject } from '../utils/web3StorageUtils';
// // import Blob from 'cross-blob';

// export default async function handler(req, res) {
//   if (req.method == "POST") {
//     const payload = req.body;
//     console.log(Blob)
//     const senderDataFile = makeFileObject(payload.senderData, "sent");
//     const receiverDataFile = makeFileObject(payload.receiverData, "inbox");
//     const dataCID = await storeFilesOnIPFS([receiverDataFile, senderDataFile]);
//     res.status(200).json({'dataCID':dataCID});
//   } else {
//     res.status(400).json({ error: 'Only POST requests allowed' });
//   }
  
// }