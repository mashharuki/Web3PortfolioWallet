/**
 * IPFS modules
 */

const {
      PINATA_API_KEY,
      PINATA_API_SECRET
} = process.env;

// get contants 
const {
      FOLDER_PATH
} = require('./../../utils/constants');

const log4js = require('log4js');
// log4jsの設定
log4js.configure('./log/log4js_setting.json');
const logger = log4js.getLogger("server");
const fs = require('fs');
const pinataSDK = require('@pinata/sdk');

// create PinataSDK object
const pinata = new pinataSDK({ 
      pinataApiKey:  PINATA_API_KEY, 
      pinataSecretApiKey: PINATA_API_SECRET
});

// option
const options = {
      pinataMetadata: {
          name: 'Wallet',
          keyvalues: {
              productName: 'Wallet',
          }
      },
      pinataOptions: {
          cidVersion: 0
      }
};

/**
 *upload json file
 * @param data DID document
 */
const uploadJsonToIpfs = async(data) => {
      // upload
      pinata.pinJSONToIPFS(data, options).then((result) => {
            logger.log("pinJSONToIPFS result:", result);
            return result;
      }).catch((err) => {        
            logger.error("pinJSONToIPFS result:", err);
            return err;
      });
};

/**
 * upload file to IPFS
 * @param data DID document
 * @param addr wallet address
 */
const uploadFileToIpfs = async(data, addr) => {
      try {
            fs.writeFileSync(`${FOLDER_PATH}/${addr}.json`, data, 'utf-8');
            const readableStreamForFile = fs.createReadStream(`${FOLDER_PATH}/${addr}.json`);
            // upload
            await pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
                   //handle error here
                  logger.log("uploadFileToIpfs result:", result);
            }).catch((err) => {
                  //handle error here
                  logger.error("uploadFileToIpfs result:", err);
            });
      } catch (err) {
            logger.error("uploadFileToIpfs result:", err);
      }

};

module.exports = {
      uploadJsonToIpfs,
      uploadFileToIpfs
};
