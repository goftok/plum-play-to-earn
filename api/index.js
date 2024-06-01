const express = require("express");
const app = express();

const txData = {
  chainId: "eip155:10",
  method: "eth_sendTransaction",
  params: {
    abi: [...], // JSON ABI of the function selector and any errors
    to: "0x00000000fcCe7f938e7aE6D3c335bD6a1a7c593D",
    data: "0x783a112b0000000000000000000000000000000000000000000000000000000000000e250000000000000000000000000000000000000000000000000000000000000001",
    value: "984316556204476",
  },
};

app.get("/get_tx_data", (req, res) => res.json(txData));

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
