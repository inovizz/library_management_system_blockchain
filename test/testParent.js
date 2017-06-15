'use strict';

const Parent = artifacts.require('../contracts/Parent.sol');

contract('Parent', function(accounts) {
    let parent;

    beforeEach(async function() {
        parent = await Parent.new();
    });

    it('is a placeholder test case');
});