'use strict';

const LMS = artifacts.require('../contracts/LMS.sol');

contract('LMS', function(accounts) {
    let lms;

    beforeEach(async function() {
        lms = await LMS.new('Lallan', "email", {value: web3.toWei(0.1)});
    });

    describe('addMember', function() {
        it('should not add an already added member', async function() {
            let memberCount = await lms.numMembers();
            assert.equal(memberCount.valueOf(), 1);
            await lms.addMember("John Doe", accounts[1], "Jd@gmail.com");
            let res = await lms.addMember("John Doe", accounts[1], "Jd@gmail.com");
            assert.equal(res.logs[0].args.statusCode.c[0], 102);
            memberCount = await lms.numMembers();
            assert.equal(memberCount.valueOf(), 2);
        });
        it('should not add the already added default member', async function() {
            let res = await lms.addMember("Already added member", web3.eth.coinbase, "email");
            assert.equal(res.logs[0].args.statusCode.c[0], 102);
            let memberCount = await lms.numMembers();
            assert.equal(memberCount.valueOf(), 1);
        });
        it('should activate removed member', async function() {
            await lms.removeMember(web3.eth.coinbase);
            let res = await lms.addMember("Already added member", web3.eth.coinbase, "email");
            assert.equal(res.logs[0].args.statusCode.c[0], 102);
            let memberCount = await lms.numMembers();
            assert.equal(memberCount.valueOf(), 1);
        });
        it('should not add the member if email and account already associated with 2 different members', async function() {
            await lms.addMember("Already added member", accounts[1], "Jd@gmail.com");
            let res = await lms.addMember("Spammer", accounts[1], 'email');
            assert.equal(res.logs[0].args.statusCode.c[0], 103);
            let memberCount = await lms.numMembers();
            assert.equal(memberCount.valueOf(), 2);
        });
        it('should not add if email already registered with some other account', async function() {
            let res = await lms.addMember("Already added member", accounts[1], "email");
            assert.equal(res.logs[0].args.statusCode.c[0], 104);
            let memberCount = await lms.numMembers();
            assert.equal(memberCount.valueOf(), 1);
        });
        it('should not add if account already registered with some other email', async function() {
            let res = await lms.addMember("Already added member", web3.eth.coinbase, "P@email.com");
            assert.equal(res.logs[0].args.statusCode.c[0], 105);
            let memberCount = await lms.numMembers();
            assert.equal(memberCount.valueOf(), 1);
        });
    });

    describe('getMemberDetailsByEmail', function() {
        it('should provide member details', async function() {
            let memberCount = await lms.numMembers();
            assert.equal(memberCount.valueOf(), 1);
            await lms.addMember("John Doe", 0x0, "Jd@gmail.com");
            memberCount = await lms.numMembers();
            assert.equal(memberCount.valueOf(), 2);
            let [name, account, email, status, dateAdded] = await lms.getMemberDetailsByEmail("Jd@gmail.com");
            assert.equal(name, 'John Doe');
            assert.equal(account, 0x0);
            assert.equal(email, "Jd@gmail.com")
            assert.equal(status.valueOf(), 0);
            assert.isAtMost(dateAdded, Math.floor(Date.now() / 1000));
            assert.isAbove(dateAdded, Math.floor(Date.now() / 1000) - 300);
        });
        it('should return blank for a non-existent member details', async function() {
            let [name, account, email, status, dateAdded] = await lms.getMemberDetailsByEmail("Jd@gmail.com");
            assert.equal(name, '');
            assert.equal(email, '')
            assert.equal(status.valueOf(), 0);
        });
    });

    describe('getMemberDetailsByAccount', function() {
        it('should provide member details', async function() {
            await lms.addMember("John Doe", 0x0, "Jd@gmail.com");
            let [name, account, email, status, timestamp] = await lms.getMemberDetailsByAccount(0x0);
            assert.equal(name, 'John Doe');
            assert.equal(account, 0x0);
            assert.equal(email, "Jd@gmail.com");
            assert.equal(status.valueOf(), 0);
            assert.isAtMost(timestamp, Math.floor(Date.now() / 1000));
            assert.isAbove(timestamp, Math.floor(Date.now() / 1000) - 300);
        });
        it('should return blank for a non-existent member details', async function() {
            let [name, account, email, status, dateAdded] = await lms.getMemberDetailsByAccount(0x0);
            assert.equal(name, '');
            assert.equal(email, '')
            assert.equal(status.valueOf(), 0);
        });
    });

    describe('getMemberDetailsByIndex', function() {
        it('should provide details of a member at given index', async function() {
            let member = await lms.getMemberDetailsByIndex(1);        // Verify details of the default member
            let attr = member.split(';');
            assert.equal(attr[0], "Lallan");
            assert.equal("0x" + attr[1], accounts[0]);
            assert.equal(attr[2], "email");
            assert.equal(attr[3], 0);
            assert.isAtMost(attr[4], Math.floor(Date.now() / 1000));
            assert.isAbove(attr[4], Math.floor(Date.now() / 1000) - 300);
        })
        it('should return blank for a non-existent index', async function() {
            let res = await lms.getMemberDetailsByIndex(-1);
            assert.equal(res, '');
            let res2 = await lms.getMemberDetailsByIndex(0);
            assert.equal(res2, '');
            let res3 = await lms.getMemberDetailsByIndex(2);
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
                await lms.addMember(info[i].name, info[i].account, info[i].email);
            }
            let [members, count] = await lms.getAllMembers();
            assert.equal(count, 4);     // Including the default member
            members = members.split('|');
            for (let i=1; i<4; i++) {
                let attr = members[i].split(';');
                assert.equal(attr[0], info[i-1].name);
                assert.equal('0x' + attr[1], info[i-1].account);
                assert.equal(attr[2], info[i-1].email);
                assert.equal(attr[3], 0);
                assert.isAtMost(attr[4], Math.floor(Date.now() / 1000));
                assert.isAbove(attr[4], Math.floor(Date.now() / 1000) - 300);
            }
        });
    });

    describe('removeMember', function() {
        it('should do nothing for non-existent members', async function() {
            await lms.removeMember(0x0);
        });
        it('should deactivate a member', async function() {
            await lms.removeMember(web3.eth.coinbase);
            let [name, account, email, status, timestamp] = await lms.getOwnerDetails();
            assert.equal(name, 'Lallan');
            assert.equal(account, web3.eth.coinbase);
            assert.equal(email, "email");
            assert.equal(status.valueOf(), 1);
        });
    });

    describe('addBook', function() {
        it('should add a book with the provided details', async function() {
            await lms.addBook("Life Is What You Make It", "Preeti Shenoy", "Srishti Publisher", "https://tinyurl.com/mj55qnr", "Life Is \
What You Make It is a fictional story about a strong female", "Literature & Fiction");
            let bookCount = await lms.numBooks();
            assert.equal(bookCount, 1);
            let book = await lms.getBook(1);
            let bookAttr = book.split(';');
            assert.equal(bookAttr[1], 'Life Is What You Make It');
            assert.equal(bookAttr[2], 'Preeti Shenoy');
            assert.equal(bookAttr[3], 'Srishti Publisher');
            assert.equal('0x' + bookAttr[4], web3.eth.coinbase);
            assert.equal('0x' + bookAttr[5], 0x0);
            assert.equal(bookAttr[6], '0');
            assert.isAtMost(bookAttr[7], Math.floor(Date.now() / 1000));
            assert.isAbove(bookAttr[7], Math.floor(Date.now() / 1000) - 300);
            assert.equal(bookAttr[8], '0');
            assert.equal(bookAttr[9], 'https://tinyurl.com/mj55qnr');
            assert.equal(bookAttr[10], 'Life Is What You Make It is a fictional story about a strong female');
            assert.equal(bookAttr[11], 'Literature & Fiction');
        });
        it("Should add a book and add endowment in owner's account", async function() {
            let ownerBal1 = web3.eth.getBalance(accounts[0]);
            let contractBal1 =  web3.eth.getBalance(lms.address);
            await lms.addBook("Life Is What You Make It", "Preeti Shenoy", "Srishti Publisher", "https://tinyurl.com/mj55qnr", "Life Is \
                What You Make It is a fictional story about a strong female", "Literature & Fiction");
            let ownerBal2 = web3.eth.getBalance(accounts[0]);
            let contractBal2 =  web3.eth.getBalance(lms.address);
            // TODO - Include Gas estimation price in owner's balance check
            assert.isAtMost(ownerBal2.minus(ownerBal1), 10**12);
            assert.equal(contractBal1.minus(contractBal2), 10**12);
        });
        it('should add multiple books', async function() {
            await lms.addMember('another account', accounts[1], "Jd@gmail.com");
            await lms.addBook('from', 'another', 'account', 'image', 'describing', 'genre', {from: accounts[1]});
            let info = [
                {title: 't1', author: 'a1', publisher: 'p1', imgUrl: 'u1', description: 'd1', genre: 'g1'},
                {title: 't2', author: 'a2', publisher: 'p2', imgUrl: 'u2', description: 'd2', genre: 'g2'},
                {title: 't3', author: 'a3', publisher: 'p3', imgUrl: 'u3', description: 'd3', genre: 'g3'}
            ]
            for (let i = 0; i < 3; i++) {
                await lms.addBook(info[i].title, info[i].author, info[i].publisher, info[i].imgUrl, info[i].description, info[i].genre);
            }
            let bookCount = await lms.numBooks();
            assert.equal(bookCount.valueOf(), 4);
            let [books, count] = await lms.getMyBooks();
            assert.equal(count.valueOf(), 3);
            books = books.split('|');
            for (let i = 0; i < count; i++) {
                let bookAttr = books[i].split(';');
                assert.equal(bookAttr[1], info[i].title);
                assert.equal(bookAttr[2], info[i].author);
                assert.equal(bookAttr[3], info[i].publisher);
                assert.equal('0x' + bookAttr[4], web3.eth.coinbase);
                assert.equal('0x' + bookAttr[5], 0x0);
                assert.equal(bookAttr[6], '0');
                assert.isAtMost(bookAttr[7], Math.floor(Date.now() / 1000));
                assert.isAbove(bookAttr[7], Math.floor(Date.now() / 1000) - 300);
                assert.equal(bookAttr[8], '0');
                assert.equal(bookAttr[9], info[i].imgUrl);
                assert.equal(bookAttr[10], info[i].description);
                assert.equal(bookAttr[11], info[i].genre);
            }
        });
        it('should not allow non-members to add a book', async function() {
            await lms.removeMember(web3.eth.coinbase);
            let res = await lms.addBook("t", "a", "p", "u", "d", "g");
            assert.equal(res.logs[0].args.statusCode.c[0], 100);
            let res1 = await lms.addBook("t", "a", "p", "u", "d", "g", {from: accounts[1]});
            assert.equal(res1.logs[0].args.statusCode.c[0], 100);
        });
        it('should not allow contract to add a book if balance is less than reward 10**2', async function() {
            await lms.removeMember(web3.eth.coinbase);
            let lms2 = await LMS.new('Lallan2', "email2", {value: web3.toWei(0.0000001)});
            let res = await lms2.addBook("t", "a", "p", "u", "d", "g");
            assert.equal(res.logs[0].args.statusCode.c[0], 120);
        });
    });

    describe('getBook', function() {
        it('should throw an error for a non-existent index', async function() {
            let res = await lms.getBook(-1);
            assert.equal(res, '');
            let res2 = await lms.getBook(0);
            assert.equal(res2, '');
            let res3 = await lms.getBook(2);
            assert.equal(res3, '');
        })
    });

    describe('updateBook', function() {
        it('should update a book with new details provided', async function() {
            await lms.addBook("Life Is What You Make It", "Preeti Shenoy", "Srishti Publisher", "https://tinyurl.com/mj55qnr", "Life Is \
What You Make It is a fictional story about a strong female", "Literature & Fiction");
            await lms.updateBook(1, 't', 'a', 'p', 'imgUrl','d', 'g');
            let bookCount = await lms.numBooks();
            assert.equal(bookCount, 1);
            let book = await lms.getBook(1);
            let bookAttr = book.split(';');
            assert.equal(bookAttr[1], 't');
            assert.equal(bookAttr[2], 'a');
            assert.equal(bookAttr[3], 'p');
            assert.equal('0x' + bookAttr[4], web3.eth.coinbase);
            assert.equal('0x' + bookAttr[5], 0x0);
            assert.equal(bookAttr[6], '0');
            assert.isAtMost(bookAttr[7], Math.floor(Date.now() / 1000));
            assert.isAbove(bookAttr[7], Math.floor(Date.now() / 1000) - 300);
            assert.equal(bookAttr[8], '0');
            assert.equal(bookAttr[9], 'imgUrl');
            assert.equal(bookAttr[10], 'd');
            assert.equal(bookAttr[11], 'g');
        });
        it('should not update book if request sender is not book owner', async function() {
            await lms.addMember('Other member', accounts[1], "Om@gmail.com");
            await lms.addBook("Life Is What You Make It", "Preeti Shenoy", "Srishti Publisher", "https://tinyurl.com/mj55qnr", "Life Is \
What You Make It is a fictional story about a strong female", "Literature & Fiction");
            let res = await lms.updateBook(1, 't', 'a', 'p', 'imgUrl','d', 'g',{from: accounts[1]});
            assert.equal(res.logs[0].args.statusCode.c[0], 122);
            let bookCount = await lms.numBooks();
            assert.equal(bookCount, 1);
            let book = await lms.getBook(1);
            let bookAttr = book.split(';');
            assert.equal(bookAttr[1], 'Life Is What You Make It');
            assert.equal(bookAttr[2], 'Preeti Shenoy');
            assert.equal(bookAttr[3], 'Srishti Publisher');
            assert.equal('0x' + bookAttr[4], web3.eth.coinbase);
            assert.equal('0x' + bookAttr[5], 0x0);
            assert.equal(bookAttr[6], '0');
            assert.isAtMost(bookAttr[7], Math.floor(Date.now() / 1000));
            assert.isAbove(bookAttr[7], Math.floor(Date.now() / 1000) - 300);
            assert.equal(bookAttr[8], '0');
            assert.equal(bookAttr[9], 'https://tinyurl.com/mj55qnr');
            assert.equal(bookAttr[10], 'Life Is What You Make It is a fictional story about a strong female');
            assert.equal(bookAttr[11], 'Literature & Fiction');
        });
    });

    describe('getAllBooks', function() {
        it('should return all books, irrespective of who owns them', async function() {
            await lms.addMember('Other member', accounts[1], "Om@gmail.com");
            await lms.addMember('Another member', accounts[2], "Am@gmail.com");
            let info = [
                {title: 't1', author: 'a1', publisher: 'p1', imgUrl: 'u1', description: 'd1', genre: 'g1'},
                {title: 't2', author: 'a2', publisher: 'p2', imgUrl: 'u2', description: 'd2', genre: 'g2'},
                {title: 't3', author: 'a3', publisher: 'p3', imgUrl: 'u3', description: 'd3', genre: 'g3'}
            ]
            for (let i = 0; i < 3; i++) {
                await lms.addBook(info[i].title, info[i].author, info[i].publisher, info[i].imgUrl, info[i].description, info[i].genre, {from: accounts[i]});
            }
            let bookCount = await lms.numBooks();
            assert.equal(bookCount.valueOf(), 3);
            let [books, count] = await lms.getAllBooks();
            assert.equal(count.valueOf(), 3);
            books = books.split('|');
            for (let i = 0; i < count; i++) {
                let bookAttr = books[i].split(';');
                assert.equal(bookAttr[1], info[i].title);
                assert.equal(bookAttr[2], info[i].author);
                assert.equal(bookAttr[3], info[i].publisher);
                assert.equal('0x' + bookAttr[4], accounts[i]);
                assert.equal('0x' + bookAttr[5], 0x0);
                assert.equal(bookAttr[6], '0');
                assert.isAtMost(bookAttr[7], Math.floor(Date.now() / 1000));
                assert.isAbove(bookAttr[7], Math.floor(Date.now() / 1000) - 300);
                assert.equal(bookAttr[8], '0');
                assert.equal(bookAttr[9], info[i].imgUrl);
                assert.equal(bookAttr[10], info[i].description);
                assert.equal(bookAttr[11], info[i].genre);
            }
        });
    });

    describe('getMyBooks', function() {
        it('should return owned and borrowed books, depending upon the logged in user', async function() {
            await lms.addMember('Other member', accounts[1], "Om@gmail.com");
            await lms.addMember('Another member', accounts[2], "Am@gmail.com");
            await lms.addMember('One more member', accounts[3], "Omm@gmail.com");
            let info = [
                {title: 't1', author: 'a1', publisher: 'p1', imgUrl: 'u1', description: 'd1', genre: 'g1'},
                {title: 't2', author: 'a2', publisher: 'p2', imgUrl: 'u2', description: 'd2', genre: 'g2'},
                {title: 't3', author: 'a3', publisher: 'p3', imgUrl: 'u3', description: 'd3', genre: 'g3'},
                {title: 't4', author: 'a4', publisher: 'p4', imgUrl: 'u4', description: 'd4', genre: 'g4'}
            ]
            for (let i = 0; i < 3; i++) {
                await lms.addBook(info[i].title, info[i].author, info[i].publisher, info[i].imgUrl, info[i].description, info[i].genre, {from: accounts[i]});
            }
            await lms.addBook(info[3].title, info[3].author, info[3].publisher, info[3].imgUrl, info[3].description, info[3].genre, {from: accounts[3]});
            await lms.borrowBook(2, {from: accounts[0], value: web3.toWei(0.1) /2 });
            await lms.borrowBook(3, {from: accounts[0], value: web3.toWei(0.1) /2 });
            let bookCount = await lms.numBooks();
            assert.equal(bookCount.valueOf(), 4);
            let [books, count] = await lms.getMyBooks({from: accounts[0]});
            assert.equal(count.valueOf(), 3);
            books = books.split('|');
            for (let i = 0; i < count; i++) {
                let bookAttr = books[i].split(';');
                assert.equal(bookAttr[1], info[i].title);
                assert.equal(bookAttr[2], info[i].author);
                assert.equal(bookAttr[3], info[i].publisher);
                assert.equal(accounts[0], ('0x' + bookAttr[5]) == 0x0 ? ('0x' + bookAttr[4]) : ('0x' + bookAttr[5]));
                assert.equal(bookAttr[6], ('0x' + bookAttr[5]) == 0x0 ? '0' : '1');
                assert.isAtMost(bookAttr[7], Math.floor(Date.now() / 1000));
                assert.isAbove(bookAttr[7], Math.floor(Date.now() / 1000) - 300);
                assert.equal(bookAttr[9], info[i].imgUrl);
                assert.equal(bookAttr[10], info[i].description);
                assert.equal(bookAttr[11], info[i].genre);
            }
        });
    });

    describe('borrowBook', function() {
        it("should not allow borrowing book if value send is less than 10**12", async function() {
            await lms.addBook('a', 'b', 'c', 'e', 'f', 'g');
            await lms.addMember('Michael Scofield', accounts[2], "Ms@gmail.com");
            let res = await lms.borrowBook(1, {from: accounts[2], value: 10**12});
            assert.equal(res.logs[0].args.bookId.c[0],1);
            let res1 = await lms.borrowBook(1, {from: accounts[2], value: 10000});
            assert.equal(res1.logs[0].args.statusCode.c[0],123);
        });
        it("should not allow non-member to borrow book ", async function() {
            await lms.addBook('a', 'b', 'c', 'e', 'f', 'g');
            let res = await lms.borrowBook(1, {from: accounts[1], value: 10**12});
            assert.equal(res.logs[0].args.statusCode.c[0],100);
        });
        it('should borrow book and transfer 50% weis to owner account', async function() {
            await lms.addBook('a', 'b', 'c', 'e', 'f', 'g');
            await lms.addMember('Michael Scofield', accounts[2], "Ms@gmail.com");
            // Balance before borrow book
            let ownerBal1 = web3.fromWei(web3.eth.getBalance(accounts[0]));
            let borrowBal1 = web3.fromWei(web3.eth.getBalance(accounts[2]));
            let contractBal1 = web3.fromWei(web3.eth.getBalance(lms.address));
            // Borrowing Book with passing atleast minimun Book Issuance Amount
            await lms.borrowBook(1, {from: accounts[2], value: web3.toWei(0.1)});
            // Balance after borrow book
            let ownerBal2 = web3.fromWei(web3.eth.getBalance(accounts[0]));
            let borrowBal2 = web3.fromWei(web3.eth.getBalance(accounts[2]));
            let contractBal2 = web3.fromWei(web3.eth.getBalance(lms.address));
            // assert statements comparing the balances
            assert.equal((contractBal2.minus(contractBal1)).valueOf(), 0.05);
            assert.equal((ownerBal2.minus(ownerBal1)).valueOf(), 0.05);
            assert.isAtLeast((borrowBal1.minus(borrowBal2)).valueOf(), 0.1); 
            // TODO - Include Gas esimation price in borrowers balance check
        });
        it('should not allow borrowing books that are already borrowed', async function() {
            await lms.addBook('t', 'a', 'p', 'u', 'd', 'g');
            await lms.borrowBook(1, {from: accounts[0], value: web3.toWei(0.1)});
            let res = await lms.borrowBook(1, {from: accounts[0], value: web3.toWei(0.1)});
            assert.equal(res.logs[0].args.statusCode.c[0],124);
        });
        it("should not allow borrowing books that don't exist", async function() {
            let res = await lms.borrowBook(1, {from: accounts[0], value: web3.toWei(0.1)});
            assert.equal(res.logs[0].args.statusCode.c[0],124);
        });
        it('should set the borrower, issue date and state', async function() {
            await lms.addBook("1984", "Orwell", "Classic Publishers", "image url", "description", "genre");
            await lms.addMember('Johnny', accounts[1], "J@gmail.com");
            await lms.borrowBook(1, {from: accounts[1], value: web3.toWei(0.1)});

            let book = await lms.getBook(1);
            let bookAttr = book.split(';');

            // Changed attributes
            assert.equal('0x' + bookAttr[5], accounts[1]);
            assert.equal(bookAttr[6], 1);
            assert.isAtMost(bookAttr[8], Math.floor(Date.now() / 1000));
            assert.isAbove(bookAttr[8], Math.floor(Date.now() / 1000) - 300);

            // Test against regression
            assert.equal(bookAttr[1], '1984');
            assert.equal(bookAttr[2], 'Orwell');
            assert.equal(bookAttr[3], 'Classic Publishers');
            assert.equal('0x' + bookAttr[4], web3.eth.coinbase);
            assert.isAtMost(bookAttr[7], Math.floor(Date.now() / 1000));
            assert.isAbove(bookAttr[7], Math.floor(Date.now() / 1000) - 300);
            assert.equal(bookAttr[9], 'image url');
            assert.equal(bookAttr[10], 'description');
            assert.equal(bookAttr[11], 'genre');
        });
        it("should generate Borrow event log", async function() {
            await lms.addBook("1984", "Orwell", "Classic Publishers", "image url", "description", "genre");
            await lms.addMember('Johnny', accounts[1], "J@gmail.com");
            await lms.borrowBook(1, {from: accounts[1], value: web3.toWei(0.1)});
            let borrowEvent = lms.Borrow({fromBlock: 0});
            borrowEvent.watch(function(err, result) {
                borrowEvent.stopWatching();
                if (err) { throw err; }
                assert.equal(result.args.bookId, 1);
                assert.equal(result.args.borrower, accounts[1]);
                assert.isAtMost(result.args.timestamp, Math.floor(Date.now() / 1000));
                assert.isAbove(result.args.timestamp, Math.floor(Date.now() / 1000) - 300);
            });
        });
    });

    describe('returnBook', function() {
        it("should not allow returning books that don't exist", async function() {
            let res = await (lms.returnBook(1));
            assert.equal(res.logs[0].args.statusCode.c[0],126);
        });
        it('should not allow returning books that have not been issued', async function() {
            await lms.addBook('t', 'a', 'p', 'u', 'd', 'g');
            let res = await (lms.returnBook(1));
            assert.equal(res.logs[0].args.statusCode.c[0],126);
        });
        it('should reset the borrower, issue date and state', async function() {
            await lms.addBook('t', 'a', 'p', 'u', 'd', 'g');
            let orig = await lms.getBook(1);
            await lms.addMember('Michael Scofield', accounts[2], "Ms@gmail.com");
            await lms.borrowBook(1, {from: accounts[2], value: 10**12})
            await lms.returnBook(1);
            let book = await lms.getBook(1);
            assert.equal(book, orig);
        });
        it('should allow only the book owner to return the book', async function() {
            // Add a member with a book
            await lms.addMember('Other', accounts[1], "O@gmail.com");
            await lms.addBook('t', 'a', 'p', 'u', 'd', 'g', {from: accounts[1]});
            // Default member borrows the book
            await lms.borrowBook(1, {from: accounts[0], value: 10**12});
            // Default member tries to return the book
            let res = await (lms.returnBook(1));
            assert.equal(res.logs[0].args.statusCode.c[0],126);
            // Book owner successfully returns the book
            await lms.returnBook(1, {from: accounts[1]});
        });
        it("should generate Return event log", async function() {
            await lms.addBook("1984", "Orwell", "Classic Publishers", "image url", "description", "genre");
            await lms.addMember('Johnny', accounts[1], "J@gmail.com");
            await lms.borrowBook(1, {from: accounts[1], value: 10**12});
            await lms.returnBook(1);
            let returnEvent = lms.Return({fromBlock: 0});
            returnEvent.watch(function(err, result) {
                returnEvent.stopWatching();
                if (err) { throw err; }
                assert.equal(result.args.bookId, 1);
                assert.equal(result.args.borrower, accounts[1]);
                assert.isAtMost(result.args.timestamp, Math.floor(Date.now() / 1000));
                assert.isAbove(result.args.timestamp, Math.floor(Date.now() / 1000) - 300);
            });
        });
    });

    describe('rateBook', function() {
        it('should allow a member to rate and write descriptive reviews of a book', async function() {
            await lms.addBook("1984", "Orwell", "Classic Publishers", "image url", "description", "genre");
            await lms.rateBook(1, 5, "A must-read classic!", 0);
            let rateEvent = lms.Rate({fromBlock: 0});
            let book = await lms.getBook(1);
            let bookAttr = book.split(';');
            rateEvent.watch(function(err, result) {
                rateEvent.stopWatching();
                if (err) { throw err; }
                assert.equal(result.args.bookId, 1);
                assert.equal(result.args.reviewer, accounts[0]);
                assert.equal(result.args.rating, 5);
                assert.equal(result.args.comments, "A must-read classic!");
                assert.isAtMost(result.args.timestamp, Math.floor(Date.now() / 1000));
                assert.isAbove(result.args.timestamp, Math.floor(Date.now() / 1000) - 300);
                assert.equal(bookAttr[12], 5);
            });
        });
        it('should not allow rating a non-existing book', async function() {
            let res = await lms.rateBook(1, 5, "A must-read classic!", 0);
            assert.equal(res.logs[0].args.statusCode.c[0],127);
        });
        it('should not allow rating a book with invalid rating i.e. rate<1 or rate>5', async function() {
            await lms.addBook("1984", "Orwell", "Classic Publishers", "image url", "description", "genre");
            let res = await lms.rateBook(1, 0, "A must-read classic!", 0);
            assert.equal(res.logs[0].args.statusCode.c[0],127);
        }); 
        it('should allow a member to rate multiple times and fetch the ratings from events', async function() {
            await lms.addBook("1984", "Orwell", "Classic Publishers", "image url", "description", "genre");
            let reviews = [
                {bookId: 1, rating: 5, comments: 'A must-read classic!', oldrating: 0},
                {bookId: 1, rating: 4, comments: 'Great Book, I loved it', oldrating: 5},
                {bookId: 1, rating: 3, comments: 'Decent book, not my types though', oldrating: 4},
                {bookId: 1, rating: 2, comments: 'Hell No!, Boring book', oldrating: 3}
            ]
            for (let i = 0; i <= 3; i++) {
                await lms.rateBook(reviews[i].bookId, reviews[i].rating, reviews[i].comments, reviews[i].oldrating);
            }
            let rateEvent = lms.Rate({}, {fromBlock: 0, toBlock: 'latest'});
            let i = 0;
            let book = await lms.getBook(1);
            let bookAttr = book.split(';');
            rateEvent.watch(function(err, result) {
                rateEvent.stopWatching();
                if (!err) {
                    assert.equal(reviews[i].bookId, result.args.bookId);
                    assert.equal(reviews[i].rating, result.args.rating);
                    assert.equal(reviews[i].comments, result.args.comments);
                    assert.equal(result.args.reviewer, accounts[0]);
                    assert.isAtMost(result.args.timestamp, Math.floor(Date.now() / 1000));
                    assert.isAbove(result.args.timestamp, Math.floor(Date.now() / 1000) - 300);
                    i++;
                }
            });
            assert.equal(bookAttr[12], 2);
        });

        it('should allow multiple members to rate a book and fetch ratings of that particular book from events', async function() {
            await lms.addBook("ABC", "author1", "Publishers1", "image url1", "description1", "genre1");
            await lms.addBook("DEF", "author2", "Publishers2", "image url2", "description2", "genre2");
            await lms.addMember("Sanchit", accounts[1], "S@gmail.com");
            await lms.addMember("Chandan", accounts[2], "C@gmail.com");
            await lms.addMember("Neel", accounts[3], "N@gmail.com")
            let reviews = [
                {bookId: 1, rating: 5, comments: 'A must-read classic!', oldrating: 0},
                {bookId: 1, rating: 4, comments: 'Great Book, I loved it', oldrating: 0},
                {bookId: 2, rating: 3, comments: 'Decent book, not my types though', oldrating: 0},
                {bookId: 2, rating: 2, comments: 'Hell No!, Boring book', oldrating: 0},
            ]
            for (let i = 0; i <= 3; i++) {
                await lms.rateBook(reviews[i].bookId, reviews[i].rating, reviews[i].comments, reviews[i].oldrating, {from: accounts[i]});
            }
            let book = await lms.getBook(2);
            let bookAttr = book.split(';');
            let rateEvent = lms.Rate({bookId: 2}, {fromBlock: 0, toBlock: 'latest'});
            let i = 2; // checking for second book hence i starts from 2
            rateEvent.watch(function(err, result) {
                rateEvent.stopWatching();
                if (!err) {
                    assert.equal(reviews[i].bookId, result.args.bookId);
                    assert.equal(reviews[i].rating, result.args.rating);
                    assert.equal(reviews[i].comments, result.args.comments);
                    assert.equal(result.args.reviewer, accounts[i]);
                    assert.isAtMost(result.args.timestamp, Math.floor(Date.now() / 1000));
                    assert.isAbove(result.args.timestamp, Math.floor(Date.now() / 1000) - 300);
                    i++;
                }
            });
            assert.equal((bookAttr[13] / bookAttr[14]), 2.5);
        });
    });

    // These tests have been moved to the bottom as the events take longer to finish, which sometimes confuses
    // testrpc about whether the tests are complete or not. You can see a continuous output "eth_getFilterChanges"
    // in the testrpc console when that happens.

    describe('constructorFunction', function() {
        it('should have default amount of 10**17 in contract account', async function() {
            let contractBal =  web3.eth.getBalance(lms.address);
            assert.equal(contractBal.valueOf(), 10**17);
        });

        it('should have a default member', async function() {
            let memberCount = await lms.numMembers();
            assert.equal(memberCount, 1);
        });

        it('should have no books by default', async function() {
            let bookCount = await lms.numBooks();
            assert.equal(bookCount, 0);
        });
    });

    describe('getOwnerDetails', function() {
        it('should provide owner details', async function() {
            let [name, account, email, status, timestamp] = await lms.getOwnerDetails();
            assert.equal(name, 'Lallan');
            assert.equal(account, web3.eth.coinbase);
            assert.equal(email, "email")
            assert.equal(status.valueOf(), 0);
            assert.isAtMost(timestamp, Math.floor(Date.now() / 1000));
            assert.isAbove(timestamp, Math.floor(Date.now() / 1000) - 300);
        });
    });
});
