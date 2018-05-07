module.exports = {
    balances: {
        all: calculateBalances,
        addresses: calculateAddressesBalances
    }
};

function calculateBalances(transactions, addresses, height, init) {
    if(init==undefined) init={};
    return transactions.reduce((acc, tx) => {
        tx.inputs.forEach((input) => {
            if (addresses.indexOf(input.address) !== -1) {
                if (input.attachment && input.attachment.symbol && input.attachment.quantity) {
                    if (acc[input.attachment.symbol] == undefined)
                        acc[input.attachment.symbol] = {
                            available: 0,
                            frozen: 0
                        };
                    acc[input.attachment.symbol].available -= input.attachment.quantity;
                }
                if (input.value) {
                    if (acc['ETP'] == undefined)
                        acc['ETP'] = {
                            available: 0,
                            frozen: 0
                        };
                }
                acc['ETP'].available -= input.value;
            }
        });
        tx.outputs.forEach((output) => {
            if (addresses.indexOf(output.address) !== -1) {
                if (output.attachment && output.attachment.type == 'asset-transfer') {
                    if (acc[output.attachment.symbol] == undefined)
                        acc[output.attachment.symbol] = {
                            available: 0,
                            frozen: 0
                        };
                    acc[output.attachment.symbol].available += output.attachment.quantity;
                }
                if (output.value) {
                    if (acc['ETP'] == undefined)
                        acc['ETP'] = {
                            available: 0,
                            frozen: 0
                        };
                    if (output.locked_height_range + tx.height < height)
                        acc['ETP'].available += output.value;
                    else
                        acc['ETP'].frozen += output.value;
                }
            }
        });
        return acc;
    }, init);
}

function calculateAddressesBalances(transactions, addresses, height, init) {
    if(init==undefined) init={};
    return transactions.reduce((acc, tx) => {
        tx.inputs.forEach((input) => {
            if (acc[input.address] == undefined)
                acc[input.address] = {};
            if (addresses.indexOf(input.address) !== -1) {
                if (input.attachment && input.attachment.symbol && input.attachment.quantity) {
                    if (acc[input.address][input.attachment.symbol] == undefined)
                        acc[input.address][input.attachment.symbol] = {
                            available: 0,
                            frozen: 0
                        };
                    acc[input.address][input.attachment.symbol].available -= input.attachment.quantity;
                }
                if (input.value) {
                    if (acc[input.address]['ETP'] == undefined)
                        acc[input.address]['ETP'] = {
                            available: 0,
                            frozen: 0
                        };
                }
                acc[input.address]['ETP'].available -= input.value;
            }
        });
        tx.outputs.forEach((output) => {
            if (acc[output.address] == undefined)
                acc[output.address] = {};
            if (addresses.indexOf(output.address) !== -1) {
                if (output.attachment && output.attachment.type == 'asset-transfer') {
                    if (acc[output.address][output.attachment.symbol] == undefined)
                        acc[output.address][output.attachment.symbol] = {
                            available: 0,
                            frozen: 0
                        };
                    acc[output.address][output.attachment.symbol].available += output.attachment.quantity;
                }
                if (output.value) {
                    if (acc[output.address]['ETP'] == undefined)
                        acc[output.address]['ETP'] = {
                            available: 0,
                            frozen: 0
                        };
                    if (output.locked_height_range + tx.height < height)
                        acc[output.address]['ETP'].available += output.value;
                    else
                        acc[output.address]['ETP'].frozen += output.value;
                }
            }
        });
        return acc;
    }, init);
}
