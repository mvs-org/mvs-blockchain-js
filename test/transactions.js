var assert = require('assert');
var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    should = chai.should(),
    Blockchain = require('../')();
chai.use(chaiAsPromised);

describe('Transactions', function() {

    it('Get transaction', () => {
        return Blockchain.transaction.get("2a845dfa63a7c20d40dbc4b15c3e970ef36332b367500fd89307053cb4c1a2c1")
            .then((tx) => tx.block)
            .should.become("b81848ef9ae86e84c3da26564bc6ab3a79efc628239d11471ab5cd25c0684c2d");
    });
});
