require('dotenv/config');
const { ethers } = require('ethers');
const { KmsEthersSigner } = require('aws-kms-ethers-signer');
const log4js = require('log4js');
const { KEY_ID, REGION_ID } = require('../utils/constants');
log4js.configure('./log/log4js_setting.json');
const logger = log4js.getLogger("server");

// get Mnemonic code
const {
    MNEMONIC,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
} = process.env

/**
 * create KMS instarce
 */
const createKmsSigner = () => {
    // create singer object
    const signer = new KmsEthersSigner({
        keyId: KEY_ID,
        kmsClientConfig: {
            region: REGION_ID,
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY
            }
        },
    });

    return signer;
}

/**
 * create instance by local private key
 */
const createLocalSigner = () => {
    const signer = new ethers.Wallet.fromMnemonic(MNEMONIC);

    return signer;
}

/**
 * tx send method
 * @param abi 
 * @param address 
 * @param functionName 
 * @param args
 * @param rpc_url 
 * @param chainId 
 * @return result
 */
const sendTx = async(abi, address, functionName, args, rpc_url, chainId) => {
    // contract interface
    var contract = new ethers.utils.Interface(abi);
    // crate contract function data
    var func = contract.encodeFunctionData(functionName, args);
    // create wallet object
    var wallet = createLocalSigner();
    // create provider
    var provider = new ethers.providers.JsonRpcProvider(rpc_url);
    // conncet provider
    wallet.connect(provider);
    // get nonce
    var nonce = await provider.getTransactionCount(wallet.address);

    // create tx data
    var tx = {
        gasPrice: 500000000000,
        gasLimit: 900000,
        data: func,
        to: address,
        nonce: nonce,
        chainId: chainId,
    }
    // sign tx
    var signedTransaction = await wallet.signTransaction(tx).then(ethers.utils.serializeTransaction(tx));

    try {
        // send tx
        const res = await provider.sendTransaction(signedTransaction);
        logger.log("Tx send result:", res);
    } catch(e) {
        logger.error("Tx send error:", e);
        return false;
    }

    return true;
}

/**
 * batch tx send method
 * @param txs tx datas
 * @return result
 */
const sendBatchTx = async(txs) => {
    // logger.log("txs:", txs);
    // get tx count
    const count = txs.length;
    // Array for signedTx
    const signedTxs = [];

    for(var i = 0; i< count; i++) {
        // contract interface
        var contract = new ethers.utils.Interface(txs[i][0]);
        // crate contract function data
        var func = contract.encodeFunctionData(txs[i][2], txs[i][3]);
        // create wallet object
        var wallet = createLocalSigner();
        // create provider
        var provider = new ethers.providers.JsonRpcProvider(txs[i][4]);
        // conncet provider
        wallet.connect(provider);
        // get nonce
        var nonce = await provider.getTransactionCount(wallet.address) + i;
        // create tx data
        var tx = {
            gasPrice: 30000000000,
            gasLimit: 185000,
            data: func,
            to: txs[i][1],
            nonce: nonce,
            chainId: txs[i][5],
        }
        // sign tx
        var signedTransaction = await wallet.signTransaction(tx).then(ethers.utils.serializeTransaction(tx));
        logger.log("signedTransaction:", signedTransaction);
        // push
        signedTxs.push(signedTransaction);
    }

    // execute
    try {
        // send tx
        var res;
        
        for(var i = 0; i< count; i++) {
            res = await provider.sendTransaction(signedTxs[i]);
            logger.log("Tx send result:", res);
        }
    } catch(e) {
        logger.error("Tx send error:", e);
        return false;
    }

    return true;
};

/**
 * send eth method
 * @param to 
 * @param value 
 * @param rpc_url
 * @param chainId 
 * @return result
 */
const sendEth = async(to, value, rpc_url, chainId) => {
    // create wallet object
    var wallet = createLocalSigner();
    // create provider
    var provider = new ethers.providers.JsonRpcProvider(rpc_url);
    // conncet provider
    wallet.connect(provider);
    // get nonce
    var nonce = await provider.getTransactionCount(wallet.address);

    logger.log("send ETH amount:", ethers.utils.parseEther(value.toString())._hex);
   
    // create tx data
    var tx = {
        gasPrice: 250000000000,
        gasLimit: 185000,
        to: to,
        nonce: nonce,
        chainId: chainId,
        value: ethers.utils.parseEther(value.toString())._hex
    }
    // sign tx
    var signedTransaction = await wallet.signTransaction(tx).then(ethers.utils.serializeTransaction(tx));

    try {
        // send tx
        const res = await provider.sendTransaction(signedTransaction);
        logger.log("Tx send result:", res);
    } catch(e) {
        logger.error("Tx send error:", e);
        return false;
    }

    return true;
}


module.exports = { 
    createKmsSigner,
    createLocalSigner,
    sendTx,
    sendBatchTx, 
    sendEth 
};