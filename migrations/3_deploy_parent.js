var DataStore = artifacts.require("./DataStore.sol");
var OrgLibrary = artifacts.require("./OrgLibrary.sol");
var Parent = artifacts.require("./Parent.sol");

module.exports = function(deployer) {
  deployer.deploy(DataStore);
  deployer.deploy(OrgLibrary);
  deployer.link(OrgLibrary, Parent);
  deployer.deploy(Parent);
};
