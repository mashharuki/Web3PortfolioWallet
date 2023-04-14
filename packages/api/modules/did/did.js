/**
 * DID modules
 */

const { anchor, DID, generateKeyPair } = require('@decentralized-identity/ion-tools');
const log4js = require('log4js');
log4js.configure('./log/log4js_setting.json');
const logger = log4js.getLogger("server");

/**
 * generateDID function
 */
const generateDID = async() => {
      
      let did;
      let response;

      try {
            // create key pair
            let authnKeys = await generateKeyPair();
            // new DID
            did = new DID({
                  content: {
                        publicKeys: [
                              {
                                    id: 'key-1',
                                    type: 'EcdsaSecp256k1VerificationKey2019',
                                    publicKeyJwk: authnKeys.publicJwk,
                                    purposes: [ 'authentication' ]
                              }
                        ],
                        services: [
                              {
                                    id: 'idq',
                                    type: 'LinkedDomains',
                                    serviceEndpoint: 'http://example/'
                              }
                        ]
                  }
            });

            // anchor DID
            const requestBody = await did.generateRequest();
            response = await anchor(requestBody);
      } catch (err) {
            logger.error("generate DID erro:", err);
      }

      return {
            response,
            did
      };
};

module.exports = {
      generateDID
}