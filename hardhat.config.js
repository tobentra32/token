require("@nomicfoundation/hardhat-toolbox");

const { vars } = require("hardhat/config");

// Go to https://alchemy.com, sign up, create a new App in
// its dashboard, and add its key to the configuration variables
const ALCHEMY_API_KEY = vars.get("ALCHEMY_API_KEY");

console.log('ALCHEMY_API_KEY', ALCHEMY_API_KEY);

// Add your Sepolia account private key to the configuration variables
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts




const AMOY_PRIVATE_KEY = vars.get("AMOY_PRIVATE_KEY");

const OKLINK_AMOY_API =  vars.get("AMOY_API_KEY");




/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    polygonAmoy: {
      url: `https://polygon-amoy.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [AMOY_PRIVATE_KEY],
      gasPrice: "auto",
    }
  },
  etherscan: {
    apiKey: {
      polygonAmoy: OKLINK_AMOY_API,
    },
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL:
            "https://www.oklink.com/api/explorer/v1/contract/verify/async/api/polygonAmoy",
          browserURL: "https://www.oklink.com/polygonAmoy",
        },
      },
    ],
  },
};

