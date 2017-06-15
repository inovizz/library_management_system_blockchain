pragma solidity ^0.4.0;

import "./helper_contracts/strings.sol";
import "./helper_contracts/StringLib.sol";

import "./DataStore.sol";


library MembersLibrary {

    using strings for *;

    // Status of transaction. Used for error handling.
    event Status(uint indexed statusCode);

    // Member has following states: 0 (Active), 1 (Inactive)

    function memberCount(address memberStoreAddress) constant returns (uint count) {
        return DataStore(memberStoreAddress).count();
    }

    function addMember(address memberStoreAddress, string name, string email, address account) public {
        var memberStore = DataStore(memberStoreAddress);
        var emailIndex = memberStore.getBytes32Index('email', sha3(email));
        var accountIndex = memberStore.getAddressIndex('account', account);
        if (accountIndex == emailIndex && accountIndex != 0) {
            // if member is already registered with given info
            memberStore.setIntValue(accountIndex, 'state', 0);
            Status(102);
            return;
        }
        if (accountIndex != 0 && emailIndex != 0 && emailIndex != accountIndex) {
            // provided account and email already registered but with different users
            Status(103);
            return;
        }
        if (accountIndex == 0 && emailIndex != 0) {
            // email is already registered
            Status(104);
            return;
        }
        if (accountIndex != 0 && emailIndex == 0) {
            // account is already registered
            Status(105);
            return;
        }
        memberStore.addNew();
        var index = memberStore.count();

        memberStore.setStringValue(index, 'name', name);
        memberStore.setStringValue(index, 'email', email);
        memberStore.setIntValue(index, 'dateAdded', now);
        memberStore.setAddressValue(index, 'account', account);

        memberStore.setBytes32Index('email', sha3(email), index);
        memberStore.setAddressIndex('account', account, index);
    }

    function removeMember(address memberStoreAddress, address account) {
        var memberStore = DataStore(memberStoreAddress);
        // Deactivate member
        var accountIndex = memberStore.getAddressIndex('account', account);
        if (accountIndex != 0) {
            memberStore.setIntValue(accountIndex, 'state', 1);
        }
    }

    function getMember(address memberStoreAddress, uint index) constant returns (address account, uint state, uint dateAdded) {
        var memberStore = DataStore(memberStoreAddress);
        if (index < 1 || index > memberStore.count()) {
            return;
        }
        account = memberStore.getAddressValue(index, 'account');
        state = memberStore.getIntValue(index, 'state');
        dateAdded = memberStore.getIntValue(index, 'dateAdded');
    }

    // Functions below are not used since Organisation contract cannot read string from library.
    function getMemberDetailsByAccount(address memberStoreAddress, address account) constant returns (string member) {
        var memberStore = DataStore(memberStoreAddress);
        var accountIndex = memberStore.getAddressIndex('account', account);
        if (accountIndex < 1 || accountIndex > memberStore.count()) {
            return;
        }
        var parts = new strings.slice[](4);
        parts[0] = StringLib.uintToString(accountIndex).toSlice();
        parts[1] = StringLib.addressToString(memberStore.getAddressValue(accountIndex, 'account')).toSlice();
        parts[2] = StringLib.uintToString(memberStore.getIntValue(accountIndex, 'state')).toSlice();
        parts[3] = StringLib.uintToString(memberStore.getIntValue(accountIndex, 'dateAdded')).toSlice();
        member = ";".toSlice().join(parts);
    }

    function getMemberDetailsByEmail(address memberStoreAddress, string email) constant returns (string member) {
        var memberStore = DataStore(memberStoreAddress);
        var emailIndex = memberStore.getBytes32Index('email', sha3(email));
        if (emailIndex < 1 || emailIndex > memberStore.count()) {
            return;
        }
        var parts = new strings.slice[](4);
        parts[0] = StringLib.uintToString(emailIndex).toSlice();
        parts[1] = StringLib.addressToString(memberStore.getAddressValue(emailIndex, 'account')).toSlice();
        parts[2] = StringLib.uintToString(memberStore.getIntValue(emailIndex, 'state')).toSlice();
        parts[3] = StringLib.uintToString(memberStore.getIntValue(emailIndex, 'dateAdded')).toSlice();
        member = ";".toSlice().join(parts);
    }

    function getMemberDetailsByIndex(address memberStoreAddress, uint index) constant returns (string member) {
        var memberStore = DataStore(memberStoreAddress);
        if (index < 1 || index > memberStore.count()) {
            return;
        }
        var parts = new strings.slice[](4);
        parts[0] = StringLib.uintToString(index).toSlice();
        parts[1] = StringLib.addressToString(memberStore.getAddressValue(index, 'account')).toSlice();
        parts[2] = StringLib.uintToString(memberStore.getIntValue(index, 'state')).toSlice();
        parts[3] = StringLib.uintToString(memberStore.getIntValue(index, 'dateAdded')).toSlice();
        member = ";".toSlice().join(parts);
    }

    function getAllMembers(address memberStoreAddress) constant returns (string memberString, uint8 count) {
        string memory member;
        var memberStore = DataStore(memberStoreAddress);
        for (uint i = 1; i <= memberStore.count(); i++) {
            member = getMemberDetailsByIndex(memberStoreAddress, i);
            if (!member.toSlice().equals("".toSlice())) {
                count++;
                if (memberString.toSlice().equals("".toSlice())) {
                    memberString = member;
                } else {
                    memberString = memberString.toSlice().concat('|'.toSlice()).toSlice().concat(member.toSlice());
                }
            }
        }
    }
}