const Metaverse = require('metaversejs');

module.exports = {
    balances: {
        all: {
            from_tx: calculateBalances,
            from_utxo: calculateBalancesFromUtxo
        },
        addresses: {
            from_tx: calculateAddressesBalances,
            from_utxo: calculateAddressesBalancesFromUtxo
        }
    },
    avatar: {
        extract: extractAvatars
    }
};

function extractAvatars(outputs) {
    return new Promise(resolve => {
        let avatars = [];
        outputs.forEach((output) => {
            if (output.attachment.type == 'did-issue') avatars.push({
                symbol: output.attachment.symbol,
                address: output.attachment.address
            });
        });
        resolve(avatars);
    });
}

function calculateBalances(transactions, addresses, height, init) {
    if (init == undefined) init = {
        ETP: {
            available: 0,
            frozen: 0,
            decimals: 8
        },
        MST: {}
    };
    return transactions.reduce((acc, tx) => {
        tx.inputs.forEach((input) => {
            if (addresses.indexOf(input.address) !== -1) {
                if (input.attachment && input.attachment.symbol && input.attachment.quantity) {
                    if (acc['MST'][input.attachment.symbol] == undefined)
                        acc['MST'][input.attachment.symbol] = {
                            available: 0,
                            frozen: 0,
                            decimals: input.attachment.decimals
                        };
                    acc['MST'][input.attachment.symbol].available -= input.attachment.quantity;
                }
                if (input.value) {
                    acc['ETP'].available -= input.value;
                }
            }
        });
        tx.outputs.forEach((output) => {
            if (addresses.indexOf(output.address) !== -1) {
                if (output.attachment && (output.attachment.type == 'asset-transfer' || output.attachment.type == 'asset-issue')) {
                    if (acc['MST'][output.attachment.symbol] == undefined)
                        acc['MST'][output.attachment.symbol] = {
                            available: 0,
                            frozen: 0,
                            decimals: output.attachment.decimals
                        };
                    let available = Metaverse.output.assetSpendable(output, tx.height, height);
                    acc['MST'][output.attachment.symbol].available += available;
                    acc['MST'][output.attachment.symbol].frozen += output.attachment.quantity - available;
                }
                if (output.value) {
                    if (output.locked_height_range && output.locked_height_range + tx.height > height)
                        acc['ETP'].frozen += output.value;
                    else
                        acc['ETP'].available += output.value;
                }
            }
        });
        return acc;
    }, init);
}

function calculateAddressesBalances(transactions, addresses, height, init) {
    if (init == undefined) init = {};
    return transactions.reduce((acc, tx) => {
        tx.inputs.forEach((input) => {
            if (acc[input.address] == undefined)
                acc[input.address] = {
                    MST: {},
                    ETP: {
                        available: 0,
                        frozen: 0,
                        decimals: 8
                    }
                };
            if (addresses.indexOf(input.address) !== -1) {
                if (input.attachment && input.attachment.symbol && input.attachment.quantity) {
                    if (acc[input.address]['MST'][input.attachment.symbol] == undefined)
                        acc[input.address]['MST'][input.attachment.symbol] = {
                            available: 0,
                            frozen: 0,
                            decimals: input.attachment.decimals
                        };
                    acc[input.address]['MST'][input.attachment.symbol].available -= input.attachment.quantity;
                }
                if (input.value) {
                    acc[input.address]['ETP'].available -= input.value;
                }
            }
        });
        tx.outputs.forEach((output) => {
            if (acc[output.address] == undefined)
                acc[output.address] = {
                    MST: {},
                    ETP: {
                        available: 0,
                        frozen: 0,
                        decimals: 8
                    }
                };
            if (addresses.indexOf(output.address) !== -1) {
                if (output.attachment && (output.attachment.type == 'asset-transfer' || output.attachment.type == 'asset-issue')) {
                    if (acc[output.address]['MST'][output.attachment.symbol] == undefined)
                        acc[output.address]['MST'][output.attachment.symbol] = {
                            available: 0,
                            frozen: 0,
                            decimals: output.attachment.decimals
                        };
                    let available = Metaverse.output.assetSpendable(output, tx.height, height);
                    acc[output.address]['MST'][output.attachment.symbol].available += available;
                    acc[output.address]['MST'][output.attachment.symbol].available += output.attachment.quantity - available;
                }
                if (output.value) {
                    if (output.locked_height_range && output.locked_height_range + tx.height > height)
                        acc[output.address]['ETP'].frozen += output.value;
                    else
                        acc[output.address]['ETP'].available += output.value;
                }
            }
        });
        return acc;
    }, init);
}

function calculateBalancesFromUtxo(utxo, addresses, height, init) {
    if (init == undefined) init = {
        ETP: {
            available: 0,
            frozen: 0,
            decimals: 8
        },
        MST: {}
    };
    return utxo.reduce((acc, output) => {
        if (addresses.indexOf(output.address) !== -1) {
            if (output.attachment && (output.attachment.type == 'asset-transfer' || output.attachment.type == 'asset-issue')) {
                if (acc['MST'][output.attachment.symbol] == undefined)
                    acc['MST'][output.attachment.symbol] = {
                        available: 0,
                        frozen: 0,
                        decimals: output.attachment.decimals
                    };
                let available = Metaverse.output.assetSpendable(output, output.height, height);
                acc['MST'][output.attachment.symbol].available += available;
                acc['MST'][output.attachment.symbol].frozen += output.attachment.quantity - available;
            }
            if (output.value) {
                if (output.locked_height_range && output.locked_height_range + output.height > height)
                    acc['ETP'].frozen += output.value;
                else
                    acc['ETP'].available += output.value;
            }
        }
        return acc;
    }, init);
}

function calculateAddressesBalancesFromUtxo(utxo, addresses, height, init) {
    if (init == undefined) init = {};
    return utxo.reduce((acc, output) => {
        if (acc[output.address] == undefined)
            acc[output.address] = {
                MST: {},
                ETP: {
                    available: 0,
                    frozen: 0,
                    decimals: 8
                }
            };
        if (addresses.indexOf(output.address) !== -1) {
            if (output.attachment && (output.attachment.type == 'asset-transfer' || output.attachment.type == 'asset-issue')) {
                if (acc[output.address]['MST'][output.attachment.symbol] == undefined)
                    acc[output.address]['MST'][output.attachment.symbol] = {
                        available: 0,
                        frozen: 0,
                        decimals: output.attachment.decimals
                    };
                let available = Metaverse.output.assetSpendable(output, output.height, height);
                acc[output.address]['MST'][output.attachment.symbol].available += available;
                acc[output.address]['MST'][output.attachment.symbol].frozen += output.attachment.quantity - available;
            }
            if (output.value) {
                if (output.locked_height_range && output.locked_height_range + output.height > height)
                    acc[output.address]['ETP'].frozen += output.value;
                else
                    acc[output.address]['ETP'].available += output.value;
            }
        }
        return acc;
    }, init);
}
