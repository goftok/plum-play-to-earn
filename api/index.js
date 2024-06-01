import express from 'express';
import Web3 from 'web3';
import { ethers } from 'ethers';
import crypto from 'crypto';
import { initializeSubstreamsListeners } from './factory.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { kv } from '@vercel/kv';

const app = express();

import {sendHtml, transactionMadeEarlierThanXMinutes} from "./utils.js";

initializeSubstreamsListeners().then(r => console.log("substreams are ready"))

const abi = [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ECDSAInvalidSignature","type":"error"},{"inputs":[{"internalType":"uint256","name":"length","type":"uint256"}],"name":"ECDSAInvalidSignatureLength","type":"error"},{"inputs":[{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"ECDSAInvalidSignatureS","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"nonce","type":"bytes32"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"serverAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"chainId","type":"uint256"}],"name":"setChainId","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_serverAddress","type":"address"}],"name":"setServerAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"usedNonces","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]

const web3 = new Web3();

const privateKey = process.env.PRIVATE_KEY;
const methodSignature = "0xacd379cc";

app.use(express.json());

app.get("/", (req, res) => {
  sendHtml('verify.html', res);
});

app.post("/back", (req, res) => {
  sendHtml('verify.html', res);
});

app.post("/get_tx_data", async (req, res) => {
  console.log(req.body)
  const userAddress = req.body['untrustedData']['address'];
  const userFid = req.body['untrustedData']['fid'];

  const amount = 1;
  const nonce = crypto.randomBytes(32);
  const chainId = req.body['untrustedData']['buttonIndex'] === 1 ? 10 : req.body['untrustedData']['buttonIndex'] === 2 ? 42161 : 8453;
  const contractAddress = chainId === 10 
    ? "0x3a30e6487037874ba0d483438b923f65820aeae9" 
    : chainId == 42161 ? "0xf3121fd1ef36c6ebbd5f9d5817817588df2bb3e6" : "0x12aa2d8ebd0b0886aeb89d7b824321f0cbccb160";

  const nonceBytes32 = ethers.zeroPadBytes(nonce, 32);

  const messageHash = web3.utils.soliditySha3(userAddress, amount, nonceBytes32, chainId);
  // Sign the message
  const message = ethers.getBytes(messageHash);
  const wallet = new ethers.Wallet(privateKey);
  const signedMessage = await wallet.signMessage(message);
  const signature = ethers.Signature.from(signedMessage).serialized

  // Construct tx data
  const txData = {
    chainId: `eip155:${chainId}`,
    method: "eth_sendTransaction",
    params: {
      abi: abi,
      to: contractAddress,
      data: `${methodSignature}${nonceBytes32.slice(2)}00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000041${signature.slice(2)}00000000000000000000000000000000000000000000000000000000000000`,
      value: "0",
    },
  };

  return res.json(txData);
});

app.post("/tx_callback", async (req, res) => {
  console.log(req.body);
  const txId = req.body['untrustedData']['transactionId'];

  sendHtml('verify.html', res);
});


app.post('/verify', async (req, res) => {

  let isVerified = false;
  const userFid = req.body['untrustedData']['fid']

  console.log(req.body)
  const ts = await kv.get(userFid);
  console.log(userFid);
  console.log(ts);
  if (ts === null || transactionMadeEarlierThanXMinutes(ts, 1)) {
    isVerified = true
  }

  if (isVerified) {
    sendHtml('chains.html', res);
    } else {
    res.status(200).send('Verification failed');
  }
});


app.listen(3001, () => console.log("Server ready on port 3001."));

export default app
