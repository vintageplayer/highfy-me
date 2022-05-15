import * as openpgp from 'openpgp';
import { encrypt } from '@metamask/eth-sig-util';
import { Buffer } from "buffer";

export const generateKeyPair = async (passphrase) => {
    return await openpgp.generateKey({
        type: 'rsa', // Type of the key
        rsaBits: 4096, // RSA key size (defaults to 4096 bits)
        userIDs: [{ name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
        passphrase: 'super long and hard to guess secret'// protects the private key
    });
};

async function getPublicKey(account) {
  console.log('Fetching Public Key');
  const keyB64 = await window.ethereum.request({
    method: 'eth_getEncryptionPublicKey',
    params: [account], // you must have access to the specified account
  });
  console.log(`Public Key: ${keyB64}`);
  return keyB64;
}

function encryptWeb3(publicKey, data) {
  const enc = encrypt({
    publicKey: publicKey.toString('base64'),
    data: data,
    version: 'x25519-xsalsa20-poly1305',
  });
  return enc;
}

export async function encryptUsingWallet(obj, account) {
  const publicKey = await getPublicKey(account);
  return Buffer.from(JSON.stringify(encryptWeb3(publicKey, JSON.stringify(obj)))).toString('hex');
}

export async function decryptUsingWallet(payload, account) {  
  return await window.ethereum.request({
    method: 'eth_decrypt',
    params: [payload, account],
  });
}

export const encryptMessage = async (jsonMessage, publicKeyArmored) => {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage(jsonMessage), // input as Message object
        encryptionKeys: publicKey,
    });
    // console.log(encrypted); // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
    return encrypted;
}

export const decryptMessage = async (encrypted, privateKeyArmored, passphrase) => {
    const message = await openpgp.readMessage({
        armoredMessage: encrypted // parse armored message
    });
    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase
    });
    const { data: decrypted, signatures } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey
    });
    return decrypted;
}