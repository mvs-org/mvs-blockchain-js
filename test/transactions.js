var assert = require('assert');
var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    should = chai.should(),
    Blockchain = new require('../')({
        network: 'testnet'
    });

chai.use(chaiAsPromised);

describe('Transactions', function() {

    it('Get transaction', () => {
        return Blockchain.transaction.get("d4d612297cbecbc2d6438403e751ca83b3eedc58966033016e52889a9a86062e")
            .then((tx) => tx.block)
            .should.become("c359a1cc3dfb8b97111c3e602f1f6de31306926f9ec779cb9ea002edbee91741");
    });
});
