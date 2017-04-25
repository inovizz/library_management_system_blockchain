var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var StringLib = artifacts.require("./StringLib.sol");
var LMS = artifacts.require("./LMS.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(StringLib);
  deployer.link(StringLib, LMS);
  deployer.deploy(LMS);
};

