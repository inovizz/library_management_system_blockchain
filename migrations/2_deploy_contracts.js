var StringLib = artifacts.require("./StringLib.sol");
var LMS = artifacts.require("./LMS.sol");

module.exports = function(deployer) {
  deployer.deploy(StringLib);
  deployer.link(StringLib, LMS);
  deployer.deploy(LMS);
};
