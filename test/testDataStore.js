'use strict';

const DataStore = artifacts.require('../contracts/DataStore.sol');

contract('DataStore', function(accounts) {
    let store;

    beforeEach(async function() {
        store = await DataStore.new();
    });

    it('should have no records by default', async function() {
        let count =  await store.count()
        assert.equal(count, 0);
    });

    describe('addNew', function() {
        it('should increase the record count', async function() {
            await store.addNew();
            let count = await store.count();
            assert.equal(count, 1);
        });
    });

    describe('setAddressValue', function() {
        it('should set an attribute of type address', async function() {
            await store.addNew();
            let index = await store.count();
            await store.setAddressValue(index, web3.sha3('account'), accounts[0]);
            let account = await store.getAddressValue(index, web3.sha3('account'));
            assert.equal(account, accounts[0]);
        });
    });

    describe('setIntValue', function() {
        it('should set an attribute of type integer', async function() {
            await store.addNew();
            let index = await store.count();
            await store.setIntValue(index, web3.sha3('balance'), 10000);
            let balance = await store.getIntValue(index, web3.sha3('balance'));
            assert.equal(balance, 10000);
        });
    });

    describe('setStringValue', function() {
        it('should set an attribute of type string', async function() {
            await store.addNew();
            let index = await store.count();
            await store.setStringValue(index, web3.sha3('email'), 'john.doe@example.com');
            let email = await store.getStringValue(index, web3.sha3('email'));
            assert.equal(email, 'john.doe@example.com');
        });
    });

    describe('setAddressIndex', function() {
        it('should set an index based on field of type address', async function() {
            await store.addNew();
            let index = await store.count();
            await store.setAddressValue(index, web3.sha3('account'), accounts[0]);
            await store.setAddressIndex(web3.sha3('owner'), accounts[0], index);
            let found = await store.getAddressIndex(web3.sha3('owner'), accounts[0]);
            assert.equal(found.valueOf(), index.valueOf());
            index = 2;
            await store.setAddressIndex(web3.sha3('borrower'), accounts[0], index);
            found = await store.getAddressIndex(web3.sha3('borrower'), accounts[0]);
            assert.equal(found.valueOf(), index.valueOf());
        });
    });

    describe('setBytes32Index', function() {
        it('should set an index based on field of type bytes32', async function() {
            await store.addNew();
            let index = await store.count();
            await store.setStringValue(index, web3.sha3('email'), 'john.doe@example.com');
            await store.setBytes32Index(web3.sha3('email'), web3.sha3('john.doe@example.com'), index);
            let found = await store.getBytes32Index(web3.sha3('email'), web3.sha3('john.doe@example.com'));
            assert.equal(found.valueOf(), index.valueOf());
        });
    });

    describe('setIntIndex', function() {
        it('should set an index based on field of type int', async function() {
            await store.addNew();
            let index = await store.count();
            await store.setIntValue(index, web3.sha3('ID'), 1199228);
            await store.setIntIndex(web3.sha3('employee_id'), 1199228, index);
            let found = await store.getIntIndex(web3.sha3('employee_id'), 1199228);
            assert.equal(found.valueOf(), index.valueOf());
        });
    });
});
