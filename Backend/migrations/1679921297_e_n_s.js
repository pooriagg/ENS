const ENS = artifacts.require("ENS");

module.exports = (deployer) => {
  deployer.deploy(ENS);
};