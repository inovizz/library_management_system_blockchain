'use strict';

const DataStore = artifacts.require('../contracts/DataStore.sol');
const MembersLibrary = artifacts.require('../contracts/MembersLibrary.sol');

contract('MembersLibrary', function(accounts) {
    let store, membersLibrary;

    beforeEach(async function() {
        store = await DataStore.new();
        membersLibrary = await MembersLibrary.new();
        // Transfer ownership of store from default account to members library. This allows modifying the data store.
        store.transferOwnership(membersLibrary.address);
        await membersLibrary.addMember(store.address, 'Abc Def', 'p@gmail.com', accounts[0]);
    });

    describe('count', function() {
        it('should fetch the number of members added to app', async function() {
            let count = await membersLibrary.memberCount(store.address);
            assert.equal(count.valueOf(), 1);
            await membersLibrary.addMember(store.address, 'Pawan Singh Pal', 'g@gmail.com', accounts[1]);
            let count2 = await membersLibrary.memberCount(store.address);
            assert.equal(count2.valueOf(), 2);
        });
    });

    describe('addMember', function() {
        it('should add a member with given details', async function() {
            let count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 1);
            let member = await membersLibrary.getMemberDetailsByIndex(store.address, 1);
            let memberAttr = member.split(';');
            let name = await store.getStringValue(memberAttr[0], 'name');
            let email = await store.getStringValue(memberAttr[0], 'email');
            assert.equal(memberAttr[0], '1');
            assert.equal('0x' + memberAttr[1], accounts[0]);
            assert.equal(memberAttr[2], '0');
            assert.isAtMost(memberAttr[3], Math.floor(Date.now() / 1000));
            assert.isAbove(memberAttr[3], Math.floor(Date.now() / 1000) - 300);
            assert.equal(name, 'Abc Def');
            assert.equal(email, 'p@gmail.com');
        });
        it('should not add an already added member', async function() {
            let count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 1);
            let res = await membersLibrary.addMember(store.address, 'Abc Def', 'p@gmail.com', accounts[0]);
            assert.equal(res.logs[0].args.statusCode.c[0], 102);
            count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 1);
        });
        it('should activate removed member', async function() {
            await membersLibrary.removeMember(store.address, accounts[0]);
            assert.equal(await membersLibrary.memberCount(store.address), 1);
            let member = await membersLibrary.getMemberDetailsByIndex(store.address, 1);
            let memberAttr = member.split(';');
            assert.equal(memberAttr[2], '1');
            let res = await membersLibrary.addMember(store.address, 'Abc Def', 'p@gmail.com', accounts[0]);
            assert.equal(res.logs[0].args.statusCode.c[0], 102);
            member = await membersLibrary.getMemberDetailsByIndex(store.address, 1);
            memberAttr = member.split(';');
            assert.equal(memberAttr[2], '0');
            let count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 1);
        });
        it('should not add the member if email and account already associated with 2 different members', async function() {
            await membersLibrary.addMember(store.address, 'Pqr Stv', 'g@gmail.com', accounts[1]);
            let res = await membersLibrary.addMember(store.address, 'Abc Def', 'p@gmail.com', accounts[1]);
            assert.equal(res.logs[0].args.statusCode.c[0], 103);
            let count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 2);
        });
        it('should not add if email already registered with some other account', async function() {
            let res = await membersLibrary.addMember(store.address, 'Pqr Stv', 'p@gmail.com', accounts[1]);
            assert.equal(res.logs[0].args.statusCode.c[0], 104);
            let count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 1);
        });
        it('should not add if account already registered with some other email', async function() {
            let res = await membersLibrary.addMember(store.address, 'Pqr Stv', 'g@gmail.com', accounts[0]);
            assert.equal(res.logs[0].args.statusCode.c[0], 105);
            let count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 1);
        });
    });

    describe('removeMember', function() {
        it('should do nothing for non-existent members', async function() {
            let res = await membersLibrary.removeMember(store.address, accounts[1]);
        });
        it('should deactivate a member', async function() {
            await membersLibrary.removeMember(store.address, accounts[0]);
            let member = await membersLibrary.getMemberDetailsByIndex(store.address, 1);
            let memberAttr = member.split(';');
            assert.equal(memberAttr[2], '1');
        });
    });

    describe('getMemberDetailsByEmail', function() {
        it('should provide member details', async function() {
            let count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 1);
            await membersLibrary.addMember(store.address, "John Doe", "Jd@gmail.com", accounts[1]);
            count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 2);
            let member = await membersLibrary.getMemberDetailsByEmail(store.address, "Jd@gmail.com");
            let memberAttr = member.split(';');
            let name = await store.getStringValue(memberAttr[0], 'name');
            let email = await store.getStringValue(memberAttr[0], 'email');
            assert.equal(memberAttr[0], 2);
            assert.equal('0x' + memberAttr[1], accounts[1]);
            assert.equal(memberAttr[2], '0');
            assert.isAtMost(memberAttr[3], Math.floor(Date.now() / 1000));
            assert.isAbove(memberAttr[3], Math.floor(Date.now() / 1000) - 300);
            assert.equal(name, 'John Doe');
            assert.equal(email, "Jd@gmail.com");
        });
        it('should return blank for a non-existent member details', async function() {
            let res = await membersLibrary.getMemberDetailsByEmail(store.address, 'l@gmail.com');
            assert.equal(res, '');
            let res2 = await membersLibrary.getMemberDetailsByEmail(store.address, 'm@gmail.com');
            assert.equal(res2, '');
            let res3 = await membersLibrary.getMemberDetailsByEmail(store.address, 'n@gmail.com');
            assert.equal(res3, '');
        });
    });

    describe('getMemberDetailsByAccount', function() {
        it('should provide member details', async function() {
            let count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 1);
            await membersLibrary.addMember(store.address, "John Doe", "Jd@gmail.com", accounts[1]);
            count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 2);
            let member = await membersLibrary.getMemberDetailsByAccount(store.address, accounts[1]);
            let memberAttr = member.split(';');
            let name = await store.getStringValue(memberAttr[0], 'name');
            let email = await store.getStringValue(memberAttr[0], 'email');
            assert.equal(memberAttr[0], 2);
            assert.equal('0x' + memberAttr[1], accounts[1]);
            assert.equal(memberAttr[2], '0');
            assert.isAtMost(memberAttr[3], Math.floor(Date.now() / 1000));
            assert.isAbove(memberAttr[3], Math.floor(Date.now() / 1000) - 300);
            assert.equal(name, 'John Doe');
            assert.equal(email, "Jd@gmail.com");
        });
        it('should return blank for a non-existent member details', async function() {
            let res = await membersLibrary.getMemberDetailsByAccount(store.address, accounts[2]);
            assert.equal(res, '');
            let res2 = await membersLibrary.getMemberDetailsByAccount(store.address, accounts[3]);
            assert.equal(res2, '');
            let res3 = await membersLibrary.getMemberDetailsByAccount(store.address, accounts[4]);
            assert.equal(res3, '');
        });
    });

    describe('getMemberDetailsByIndex', function() {
        it('should provide details of a member at given index', async function() {
            let count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 1);
            await membersLibrary.addMember(store.address, "John Doe", "Jd@gmail.com", accounts[1]);
            count = await membersLibrary.memberCount(store.address);
            assert.equal(count, 2);
            let member = await membersLibrary.getMemberDetailsByIndex(store.address, 2);
            let memberAttr = member.split(';');
            let name = await store.getStringValue(memberAttr[0], 'name');
            let email = await store.getStringValue(memberAttr[0], 'email');
            assert.equal(memberAttr[0], 2);
            assert.equal('0x' + memberAttr[1], accounts[1]);
            assert.equal(memberAttr[2], '0');
            assert.isAtMost(memberAttr[3], Math.floor(Date.now() / 1000));
            assert.isAbove(memberAttr[3], Math.floor(Date.now() / 1000) - 300);
            assert.equal(name, 'John Doe');
            assert.equal(email, "Jd@gmail.com");
        })
        it('should return blank for a non-existent index', async function() {
            let res = await membersLibrary.getMemberDetailsByIndex(store.address, -1);
            assert.equal(res, '');
            let res2 = await membersLibrary.getMemberDetailsByIndex(store.address, 0);
            assert.equal(res2, '');
            let res3 = await membersLibrary.getMemberDetailsByIndex(store.address, 2);
            assert.equal(res3, '');
        })
    });

    describe('getAllMembers', function() {
        it('should provide details of all members', async function() {
            let info = [
                {name: 'John Doe', account: accounts[1], email: 'john.doe@gmail.com'},
                {name: 'Jane Doe', account: accounts[2], email: 'jane.doe@gmail.com'},
                {name: 'Johnny Appleseed', account: accounts[3], email: 'johnny@apple.com'},
            ];
            for (let i=0; i<3; i++) {
                await membersLibrary.addMember(store.address, info[i].name, info[i].email, info[i].account);
            }
            let [members, count] = await membersLibrary.getAllMembers(store.address);
            assert.equal(count, 4);     // Including the default member
            members = members.split('|');
            for (let i=1; i<4; i++) {
                let attr = members[i].split(';');
                let name = await store.getStringValue(attr[0], 'name');
                let email = await store.getStringValue(attr[0], 'email');
                assert.equal(attr[0], i+1);
                assert.equal('0x' + attr[1], info[i-1].account);
                assert.equal(attr[2], 0);
                assert.isAtMost(attr[3], Math.floor(Date.now() / 1000));
                assert.isAbove(attr[3], Math.floor(Date.now() / 1000) - 300);
                assert.equal(name, info[i-1].name);
                assert.equal(email, info[i-1].email);
            }
        });
    });
});