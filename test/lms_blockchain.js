
'use strict';
// import expectThrow from './helpers/expectThrow.js';

const lms_blockchain = artifacts.require('../contracts/lms_blockchain.sol');

contract('lms_blockchain', function() {
    let lms;

    beforeEach(async function() {
        lms = await lms_blockchain.new('Owner');
    });

    // testing contructor function
    describe('testConstructor', function() {
        it('Should have one default member - owner', async function() {
            let memberCount = await lms.getNumberOfMembers();
            assert.equal(memberCount, 1, 'Should have owner as first member'); // initially the member count should be 1
        });
    });

    // test for addMember function, which checks for following conditions
    // - a new member is added successfully
    // - a duplicate member should not be added
    // - owner of the contract can not be added using addMember function

    // describe('addMember', function() {
    //     it('add a new member', async function(){
    //         await lms.addMember('New Member', 0);
    //         assert.equal(await lms.numMembers().valueOf(), 2); // one default member + one new member counts to 2
    //     });

        // it('duplicate member or the owner of contract should not be added again', async function(){
        //     await lms.addMember("Owner", eth.accounts[0]);
        //     assert.equal(await lms.numMembers(), 2); // owner can not be added again

        //     await lms.addMember("New Member", 0);
        //     assert.equal(await lms.numMembers(), 2); // duplicate member can not be added again

        // });       
    });
















    // describe('addMember', function() {
    //     it('Should add a member', async function() {
    //         assert.equal( await lms.getMemberCount(), 1);
    //         await lms.addMember('Neel P', 0x0);
    //         assert.equal(await lms.getMemberCount(), 2);
    //     });

    //     it('Should not add default member and/or already existing member', async function() {
    //         let memberCount = await lms.getMemberCount();
    //         assert.equal(await lms.getMemberCount(), 1);

    //         await lms.addMember('Neel', web3.eth.coinbase);
    //         memberCount = await lms.getMemberCount();
    //         assert.equal(memberCount.valueOf(), 1, 'Member count should still be 1 as owner is already added.')

    //         await lms.addMember('Sanchit B', 0x0);
    //         memberCount = await lms.getMemberCount();
    //         assert.equal(memberCount.valueOf(), 2, 'Two members added');

    //         await lms.addMember('Sanchit B', 0x0); //Adding duplicate member
    //         memberCount = await lms.getMemberCount();
    //         assert.equal(memberCount.valueOf(), 2, "Num of members should still be 2");
    //     });
    // });

    // describe ('addBook', function() {
    //     it('Should add a book', async function() {
    //         let bookCount = await lms.getNumberOfBooks();
    //         assert.equal(bookCount, 0, 'Inititally should be zero');

    //         await lms.addBook('titel1', 'author1', 'publisher1');
    //         bookCount = await lms.getNumberOfBooks();
    //         assert.equal(bookCount, 1, 'Should be 1');
    //     });
    // });

    // describe ('getMemberList', function() {
    //     it.skip('Should return a String with names of all the members', async function() {
    //         let memberList = '';
    //         await lms.addMember('NeelP', 0x0 );
    //         await lms.addMember('SanchitB', 0x1);

    //         assert.equal(await lms.getMemberCount(), 3, 'Three Members');

    //         memberList = await lms.getMemberList();
    //         console.log(memberList);
    //         assert.equal('\nNeel\nNeelP\nSanchitB', memberList);

    //     });
    // });

    // describe('addBook', function() {
    //     it('Should add a book', async function() {
    //         let bookCount = await lms.getNumberOfBooks();
    //         assert.equal(bookCount, 0, 'Should be zero inititally');

    //         await lms.addBook('title1', 'author1', 'publisher1');
    //         bookCount = await lms.getNumberOfBooks();
    //         assert.equal(bookCount, 1, 'Should change to 1')
    //     });
    // });
   
});