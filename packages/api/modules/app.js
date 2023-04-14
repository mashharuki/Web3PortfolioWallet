require('dotenv').config();
const express = require('express');
const app = express();
const log4js = require('log4js');
const { ethers } = require('ethers');
const ION = require('@decentralized-identity/ion-tools')

const {
  createLocalSigner,
  sendTx,
  sendBatchTx,
  sendEth
}= require('../contracts/UseContract');
// ABIs
const { DNSABI } = require('../contracts/ABI/DNSABI');
const { MyTokenABI } = require('../contracts/ABI/MyTokenABI');

// contract address
const contractAddr = require('../contracts/Address');
// get contants 
const {
  RPC_URL,
  CHAIN_ID
} = require('./../utils/constants');
const { generateDID } = require('./did/did');
const { uploadFileToIpfs } = require('./ipfs/ipfs');

// log4jsの設定
log4js.configure('./log/log4js_setting.json');
const logger = log4js.getLogger("server");

// get Mnemonic code
const {
  STRIPE_API_KEY
} = process.env

// stripe用の変数定義
const stripe = require("stripe")(`${STRIPE_API_KEY}`);
app.use(express.static("public"));
app.use(express.json());

////////////////////////////////////////////////////////////
// APIの定義
////////////////////////////////////////////////////////////

/**
 * Token mint API
 * @param to
 * @param amount 
 */
app.post('/api/mintToken', async(req, res) => {
  logger.log("発行用のAPI開始");

  var to = req.query.to;
  var amount = req.query.amount;

  // call send Tx function
  var result = await sendTx(
    MyTokenABI, 
    contractAddr.MYTOKEN_ADDRESS, 
    "mint", 
    [to, amount], 
    RPC_URL, 
    CHAIN_ID
  );
    
  if(result == true) {
      logger.debug("トランザクション送信成功");
      logger.log("発行用のAPI終了");
      res.set({ 'Access-Control-Allow-Origin': '*' });
      res.json({ result: 'success' });
  } else {
      logger.error("トランザクション送信失敗");
      logger.log("発行用のAPI終了");
      res.set({ 'Access-Control-Allow-Origin': '*' });
      res.json({ result: 'fail' });
  }
});
    
/**
 * Tokenを償却するAPI
 * @param to 償却アドレス
 * @param amount 償却量
 * @param walletAddr ウォレットアドレス
 */
app.post('/api/burnToken', async(req, res) => {
  logger.log("償却用のAPI開始")

  var to = req.query.to;
  var amount = req.query.amount;
  var walletAddr = req.query.walletAddr;

  // call send Tx function
  var result = await sendTx(
    MyTokenABI, 
    contractAddr.MYTOKEN_ADDRESS, 
    "burnToken", 
    [to, (amount/1000000000000000000)], 
    RPC_URL, 
    CHAIN_ID
  );
    
  if(result == true) {
    // send ETH 
    var result = await sendEth(
      walletAddr, 
      (amount/10000000000000000000000), 
      RPC_URL, 
      CHAIN_ID
    );

    logger.debug("トランザクション送信成功");
    logger.log("償却用のAPI終了")
    res.set({ 'Access-Control-Allow-Origin': '*' });
    res.json({ result: 'success' });
  } else {
    logger.error("トランザクション送信失敗");
    logger.log("償却用のAPI終了")
    res.set({ 'Access-Control-Allow-Origin': '*' });
    res.json({ result: 'fail' });
  }
});
    
/**
 * Tokenの残高を取得するAPI
 * @param addr 残高を取得するアドレス
 */
app.get('/api/balance/token', async(req, res) => {
  logger.log("残高取得用のAPI開始");

  var addr = req.query.addr;

  // create wallet 
  const wallet = createLocalSigner();
  // create provider
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  // create contract 
  var contract = new ethers.Contract(contractAddr.MYTOKEN_ADDRESS, MyTokenABI, await provider.getSigner(wallet.address));

  const balance = await contract.callStatic.balanceOf(addr);

  logger.log("残高取得用のAPI終了");
  res.set({ 'Access-Control-Allow-Origin': '*' });
  res.json({ balance: balance });
});
    
/**
 * Tokenを送金するAPI
 * @param from 送金元のDID
 * @param to 送金先のDID
 * @param amount 総金額
 */
app.post('/api/send', async(req, res) => {
  logger.log("token送金用のAPI開始");

  // get params
  var from = req.query.from;
  var to = req.query.to;
  var amount = req.query.amount;  
  // get wallet address
  logger.log("from:", from);
  logger.log("to:", to);
  logger.log("amount:", amount);

  /**
   * check function
   */
  const resultCheck = (result) => {
    if(result == true) {
      logger.debug("トランザクション送信成功");
      logger.log("token送金用のAPI終了")
      res.set({ 'Access-Control-Allow-Origin': '*' });
      res.json({ result: 'success' });
    } else {
      logger.error("トランザクション送信失敗");
      logger.log("token送金用のAPI終了");
      res.set({ 'Access-Control-Allow-Origin': '*' });
      res.json({ result: 'fail' });
    }
  }
      
  try {
    // create wallet 
    const wallet = createLocalSigner();
    // create provider
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    // get signer 
    const signer = await provider.getSigner(wallet.address)
    // create mytoken contract 
    var myTokenContract = new ethers.Contract(contractAddr.MYTOKEN_ADDRESS, MyTokenABI, signer);
    // create factory contract
    var factoryContract = new ethers.Contract(contractAddr.FACTORY_ADDRESS, FactoryABI, signer);
    // get address from did
    let fromAddr = await factoryContract.callStatic.addrs(from);
    let receiveAddr = await factoryContract.callStatic.addrs(to);
    // get addr from did
    const balance = await myTokenContract.callStatic.balanceOf(fromAddr);
  
    logger.log("fromAddr:", fromAddr);
    logger.log("receiveAddr:", receiveAddr);
    logger.log("送信元のbalance:", Number(balance._hex));
    
    // check balance
    if(Number(balance._hex) >= amount) {
      // 結果を格納するための変数
      var result;

      // Arrary for Tx 
      const txs = [];
      // create tx info
      var tx = [
        MyTokenABI, 
        contractAddr.MYTOKEN_ADDRESS, 
        "burnToken", 
        [fromAddr, amount],
        RPC_URL, 
        CHAIN_ID
      ];
      // push
      txs.push(tx);
      // create tx info
      tx = [
        MyTokenABI, 
        contractAddr.MYTOKEN_ADDRESS, 
        "mint", 
        [receiveAddr, amount], 
        RPC_URL, 
        CHAIN_ID
      ];
      // push
      txs.push(tx);

      // call sendBatchTxs function
      result = await sendBatchTx(txs).then((result) => resultCheck(result));
    } else {
      logger.error("トランザクション送信失敗");
      logger.error("残高不足");
      logger.log("token送金用のAPI終了");
      res.set({ 'Access-Control-Allow-Origin': '*' });
      res.json({ result: 'fail' });
    }
  } catch(err) {
    logger.error("トランザクション送信失敗");
    logger.error("エラー原因：", err);
    logger.log("token送金用のAPI終了");
    res.set({ 'Access-Control-Allow-Origin': '*' });
    res.json({ result: 'fail' });
  }
});
    
/**
 * DIDを作成するAPI
 * @param addr 登録するアドレス
 */
app.post('/api/create', async(req, res) => {
  logger.log("DID作成用のAPI開始");

  var addr = req.query.addr;

  // generate DID document
  let {
    response,
    did
  } = await generateDID();
  logger.log("response:", response);
  // upload to ipfs
  await uploadFileToIpfs(response, addr);
  
  // get DID URL
  const didUrl = await did.getURI('short');
  
  try {
    // set to Factory contract
    var result = await sendTx(
      FactoryABI, 
      contractAddr.FACTORY_ADDRESS, 
      "register", 
      [addr, didUrl], 
      RPC_URL, 
      CHAIN_ID
    );

    if(result == true) {
      logger.debug("トランザクション送信成功");
      logger.log("DID作成用のAPI終了")
      logger.log("DID:", didUrl);
      res.set({ 'Access-Control-Allow-Origin': '*' });
      res.json({ result: 'success' });
    } else {
      logger.error("トランザクション送信失敗");
      logger.log("DID作成用のAPI終了")
      res.set({ 'Access-Control-Allow-Origin': '*' });
      res.json({ result: 'fail' });
    }
  } catch(err) {
      logger.error("トランザクション送信失敗");
      logger.error("エラー詳細：", err);
      logger.log("DID作成用のAPI終了")
      res.set({ 'Access-Control-Allow-Origin': '*' });
      res.json({ result: 'fail' });
  }
});
    
    
/**
 * DIDドキュメントを検索するAPI
 */
app.get('/api/resolve', async(req, res) => {
  var uri = req.query.uri;
  // resolve
  const response = await ION.resolve(uri);
  logger.log("response:", response);

  res.set({ 'Access-Control-Allow-Origin': '*' });
  res.json({ result : response });
});
    

/**
 * stripe Payment element API
 */
app.post("/create-payment-intent", async (req, res) => {
  logger.debug("Payment API開始");

  // create paymentIntent 
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1400,
    currency: "jpy",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.set({ 'Access-Control-Allow-Origin': '*' });
  // send
  res.send({
    clientSecret: paymentIntent.client_secret,
  });

  logger.debug("Payment API終了");
});

/**
 * register VC API
 * @param did DID
 * @param name VC file name
 * @param cid CID情報
 */
app.post("/api/registerIpfs", async (req, res) => {
  logger.debug("Register Ipfs API開始");

  // 
  var did = req.query.did;
  var name = req.query.name;
  var cid = req.query.cid;
  
  // register to IPFS
  var result = await sendTx(
    FactoryABI,
    contractAddr.FACTORY_ADDRESS, 
    "updateVc", 
    [did, name, cid], 
    RPC_URL, 
    CHAIN_ID
  );

  if(result == true) {
    logger.debug("トランザクション送信成功");
    logger.log("Register Ipfs API終了")
    res.set({ 'Access-Control-Allow-Origin': '*' });
    res.json({ result: 'success' });
  } else {
    logger.error("トランザクション送信失敗");
    logger.log("Register Ipfs API終了")
    res.set({ 'Access-Control-Allow-Origin': '*' });
    res.json({ result: 'fail' });
  }
});

module.exports = {
  app,
  logger
};