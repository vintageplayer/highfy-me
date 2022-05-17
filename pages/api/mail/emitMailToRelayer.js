const Web3 = require('web3');
const express = require('express');
const Tx = require('ethereumjs-tx');
import { relayerDetails } from "../../../contracts/relayerDetails";

//Infura HttpProvider Endpoint
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/"+process.env.INFURA_ID));


export default async function handler(req, res) {
  if (req.method == "POST") {
    const payload = req.body;
    const _from = payload.from;
    const _to = payload.to;
    const _data = payload.data;
    const _signature = payload.signature;
    
    var myAddress = process.env.ADDRESS;
    var privateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex')

    //contract abi is the array that you can get from the ethereum wallet or etherscan
    var contractABI = relayerDetails['abi'];
    var contractAddress = relayerDetails.networks['4'].address;
    
    //creating contract object
    var contract = new web3.eth.Contract(contractABI,contractAddress);
    
    var count;

    // get transaction count, later will used as nonce
    const transactionCount = await web3.eth.getTransactionCount(myAddress)
    
    count = transactionCount;
    
    //creating raw tranaction
    var rawTransaction = {"from":myAddress, "gasPrice":web3.utils.toHex(20* 1e9),"gasLimit":web3.utils.toHex(210000),"to":contractAddress,"value":"0x0","data":contract.methods.forward(_to, _from, _data, _signature).encodeABI(),"nonce":web3.utils.toHex(count)}
    
    //creating tranaction via ethereumjs-tx
    var transaction = new Tx(rawTransaction);
    //signing transaction with private key
    transaction.sign(privateKey);
    //sending transacton via web3js module
    
    const txRes = await web3.eth.sendSignedTransaction('0x'+transaction.serialize().toString('hex'))
    
    res.status(200).json(JSON.stringify({'txRes': txRes}));
  } else {
    res.status(400).json({ error: 'Only POST requests allowed' });
  }

  
}
