/**
 * web3 & Contarct hook modules
 */
import BloctoSDK from '@blocto/sdk';
import Web3 from 'web3';
import DNS from '../../contracts/DNS.json';
import MyToken from '../../contracts/MyToken.json';
import { CHAIN_ID, DNS_ADDRESS, MYTOKEN_ADDRESS, RPC_URL } from "../common/Constant";

/**
 * getProvider メソッド
 */
export const getProvider = () => {
      // get provider
      const provider = new Web3(RPC_URL);
      return provider;
};

/**
 * createContractObject メソッド
 * @param contractAbi コントラクトABI
 * @param contractAddress コントラクトアドレス
 */
const createContractObject = ( contractAbi:any, contractAddress: string) => {
      // get provider
      const provider = getProvider();
      // create Contract Object
      const ContractObject = new provider.eth.Contract(contractAbi, contractAddress);
      return ContractObject;
};

/**
 * connectWallet メソッド
 */
export const connectWallet = async() => {
      // create bloctoSDK object
      const bloctoSDK = new BloctoSDK({
            ethereum: {
                chainId: CHAIN_ID, 
                rpc: RPC_URL,
            }
      });
      // request
      const signers = await bloctoSDK.ethereum?.request({ method: 'eth_requestAccounts' });
      const signer = signers[0]

      return {
            bloctoSDK,
            signer
      };
};

/**
 * getDid method
 * @param signer ログイン中のsignerオブジェクト
 */
export const getDid = async(signer:any) => {
      // call createContractObject
      const FactoryContract = createContractObject(DNS.abi, DNS_ADDRESS);
      // get did info
      const result = await FactoryContract.methods.dids(signer).call();
      return result;
};

/**
 * getTokenBalanceOf メソッド
 * @param signer ログイン中のsignerオブジェクト
 */
export const getTokenBalanceOf = async(signer:any) => {
      // call createContractObject メソッド
      const MyTokenContract = await createContractObject(MyToken.abi, MYTOKEN_ADDRESS);
      // get token balance
      const num = await MyTokenContract.methods.balanceOf(signer).call();
      return num;
};

/**
 * getRegisterStatusメソッド
 * @param signer ログイン中のsignerオブジェクト
 */
export const getRegisterStatus = async(signer:any) => {
      // call createContractObject メソッド
      const FactoryContract = createContractObject(DNS.abi, DNS_ADDRESS);
      // get status info
      var status = await FactoryContract.methods.isRegistered(signer).call();
      return status;
};

/**
 * getVcsメソッド
 * @param did ログイン中のdid情報
 */
export const getVcs = async(did:any) => {
      // call createContractObject メソッド
      const FactoryContract = createContractObject(DNS.abi, DNS_ADDRESS);
      // get Verifiable Credentials info
      var vcs = await FactoryContract.methods.getVcs(did).call();
      return vcs;
};




