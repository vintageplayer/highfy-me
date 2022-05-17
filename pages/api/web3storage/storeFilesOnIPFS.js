import { Web3Storage, File } from 'web3.storage'
import { storeFilesOnIPFS, makeFileObject } from '../../../utils/web3StorageUtils';

export default async function handler(req, res) {
  if (req.method == "POST") {
    const payload = req.body;
    
    const senderDataFile = makeFileObject(payload.senderData, "sent");
    const receiverDataFile = makeFileObject(payload.receiverData, "inbox");
    try {
      const dataCID = await storeFilesOnIPFS([receiverDataFile, senderDataFile]);
      res.status(200).json({'dataCID':dataCID});
    } catch (err) {
      console.log(err);
      res.status(400).json({'error': 'Some error! Please speak to support'})
    }
    
  } else {
    res.status(400).json({ error: 'Only POST requests allowed' });
  }
  
}