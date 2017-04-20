pragma solidity ^0.4.8;

import "./strings.sol";
import "./StringLib.sol";
import "zeppelin/lifecycle/Killable.sol";

contract lms_blockchain is Killable {
    // In order to use the third-party strings library
    using strings for *;

    enum State {
        Available,
        Borrowed,
        Overdue,
        Lost,
        Removed
    }

    enum MemberStatus {
        Active,
        Inactive
    }

    struct Book {
        uint id;
        string title;
        string author;
        string publisher;
        address owner;
        State state;
        uint lastIssueDate;
        uint dueDate;
        uint rating;
        address currentOwner;
        uint dateAdded;
    }

    struct Member {
        string name;
        address account;
        MemberStatus status;
        uint dateAdded;
    }

    uint public numMembers;
    uint public numBooks;
    mapping(uint => Book) public catalog;
    mapping(uint => Member) public members;
    mapping(address => uint) memberIndex;

    // modifier onlyOwner {
    //     if (msg.sender != owner)
    //         throw;
    //     _;
    // }

    modifier onlyMember {
        bool member = false;
        for (uint i=1; i <= numMembers; i++) {
            if (msg.sender == members[i].account && members[i].status == MemberStatus.Active) {
                member = true;
                break;
            }
        }
        if (!member) {
            throw;
        } else {
            _;
        }
    }

    // constructor function
    function lms_blockchain(string name) {
        owner = msg.sender;
        // Owner is the first member of our library and at 1 index
        members[numMembers++] = Member(name, owner, MemberStatus.Active, now);
        memberIndex[owner] = numMembers;
    }

    // function addMember(string name, address account) {
    //     numMembers++;
    //     members[numMembers] = Member(numMembers, name, account, MemberStatus.Active);

    // }

    // function addMember(string name, address addr) {
    //     for (var i=0; i<= numMembers; i++){
    //         if (members[i].account == addr) {
    //            bool memberfound = true;
    //         }
    //     }
    //     if (!memberfound) {
    //         numMembers++;
    //         members[numMembers] = Member(numMembers, name, addr, MemberStatus.Active, now);            
    //     }
    // }


    // Need to understand the implementation
    function addMember(string name, address account) public onlyOwner {
        // Add or activate member
        var index = memberIndex[account];
        if (index != 0) {           // This is the reason index 0 is not used
            members[index].status = MemberStatus.Active;
            return;
        }
        members[++numMembers] = Member(name, account, MemberStatus.Active, now);
        memberIndex[account] = numMembers;
    }


    function deactivateMember(address account) public onlyOwner{
    // Deactivate member
        var index = memberIndex[account];
        if (index !=0 || index !=1 ){
            members[index].status = MemberStatus.Inactive;
        }
    }

    // function getOwnerDetails() constant returns (string, address) {
    //     return (members[0].name, members[0].account);
    // }

    function getOwnerDetails() constant returns (string, address, MemberStatus, uint) {
        return getMemberDetails(owner);
    }

    // function getMemberDetails(uint index) constant returns(string, address, MemberStatus) {
    //     return(members[index].name, members[index].account, members[index].status);
    // }
    function getMemberDetails(address account) constant returns (string, address, MemberStatus, uint) {
        var i = memberIndex[account];
        return (members[i].name, members[i].account, members[i].status, members[i].dateAdded);
    }


    function addBook(string title, string author, string publisher) {
        numBooks++;
        catalog[numBooks] = Book({
            id: numBooks,
            title: title,
            publisher: publisher,
            author: author,
            owner: msg.sender,
            state: State.Available,
            dateAdded: now,
            lastIssueDate: 0,
            dueDate: 0,
            rating: 0,
            currentOwner: 0x0

        });
    }

    function getNumberOfBooks() constant returns (uint){
        // numBooks = 50;
        return numBooks;
    }

    function getNumberOfMembers() constant returns (uint){
        return numMembers;
    }

    // function getBookDetails(uint index) constant returns(string) {
    //     return(catalog[index].title);
    // }

    // function getBookDetails(uint index) constant returns(string, string, string, address, State, uint) {
    //     return(catalog[index].title, catalog[index].publisher, catalog[index].author,catalog[index].currentOwner, catalog[index].state, catalog[index].lastIssueDate);
    // }
  
    // function getMemberList() constant returns(string) {

    //     string memory memberList; 
    //     // console.log(numMembers);  
    //     for (var i=0; i < numMembers; i++) {
    //         memberList = (memberList.toSlice().concat("\n".toSlice())).toSlice().concat((members[i].name).toSlice());
    //         // memberList = memberList.toSlice().concat(members[i].name);
    //         // memberList = memberList+","+members[i];
    //     }
    //     return memberList;
    // }

    // function getBookList() public onlyMember constant returns(string) {
    //     string memory bookList;
    //     for (uint i=0; i< numBooks; i++) {
    //         // bookList = bookList.toSlice().concat(i.toSlice());
    //         bookList = (bookList.toSlice().concat("\n".toSlice())).toSlice().concat((catalog[i].title).toSlice());
    //     }
    //     return bookList;
    // }


    // check how strings.slice is implemented.
    function getBook(uint i) constant returns (string bookString){
        var book_details = new strings.slice[](11);
        book_details[0] = StringLib.uintToString(catalog[i].id).toSlice();
        book_details[1] = catalog[i].title.toSlice();
        book_details[2] = catalog[i].author.toSlice();
        book_details[3] = catalog[i].publisher.toSlice();
        book_details[4] = StringLib.addressToString(catalog[i].owner).toSlice();
        book_details[5] = StringLib.addressToString(catalog[i].currentOwner).toSlice();
        book_details[6] = StringLib.uintToString(uint(catalog[i].state)).toSlice();
        book_details[7] = StringLib.uintToString(catalog[i].dateAdded).toSlice();
        book_details[8] = StringLib.uintToString(catalog[i].lastIssueDate).toSlice();
        book_details[9] = StringLib.uintToString(catalog[i].rating).toSlice();
        book_details[10] = StringLib.uintToString(catalog[i].dueDate).toSlice();
        bookString = ";".toSlice().join(book_details);
    }

    // need to understand why loop is starting from 1
    function getBooks(bool ownerFilter) constant onlyMember returns (string bookString, uint8 count) {
        string memory book;
        //Iterate over the entire catalog to find my books
        for (uint i = 1; i <= numBooks; i++) {
            if (!ownerFilter || catalog[i].owner == msg.sender) {
                book = getBook(i);
                count++;
                if (bookString.toSlice().equals("".toSlice())) {
                    bookString = book;
                } else {
                    bookString = bookString.toSlice().concat('|'.toSlice()).toSlice().concat(book.toSlice());
                }
            }
        }
    }

    function getMyBooks() constant onlyMember returns (string bookString, uint8 count) {
        return getBooks(true);
    }

    function getAllBooks() constant onlyMember returns (string bookString, uint8 count) {
        return getBooks(false);
    }

    function borrowBook(uint id, uint dueDate) public onlyMember {
        if (id > numBooks || catalog[id].state != State.Available){
            throw;
        }
        catalog[id].state = State.Borrowed;
        catalog[id].currentOwner = msg.sender;
        catalog[id].lastIssueDate = now;
        catalog[id].dueDate = dueDate;
    }

    function returnBook(uint id) public onlyMember {
        if (id > numBooks || catalog[id].state == State.Available || catalog[id].owner != msg.sender) {
            throw;
        }
        catalog[id].state =  State.Available;
        catalog[id].currentOwner = catalog[id].owner;
        catalog[id].dueDate = 0;

    }

    // function deactivateMember(uint index) public onlyOwner{
    // // Deactivate member
    // members[index].status = MemberStatus.Inactive;
    // }

    // function removeBook(string name) public onlyOwner{

    // }

}
