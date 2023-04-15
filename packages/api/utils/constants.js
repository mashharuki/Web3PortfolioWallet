// chain ID
const CHAIN_ID = 43113;
// RPC URL
const RPC_URL = `https://ava-testnet.public.blastapi.io/ext/bc/C/rpc`;

const ISSUER_DID = 'https://blockcerts-20230113.storage.googleapis.com/profile.json';
const CONTROLLER = 'did:web:blockcerts-20230113.storage.googleapis.com';

// AWS info
const REGION_ID = "ap-northeast-1";
const KEY_ID = "5abbc69c-39a9-48f6-98b2-066d9c798247";

/**
 * VC Template
 */
const TEMPLATE_VC = {
      '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://w3id.org/blockcerts/v3',
      ],
      type: ['VerifiableCredential', 'BlockcertsCredential'],
      credentialSubject: {
            id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
      },
};

/**
 * Profile document Template
 */
const TEMPLATE_PROFILE = {
      '@context': [
            'https://w3id.org/openbadges/v2',
            'https://w3id.org/blockcerts/v3'
      ],
      type: 'Profile',
}

/**
 * DID document template
 * id, service, verificationMethod
 */
const TEMPLATE_DID = {
      '@context': ['https://www.w3.org/ns/did/v1'],
}

// folder path
const FOLDER_PATH = 'data';

module.exports = {
      RPC_URL,
      CHAIN_ID,
      ISSUER_DID,
      CONTROLLER,
      TEMPLATE_VC,
      TEMPLATE_PROFILE,
      TEMPLATE_DID,
      FOLDER_PATH,
      REGION_ID,
      KEY_ID,
};