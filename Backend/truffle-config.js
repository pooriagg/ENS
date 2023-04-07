require('dotenv').config();
const { ALCHEMY_API, PRIVATE_KEY, POLYGONSCAN_API } = process.env;

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    polygonscan: POLYGONSCAN_API
  },

  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    polygonMumbai: {
      provider: () => new HDWalletProvider(
        PRIVATE_KEY,
        ALCHEMY_API
      ),
      network_id: 80001,
      skipDryRun: true
    }
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17" // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
};
