const Request = require("superagent"),
 helper = require("../helper.js");

function get(url, parameters) {
    return new Promise((resolve, reject) => {
        return Request.get(url)
            .send()
            .set('accept', 'json')
            .end((err, response) => {
                try {
                    response = JSON.parse(response.text);
                } catch (e) {}
                if (err) {
                    reject(Error(err.message));
                } else if (response.error != undefined)
                    reject({
                        name: response.error.code,
                        message: response.error.message
                    });
                else {
                    resolve(response.result);
                }
            });
    });
}

let REMOTE = null;

module.exports = (url) => {
    if (url)
        REMOTE = url;
    else
        REMOTE = 'https://explorer.mvs.org/api/';
    return {
        height: getHeight,
        transaction: {
            get: getTx,
            list: listTxs
        },
        block: {
            get: getBlock,
            list: listBlocks
        },
        address: {
            txs: listAddressTxs,
            utxo: listAddressUtxo
        },
        addresses: {
            txs: listAllAddressesTxs,
            utxo: listAddressesUtxo
        },
        asset: {
            get: getAsset,
            list: listAssets
        },
        balance:{
            all: helper.balances.all,
            addresses: helper.balances.addresses
        }
    };
};

function getHeight() {
    return get(`${REMOTE}height`);
}

function getTx(hash) {
    return get(`${REMOTE}tx/${hash}`);
}

function listTxs(page = 0, items_per_page = 10) {
    return get(`${REMOTE}txs?page=${page}`);
}

function getBlock(hash) {
    return get(`${REMOTE}block/${hash}`);
}

function listBlocks(page) {
    return get(`${REMOTE}blocks/${page}`);
}

function getAsset(symbol) {
    return get(`${REMOTE}asset/${symbol}`)
        .then((result) => result[0]);
}

function listAssets() {
    return get(`${REMOTE}assets`);
}

function listAddressTxs(address, page = 0, items_per_page = 10) {
    return get(`${REMOTE}address/txs/${address}?page=${page}&items_per_page=${items_per_page}`);
}

function listAllAddressesTxs(addresses) {
    let url = `${REMOTE}addresses/txs?addresses=`+addresses.join('&addresses=');
    return get(url);
}

function listAddressUtxo(address) {
    return listAddressTxs(address,0,0)
        .then((txs) => calculateUtxo(txs, [address]));
}

function listAddressesUtxo(addresses) {
    return listAllAddressesTxs(addresses)
        .then((txs) => calculateUtxo(txs, addresses));
}

function calculateUtxo(txs, addresses) {
    return new Promise((resolve) => {
        let candidates = {};
        for (let i = txs.transactions.length - 1; i >= 0; i--) {
            //Search received outputs
            txs.transactions[i].outputs.forEach((output) => {
                if (addresses.indexOf(output.address) !== -1) {
                    output.locked_until = (output.locked_height_range) ? txs.transactions[i].height + output.locked_height_range : 0;
                    delete output['locked_height_range'];
                    output.hash = txs.transactions[i].hash;
                    candidates[txs.transactions[i].hash + '-' + output.index] = output;
                }
            });
            //Remove spent outputs if matching input is found
            txs.transactions[i].inputs.forEach((input) => {
                if (addresses.indexOf(input.address) !== -1) {
                    if (candidates[input.previous_output.hash + '-' + input.previous_output.index]) {
                        delete candidates[input.previous_output.hash + '-' + input.previous_output.index];
                    } else throw Error('Found input without matching output');
                }
            });
        }
        resolve(Object.values(candidates));
    });
}
