import express from 'express';
import Web3 from 'web3';
import { ethers } from 'ethers';
import crypto from 'crypto';
import { initializeSubstreamsListeners } from './factory.js';
//  import body-parser 

import bodyParser from 'body-parser';


const app = express();


initializeSubstreamsListeners().then(r => console.log("substreams are ready"))

initializeSubstreamsListeners().then(r => console.log("substreams are ready"))

const abi = [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint256","name":"chainId","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ECDSAInvalidSignature","type":"error"},{"inputs":[{"internalType":"uint256","name":"length","type":"uint256"}],"name":"ECDSAInvalidSignatureLength","type":"error"},{"inputs":[{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"ECDSAInvalidSignatureS","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"nonce","type":"bytes32"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"serverAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"chainId","type":"uint256"}],"name":"setChainId","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_serverAddress","type":"address"}],"name":"setServerAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"usedNonces","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]

const web3 = new Web3();

const privateKey = process.env.PRIVATE_KEY;
const methodSignature = "0xacd379cc";

app.use(express.json());
app.use(bodyParser.json());

app.post("/get_tx_data", (req, res) => {
  const userAddress = req.body['address'];
  const amount = 1;
  const nonce = crypto.randomBytes(32).toString('hex');
  const chainId = req.body['buttonIndex'] === 1 ? 10 : 42161;
  const contractAddress = chainId === 10
    ? "0x3a30e6487037874ba0d483438b923f65820aeae9"
    : "0xf3121fd1ef36c6ebbd5f9d5817817588df2bb3e6";

  // Create the nonce as bytes32
  const nonceBytes32 = ethers.utils.formatBytes32String(nonce);

  // Create the message hash
  const messageHash = web3.utils.soliditySha3(
    { type: 'address', value: userAddress },
    { type: 'uint256', value: amount },
    { type: 'bytes32', value: nonceBytes32 },
    { type: 'uint256', value: chainId }
  );

  // Sign the message
  const message = ethers.utils.arrayify(messageHash);
  const signingKey = new ethers.utils.SigningKey(privateKey);
  const signedMessage = signingKey.signDigest(message);
  const signature = ethers.utils.joinSignature(signedMessage);

  // Construct tx data
  const txData = {
    chainId: chainId === 10 ? "eip155:10" : "eip155:42161",
    method: "eth_sendTransaction",
    params: {
      abi: abi,
      to: contractAddress,
      data: `${methodSignature}${nonceBytes32.slice(2)}00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000041${signature.slice(2)}00000000000000000000000000000000000000000000000000000000000000`,
      value: "0",
    },
  };

  console.log(req.body);
  return res.json(txData);
});

app.post("/tx_callback", (req, res) => {
  console.log(req.body);
  return res.send("OK");
});

app.post('/verify', (req, res) => {
  const isVerified = true;

  if (isVerified) {
    res.status(200).send(`
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" type="image/svg+xml" href="/plum.png" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://mint.farcaster.xyz/horse.png" />
        
          <!-- Arbitrum Button -->
          <meta property="fc:frame:button:1" content="Arbitrum" />
          <meta property="fc:frame:button:1:action" content="tx" />
          <meta
            property="fc:frame:button:1:target"
            content="https://hackathon3-seven.vercel.app/get_tx_data"
          />
          <meta
            property="fc:frame:button:1:post_url"
            content="https://hackathon3-seven.vercel.app/tx_callback"
          />

          <!-- Base Button -->
          <meta property="fc:frame:button:2" content="Base" />
          <meta property="fc:frame:button:2:action" content="tx" />
          <meta
            property="fc:frame:button:2:target"
            content="https://hackathon3-seven.vercel.app/get_tx_data"
          />
          <meta
            property="fc:frame:button:2:post_url"
            content="https://hackathon3-seven.vercel.app/tx_callback"
          />
          <title>Hackathon3</title>
        </head>
        <body>
          <h1>Welcome to the Hackathon backend!</h1>
        </body>
      </html>
    `);
  } else {
    res.status(400).send('Verification failed');
  }
});


app.listen(3001, () => console.log("Server ready on port 3001."));

export default app
