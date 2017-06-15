pragma solidity ^0.4.0;

import "./DataStore.sol";


library OrgLibrary {
    function createOrganisation(address orgAddress, bytes32 key, address newAddress) public {
        var orgStore = DataStore(orgAddress);
        orgStore.addNew();
        var index = orgStore.count();

        orgStore.setAddressValue(index, key, newAddress);
        orgStore.setBytes32Index('org', key, index);
    }

    function getOrganisation(address orgAddress, bytes32 key) constant returns (address) {
        var orgStore = DataStore(orgAddress);
        var index = orgStore.getBytes32Index('org', key);
        return orgStore.getAddressValue(index, key);
    }

    function setOrganisation(address orgAddress, bytes32 key, address newAddress) {
        var orgStore = DataStore(orgAddress);
        var index = orgStore.getBytes32Index('org', key);
        return orgStore.setAddressValue(index, key, newAddress);
    }
}
