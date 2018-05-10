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

    it('List foundation transactions until block 700000', () => {
        return Blockchain.address.txs("MSCHL3unfVqzsZbRVCJ3yVp7RgAmXiuGN3", {
                max_height: 700000
            })
            .should.become({
                "transactions": [{
                    "hash": "9363793ce46c9bbdf9749fb526a938530f8ed04aa07710fcd8340d7d3d009677",
                    "inputs": [{
                        "address": "MSCHL3unfVqzsZbRVCJ3yVp7RgAmXiuGN3",
                        "previous_output": {
                            "hash": "add6bbf9af7b1e595c39bca4862a904523b379adaf5cc534224e4a9d6f0038d0",
                            "index": 1
                        },
                        "script": "[ 3044022053646c79656918e10170ab08b44209bc6acf9b1b16c6f11b8013d022bdbd838a02202dcf5baf6743d9fdbb2fc1a5106b38e16cceafc58988b41a318110cb41fd17f901 ] [ 02f040ce9c5ea4b558885a1bd3956bc8a8b4fb4bb9cd3c23d2166b70a89df78d3c ]",
                        "sequence": 4294967295,
                        "attachment": {
                            "symbol": "ETP",
                            "decimals": 8
                        },
                        "value": 1939999999980000
                    }],
                    "outputs": [{
                        "address": "MSCHL3unfVqzsZbRVCJ3yVp7RgAmXiuGN3",
                        "attachment": {
                            "type": "etp",
                            "symbol": "ETP",
                            "decimals": 8
                        },
                        "index": 1,
                        "locked_height_range": 0,
                        "script": "dup hash160 [ c8af4279229d03bdbda8a3640e9b10e156bf93b5 ] equalverify checksig",
                        "value": 1850000000000000
                    }],
                    "height": 697705
                }, {
                    "hash": "add6bbf9af7b1e595c39bca4862a904523b379adaf5cc534224e4a9d6f0038d0",
                    "inputs": [{
                        "address": "MSCHL3unfVqzsZbRVCJ3yVp7RgAmXiuGN3",
                        "previous_output": {
                            "hash": "c3cd1996dc3f450075afca952b7ab134365ea68bcea97958567d92bf0fa91fad",
                            "index": 1
                        },
                        "script": "[ 3045022100f2191e4a8a76ffc8423a4714c1acd0a8c4a3cc6de99c1791d009a9e133d696dd022012f57a3bf6101da5007f263cb9342bd8e59d4aede688d848e59ed65c1f359e0e01 ] [ 02f040ce9c5ea4b558885a1bd3956bc8a8b4fb4bb9cd3c23d2166b70a89df78d3c ]",
                        "sequence": 4294967295,
                        "attachment": {
                            "symbol": "ETP",
                            "decimals": 8
                        },
                        "value": 2439999999990000
                    }],
                    "outputs": [{
                        "address": "MSCHL3unfVqzsZbRVCJ3yVp7RgAmXiuGN3",
                        "attachment": {
                            "type": "etp",
                            "symbol": "ETP",
                            "decimals": 8
                        },
                        "index": 1,
                        "locked_height_range": 0,
                        "script": "dup hash160 [ c8af4279229d03bdbda8a3640e9b10e156bf93b5 ] equalverify checksig",
                        "value": 1939999999980000
                    }],
                    "height": 658613
                }, {
                    "hash": "c3cd1996dc3f450075afca952b7ab134365ea68bcea97958567d92bf0fa91fad",
                    "inputs": [{
                        "address": "MSCHL3unfVqzsZbRVCJ3yVp7RgAmXiuGN3",
                        "previous_output": {
                            "hash": "667b80465094b8de303fa3bcc7d030f6a91222eda80b37e60284c1468360bd68",
                            "index": 0
                        },
                        "script": "[ 3045022100d4e31832ecd2483b3ae759c1b53a2078d862c4404208aa9b7a2cf4527ca3a456022066e414a747eaa0e58f1deb4f8f8f6c9485bf69e94ea7176f4074a10972c8cd2701 ] [ 02f040ce9c5ea4b558885a1bd3956bc8a8b4fb4bb9cd3c23d2166b70a89df78d3c ]",
                        "sequence": 4294967295,
                        "attachment": {
                            "symbol": "ETP",
                            "decimals": 8
                        },
                        "value": 2500000000000000
                    }],
                    "outputs": [{
                        "address": "MSCHL3unfVqzsZbRVCJ3yVp7RgAmXiuGN3",
                        "attachment": {
                            "type": "etp",
                            "symbol": "ETP",
                            "decimals": 8
                        },
                        "index": 1,
                        "locked_height_range": 0,
                        "script": "dup hash160 [ c8af4279229d03bdbda8a3640e9b10e156bf93b5 ] equalverify checksig",
                        "value": 2439999999990000
                    }],
                    "height": 647806
                }, {
                    "hash": "667b80465094b8de303fa3bcc7d030f6a91222eda80b37e60284c1468360bd68",
                    "inputs": [],
                    "outputs": [{
                        "address": "MSCHL3unfVqzsZbRVCJ3yVp7RgAmXiuGN3",
                        "attachment": {
                            "type": "etp",
                            "symbol": "ETP",
                            "decimals": 8
                        },
                        "index": 0,
                        "locked_height_range": 0,
                        "script": "dup hash160 [ c8af4279229d03bdbda8a3640e9b10e156bf93b5 ] equalverify checksig",
                        "value": 2500000000000000
                    }],
                    "height": 3611
                }]
            });
    });
});
