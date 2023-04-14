const DNS = artifacts.require("DNS");

module.exports =async function (deployer) {
  deployer.deploy(DNS);
};