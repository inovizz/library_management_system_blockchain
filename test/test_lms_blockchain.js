
"use strict";
// import expectThrow from './helpers/expectThrow.js';

const lms_blockchain = artifacts.require("../contracts/lms_blockchain.sol");

contract("lms_blockchain", function() {
    let lms;

    beforeEach(async function() {
        lms = await lms_blockchain.new('Owner');
    });

    // testing contructor function
    describe("testConstructor", function() {
        it("Should have one default member - owner", async function() {
            let memberCount = await lms.numMembers();
            assert.equal(memberCount, 1, "Should have owner as first member");
            console.log(memberCount); // initially the member count should be 1
        });
    });

    describe('addMember', function() {
    // test for addMember function, which checks for following conditions
    // - a new member is added successfully
    // - a duplicate member should not be added
    // - owner of the contract can not be added using addMember function
        it('should add a new member', async function() {
            assert.equal( await lms.getNumberOfMembers().valueOf(), 1);
            await lms.addMember('New Member', 0);
            assert.equal(await lms.getNumberOfMembers().valueOf(), 2, "count should be 2");
        });

        it.skip('add a new member', async function(){
            await lms.addMember('New Member', 0);
            assert.equal(await lms.getNumberOfMembers().valueOf(), 2); // one default member + one new member counts to 2
        });

        it.skip('duplicate member or the owner of contract should not be added again', async function(){
            await lms.addMember("Owner", eth.accounts[0]);
            assert.equal(await lms.numMembers(), 2); // owner can not be added again

            await lms.addMember("New Member", 0);
            assert.equal(await lms.numMembers(), 2); // duplicate member can not be added again

        });       
    });
   
    describe('addBook', function() {
        it('should add a new Book', async function() {
            await lms.addBook('DSA', "Coreman", "o'reilly" );
            assert.equal(await lms.getNumberOfBooks().valueOf(), 1, "count should be 1"); // add a new book
            await lms.addBook('DS & Algo', "KaruManchi", "local" );
            assert.equal(await lms.getNumberOfBooks().valueOf(), 2, "count should be 2"); // add another book
        });
    });

    describe('getMemberList', function() {
        // this test case should return a string containing names of all members seperated by /n
        it.skip('should return the list of members seperated by /n', async function() {
            assert.equal( await lms.getNumberOfMembers().valueOf(), 1);
            await lms.addMember('Sanchit', 0);
            console.log(await lms.getNumberOfMembers().valueOf());
            console.log(await lms.getMemberList());
            assert.equal(await lms.getMemberList(), 'Owner\nSanchit'); 

        });
    });
    
    describe('getMemberDetails', function() {
        // this test case should return a string containing names of all members seperated by /n
        it('should return the detail of given member', async function() {
            assert.equal( await lms.getNumberOfMembers().valueOf(), 1);
            await lms.addMember('Sanchit', 0);
            let [name, account, status] = await lms.getMemberDetails(await lms.getNumberOfMembers().valueOf());
            assert.equal(name, "Sanchit");
            assert.equal(account, 0);
            assert.equal(status.valueOf(), 0);
            // var details = ("Sanchit", 0, 0)
            // assert.equal(await lms.getMemberDetails(await lms.getNumberOfMembers().valueOf()), details); 

        });
    });
});