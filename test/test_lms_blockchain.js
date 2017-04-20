
"use strict";
// import expectThrow from './helpers/expectThrow.js';

const lms_blockchain = artifacts.require("../contracts/lms_blockchain.sol");

contract("lms_blockchain", function(accounts) {
    let lms;

    beforeEach(async function() {
        lms = await lms_blockchain.new('Owner');
    });

    // testing contructor function
    describe("testConstructor", function() {
        it("Should have one default member - owner", async function() {
            let memberCount = await lms.numMembers();
            assert.equal(memberCount, 1, "Should have owner as first member");
            // console.log(memberCount); // initially the member count should be 1
        });
        it.skip("should return the owner details", async function(){
            let [name, account] = await lms.getOwnerDetails();
            // console.log(await lms.getOwnerDetails());
            assert.equal(name, "Owner");
            assert.equal(account, web3.eth.coinbase);
        });
    });

    describe('addMember', function() {
    // test for addMember function, which checks for following conditions
    // - a new member is added successfully
    // - a duplicate member should not be added
    // - owner of the contract can not be added using addMember function
        it('should add a new member', async function() {
            assert.equal( await lms.getNumberOfMembers().valueOf(), 1);
            console.log(await lms.getNumberOfMembers().valueOf());
            await lms.addMember('New Member', 0x0);
            console.log(await lms.getNumberOfMembers().valueOf());
            assert.equal(await lms.getNumberOfMembers().valueOf(), 2, "count should be 2");
        });
        it('add a new member', async function(){
            await lms.addMember('New Member', 0);
            assert.equal(await lms.getNumberOfMembers().valueOf(), 2); // one default member + one new member counts to 2
        });

        it('duplicate member or the owner of contract should not be added again', async function(){
            await lms.addMember("Owner", web3.eth.coinbase);
            console.log(await lms.getNumberOfMembers().valueOf());
            assert.equal(await lms.getNumberOfMembers().valueOf(), 1); // owner can not be added again
            await lms.addMember("New Member", 0x0);
            assert.equal(await lms.getNumberOfMembers().valueOf(), 2); // duplicate member can not be added again
            console.log(await lms.getNumberOfMembers().valueOf());
            await lms.addMember("New Member", 0x0);
            assert.equal(await lms.getNumberOfMembers().valueOf(), 2); // duplicate member can not be added again

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

    // describe('getMemberList', function() {
    //     // this test case should return a string containing names of all members seperated by /n
    //     it.skip('should return the list of members seperated by /n', async function() {
    //         assert.equal( await lms.getNumberOfMembers().valueOf(), 1);
    //         await lms.addMember('Sanchit', 0);
    //         console.log(await lms.getNumberOfMembers().valueOf());
    //         console.log(await lms.getMemberList());
    //         assert.equal(await lms.getMemberList(), 'Owner\nSanchit'); 

    //     });
    // });
    
    // describe('getMemberDetails', function() {
    //     it('should return the detail of given member', async function() {
    //         assert.equal( await lms.getNumberOfMembers().valueOf(), 1);
    //         await lms.addMember('Sanchit', 0);
    //         let [name, account, status] = await lms.getMemberDetails(await lms.getNumberOfMembers().valueOf());
    //         assert.equal(name, "Sanchit");
    //         assert.equal(account, 0);
    //         assert.equal(status.valueOf(), 0);
    //     });
    // });

    // describe('getBookDetails', function() {
    //     it('should return the detail of given book', async function() {
    //         assert.equal( await lms.getNumberOfBooks().valueOf(), 0);
    //         await lms.addBook("DSA", "Coreman", "o'reilly");
    //         assert.equal( await lms.getNumberOfBooks().valueOf(), 1);
    //         let numBooks = await lms.getNumberOfBooks();
    //         console.log(numBooks.valueOf())
    //         let details = await lms.getBookDetails(numBooks.valueOf());
    //         console.log(details);
    //         // assert.equal(await lms.getBookDetails(await lms.getNumberOfBooks().valueOf()), "DSA");
    //         // let [title, publisher, author, 
    //         // currentOwner, state, lastIssueDate ] = await lms.getBookDetails(await lms.getNumberOfBooks().valueOf());
    //         // assert.equal(title, "DSA");
    //         // assert.equal(publisher, "Coreman");
    //         // assert.equal(author, "o'reilly");
    //         // assert.equal(author, msg.sender);
    //         // assert.equal(state.valueOf(), 0);
    //         // assert.equal(lastIssueDate,0);
    //     });
    // })
});