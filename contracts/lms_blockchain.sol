pragma solidity ^0.4.8;

import "./strings.sol";

contract lms_blockchain {
    address owner;

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
    }


    struct Member {
        uint id;
        string name;
        address account;
        MemberStatus status;
    }

    uint public numMembers;
    uint public numBooks;
    mapping(uint => Book) catalog;
    mapping(uint => Member) members;

    modifier onlyOwner {
        if (msg.sender != owner)
            throw;
        _;
    }

    modifier onlyMember {
        for (uint i=0; i < numMembers; i++) {
            if (msg.sender == members[i].account) {
                _;
            }
        }
        throw;
    }

    // constructor function
    function lms_blockchain(string name) {
        owner = msg.sender;
        // Owner is the first member of our library
        numMembers++;
        members[numMembers] = Member(numMembers, name, owner, MemberStatus.Active);
    }

    function addMember(string name, address account) {
        numMembers++;
        members[numMembers] = Member(numMembers, name, account, MemberStatus.Active);

    }

    // function addMember(string name, address addr) {
    //     for (uint i=0; i < numMembers; i++){
    //         if (members[i].account == addr) {
    //            bool memberfound = true;
    //         }
    //     }
    //     if (!memberfound) {
    //         numMembers++;
    //         members[numMembers] = Member(numMembers, name, addr, MemberStatus.Active);            
    //     }
    // }

    function getOwnerDetails() constant returns (string) {
        // Owner(members[0].name);
        return members[0].name;
    }

    function addBook(string title, string author, string publisher) {
        catalog[numBooks] = Book({
            id: numBooks,
            title: title,
            publisher: publisher,
            author: author,
            owner: msg.sender,
            state: State.Available,
            lastIssueDate: 0,
            dueDate: 0,
            rating: 0,
            currentOwner: msg.sender

        });
        numBooks++;
    }

    function getNumberOfBooks() constant returns (uint){
        // numBooks = 50;
        return numBooks;
    }

    function getNumberOfMembers() constant returns (uint){
        return numMembers;
    }

    function getMemberDetails(uint index) constant returns(string, address, MemberStatus) {
        return(members[index].name, members[index].account, members[index].status);
    }

    function getBookDetails(uint index) constant returns(string, string, string, address, State, uint) {
        return(catalog[index].title, catalog[index].publisher, catalog[index].author, 
            catalog[index].currentOwner, catalog[index].state, catalog[index].lastIssueDate);
    }

  
    function getMemberList() constant returns(string) {

        string memory memberList; 
        // console.log(numMembers);  
        for (var i=0; i < numMembers; i++) {
            memberList = (memberList.toSlice().concat("\n".toSlice())).toSlice().concat((members[i].name).toSlice());
            // memberList = memberList.toSlice().concat(members[i].name);
            // memberList = memberList+","+members[i];
        }
        return memberList;
    }

    function getBookList() public onlyMember constant returns(string) {
        string memory bookList;
        for (uint i=0; i< numBooks; i++) {
            // bookList = bookList.toSlice().concat(i.toSlice());
            bookList = (bookList.toSlice().concat("\n".toSlice())).toSlice().concat((catalog[i].title).toSlice());
        }
        return bookList;
    }


    function borrowBook(uint id, uint dueDate) public onlyMember {
        catalog[id].state = State.Borrowed;
        catalog[id].currentOwner = msg.sender;
        catalog[id].lastIssueDate = block.timestamp;
        catalog[id].dueDate = dueDate;
    }

    function returnBook(uint id) public onlyMember {
        catalog[id].state =  State.Available;
        catalog[id].currentOwner = catalog[id].owner;
        catalog[id].dueDate = 0;

    }

    function getBookDetail(uint id) public onlyMember constant returns(string){
    }


    function getMemberDetail(uint id) public onlyMember constant returns(string){

    }

    function deactivateMember(string name) public onlyOwner{

    }

    function removeBook(string name) public onlyOwner{

    }

}
