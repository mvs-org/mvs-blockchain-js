var assert = require('assert');
var chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    should = chai.should(),
    Blockchain = require('../')({
        network: 'testnet'
    });
chai.use(chaiAsPromised);

describe('Pricing', function() {

    it('Get pricing', () => {
        return Blockchain.pricing.tickers()
            .should.eventually.have.property("ETP");
    });
});
