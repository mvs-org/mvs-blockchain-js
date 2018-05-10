const Request = require("superagent"),
 helper = require("../helper.js");

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
            list: listTxs,
            broadcast: broadcastTx
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

function broadcastTx(tx){
    return post(`${REMOTE}tx`,{tx:tx});
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

function listAddressTxs(address, options) {
    return listAllAddressesTxs([address],options);
}

function listAllAddressesTxs(addresses, options = {}) {
    let url = `${REMOTE}addresses/txs?addresses=`+addresses.join('&addresses=');
    if(options.max_height)
        url+='&max_height='+options.max_height;
    if(options.min_height)
        url+='&min_height='+options.min_height;
    if(options.max_time)
        url+='&max_time='+options.max_time;
    if(options.min_time)
        url+='&min_time='+options.min_time;
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

function post(url, data) {
    return new Promise((resolve, reject) => {
        return Request.post(url)
            .send(data)
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
