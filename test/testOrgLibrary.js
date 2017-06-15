'use strict';

const OrgLibrary = artifacts.require('../contracts/OrgLibrary.sol');

contract('OrgLibrary', function(accounts) {
    let parent;

    beforeEach(async function() {
        parent = await OrgLibrary.new();
    });

    it('is a placeholder test case');
});