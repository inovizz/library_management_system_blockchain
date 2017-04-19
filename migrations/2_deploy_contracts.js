var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var lms =  artifacts.require("./lms_blockchain.sol");
var StringLib = artifacts.require("./StringLib.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(StringLib);
  deployer.link(StringLib, lms);
  deployer.deploy(lms);
};
