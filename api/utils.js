import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {kv} from "@vercel/kv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const transactionMadeEarlierThanXMinutes = (ts, x) => {
    const timestamp = BigInt(ts)
    const timestampMs = timestamp * 1000n;
    const currentTimeMs = BigInt(Date.now());
    const differenceMinutes = (currentTimeMs - timestampMs) / (1000n * 60n);
    return differenceMinutes >= x;
}

export const sendHtml = (fileName, res) => {
    const filePath = path.join(__dirname, '../frontend', fileName);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading HTML file:', err);
        res.status(500).send('Server error');
        return;
      }
      res.status(200).send(data);
    });
  };

export const fuidCanClaim = async (req) => {
    let isVerified = false;
    const userFid = req.body['untrustedData']['fid']

    console.log(req.body)
    const ts = await kv.get(userFid);
    console.log('verify:' + userFid);
    console.log('verify:' + ts);

    if (ts === null || transactionMadeEarlierThanXMinutes(ts, 1n)) {
        console.log("VERIFIED")
        return true
    }
    return false
}