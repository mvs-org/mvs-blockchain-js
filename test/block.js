var assert = require('assert');
var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    should = chai.should(),
    Blockchain = require('../')({
        network: 'testnet'
    });
chai.use(chaiAsPromised);

describe('Block', function() {

    it('Get height', () => {
        return Blockchain.height()
            .then(height => height > 0)
            .should.eventually.be.equal(true);
    });

    it('Get genesis block', () => {
        return Blockchain.block.get(0)
            .then(response => response.previous_block_hash)
            .should.eventually.be.equal("0000000000000000000000000000000000000000000000000000000000000000");
    });

    /*describe('List blocks', function() {
        it('List blocks', () => {
            return Blockchain.block.list(1, 10)
                .should.eventually.be.fulfilled;
        });
        it('List invalid number of blocks', () => {
            return Blockchain.block.list(1, 101)
                .should.eventually.be.rejected;
        });
    });*/

    it('Get blocktime', () => {
        return Blockchain.block.blocktime()
            .should.eventually.be.fulfilled;
    });
});
