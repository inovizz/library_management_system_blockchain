pragma solidity ^0.4.0;

import "./DataStore.sol";
import "./OrgLibrary.sol";
import "./OrganisationInterface.sol";

import "./helper_contracts/zeppelin/ownership/Ownable.sol";

contract Parent is Ownable {
    using OrgLibrary for address;
    address public orgStore;

    function Parent() payable {
        // Call setDataStore before using this contract.
        setDataStore(0x0);
    }

    function setDataStore(address _orgStore) onlyOwner {
        if (_orgStore == 0x0) {
            orgStore = new DataStore();
        } else {
            orgStore = _orgStore;
        }
    }

    function registerOrganisation(bytes32 key, address org) onlyOwner {
        // Important: Pass an organisation without a set data store
        orgStore.createOrganisation(key, org);
        // Create new book and member data stores
        OrganisationInterface(org).setDataStore(0x0, 0x0);
    }

    function getOrganisation(bytes32 key) constant returns (address) {
        return orgStore.getOrganisation(key);
    }

    function upgradeOrganisation(bytes32 key, address newOrg) onlyOwner {
        var org = orgStore.getOrganisation(key);
        var (bookStore, memberStore) = OrganisationInterface(org).getDataStore();
        OrganisationInterface(newOrg).setDataStore(bookStore, memberStore);
        orgStore.setOrganisation(key, newOrg);
        OrganisationInterface(org).kill(newOrg);
    }

    function kill(address upgradedParent) onlyOwner {
        // Provide the address of upgraded parent in order to transfer all data and ownership to the new parent.
        if (upgradedParent == 0x0) {
            throw;
        }
        Parent(upgradedParent).setDataStore(orgStore);
        DataStore(orgStore).transferOwnership(upgradedParent);
        selfdestruct(upgradedParent);
    }
}
