import { Web3Storage, File } from 'web3.storage'
import Blob from 'cross-blob';

export function getAccessToken () {
  // In a real app, it's better to read an access token from an
  // environement variable or other configuration that's kept outside of
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
  return process.env.WEB3STORAGE_TOKEN
}

function makeStorageClient () {
  return new Web3Storage({ token: getAccessToken() })
}

export function makeFileObject (payload, filename) {
  const blob = new Blob([payload], { type: 'application/json' })
  return new File([blob], filename)
}

async function storeFiles (files) {
  const client = makeStorageClient()
  const cid = await client.put(files)
  console.log('stored files with cid:', cid)
  return cid
}

async function storeWithProgress (files) {
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
  const client = makeStorageClient()

  // client.put will invoke our callbacks during the upload
  // and return the root cid when the upload completes
  return client.put(files, { onRootCidReady, onStoredChunk })
}

function makeFileUrl(cid, fileName) {
  return `https://${cid}.ipfs.dweb.link/${fileName}`
}

export async function storeFilesOnIPFS(files) {
  const fileCID = await storeWithProgress(files);
  // console.log(fileCID);
  return fileCID;
}

export async function storeDataOnIPFS(data, fileName) {
  const fileObject = makeFileObject(data, fileName);
  const fileCID = await storeWithProgress([fileObject]);
  // console.log(fileCID);
  return fileCID;
}

export async function retrieveFile (cid, fileName, resType = 'json') {
  const url = makeFileUrl(cid, fileName);
  console.log(`Fetching file: ${url}`);
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Error fetching IPFS File: [${res.status}] ${res.statusText}`)
  }
  if (resType !== 'json') {
    return await (await res.blob()).text();
  }  
  return await res.json();
}