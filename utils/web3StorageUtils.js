import { Web3Storage, File } from 'web3.storage'


export function getAccessToken () {
  // In a real app, it's better to read an access token from an
  // environement variable or other configuration that's kept outside of
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
  return process.env.WEB3STORAGE_TOKEN
}

export function getAccessTokenClient () {
  // In a real app, it's better to read an access token from an
  // environement variable or other configuration that's kept outside of
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
  return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN
}

function makeStorageClient (isClient) {
  if (isClient) {
    return new Web3Storage({ token: getAccessTokenClient() })
  } else {
    return new Web3Storage({ token: getAccessToken() })
  }
  
}

export function makeFileObject (payload, filename) {
  const buffer = Buffer.from(payload)
  return new File([buffer], filename)
}

async function storeFiles (files, isClient) {
  const client = makeStorageClient(isClient)
  const cid = await client.put(files)
  console.log('stored files with cid:', cid)
  return cid
}

async function storeWithProgress (files, isClient) {
  // show the root cid as soon as it's ready
  const onRootCidReady = cid => {
    console.log('uploading files with cid:', cid)
  }

  // when each chunk is stored, update the percentage complete and display
  const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0)
  let uploaded = 0

  const onStoredChunk = size => {
    uploaded += size
    const pct = totalSize / uploaded
    console.log(`Uploading... ${pct.toFixed(2)}% complete`)
  }

  // makeStorageClient returns an authorized Web3.Storage client instance
  const client = makeStorageClient(isClient)

  // client.put will invoke our callbacks during the upload
  // and return the root cid when the upload completes
  return client.put(files, { onRootCidReady, onStoredChunk })
}

function makeFileUrl(cid, fileName) {
  return `https://${cid}.ipfs.dweb.link/${fileName}`
  // return `https://ipfs.io/ipfs/${cid}/${fileName}`;
}

export async function storeFilesOnIPFS(files, isClient) {
  const fileCID = await storeWithProgress(files, isClient);
  // console.log(fileCID);
  return fileCID;
}

export async function storeDataOnIPFS(data, fileName, isClient) {
  const fileObject = makeFileObject(data, fileName);
  const fileCID = await storeWithProgress([fileObject], isClient);
  // console.log(fileCID);
  return fileCID;
}

export async function retrieveFile (cid, fileName, resType = 'json') {
  const url = makeFileUrl(cid, fileName);
  // console.log(`Fetching file: ${url}`);
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Error fetching IPFS File: [${res.status}] ${res.statusText}`)
  }
  if (resType !== 'json') {
    return await (await res.blob()).text();
  }  
  return await res.json();
}