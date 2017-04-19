pragma solidity ^0.4.8;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/lms_blockchain.sol";

contract Testlms_blockchain {
  function testgetNumberOfBooks() {

    lms_blockchain lms = lms_blockchain(DeployedAddresses.lms_blockchain());
    // uint expected = 10000;
    Assert.equal(lms.numMembers(), 1, "member created");
    // lms.addMember("sanchit", msg.sender);
    // Assert.equal(lms.getOwner(), "sanchit", "member found");
    // Assert.equal(lms.getNumberOfBooks(), 0, "Initally zero books found");
  }


  // function testgetOwner() {

  //   lms_blockchain lms = lms_blockchain(DeployedAddresses.lms_blockchain());
  //   // uint expected = 10000;
  //   lms.lms_blockchain("sanchit");
  //   Assert.equal(lms.getOwner(), "sanchit", "Owner Found");
  //   // Assert.equal(lms.getNumberOfBooks(), 0, "Initally zero books found");
  // }

  // function testInitialBalanceWithNewMetaCoin() {
  //   MetaCoin meta = new MetaCoin();

  //   uint expected = 10000;

  //   Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 MetaCoin initially");
  // }
}