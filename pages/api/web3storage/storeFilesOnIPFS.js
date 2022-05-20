import { Web3Storage, File } from 'web3.storage'
import { storeFilesOnIPFS, makeFileObject } from '../../../utils/web3StorageUtils';

export default async function handler(req, res) {
  if (req.method == "POST") {
    const payload = req.body;
    
    const fileData = req.body.fileData;
    const files = fileData.map(x => makeFileObject(x.value, x.name));

    try {
      const cid = await storeFilesOnIPFS(files);
      res.status(200).json({'cid':cid});
    } catch (err) {
      console.log(err);
      res.status(400).json({'error': 'Some error! Please speak to support'})
    }
    
  } else {
    res.status(400).json({ error: 'Only POST requests allowed' });
  }
  
}
