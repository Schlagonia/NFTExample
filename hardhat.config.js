require('@nomiclabs/hardhat-waffle');
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: 'RinkebyURL',
      accounts: ['Private Key'],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "API KEy",
  }
};