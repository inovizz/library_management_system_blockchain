pragma solidity ^0.4.8;

contract OrganisationInterface {
    function OrganisationInterface(address, address);

    function setDataStore(address, address);

    function getDataStore() constant returns (address, address);

    function addBook(uint);

    function bookCount() constant returns (uint);

    function getBook(uint) constant returns (string);

    function getAllBooks() constant returns (string, uint8);

    function borrowBook(uint);

    function returnBook(uint);

    function rateBook(uint, uint, uint);

    function kill(address);

    function () {
        // This function gets executed if a
        // transaction with invalid data is sent to
        // the contract or just ether without data.
        // We revert the send so that no-one
        // accidentally loses money when using the
        // contract.
        throw;
    }
}
