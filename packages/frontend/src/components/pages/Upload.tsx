// mui関連のコンポーネントのインポート
import { AppBar, Toolbar, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { indigo } from "@mui/material/colors";
import { useState } from "react";
import superAgent from "superagent";
import { useMyContext } from "../../Contexts";
import Logo from "../../assets/imgs/Logo_v3.png";
import "./../../assets/css/App.css";
import {
  PINTABaseURL,
  baseURL
} from "./../common/Constant";
//
import axios from 'axios';
import FormData from 'form-data';
import { MuiFileInput } from 'mui-file-input';
import { useNavigate } from "react-router-dom";
import ActionButton2 from "../common/ActionButton2";
import LoadingIndicator from "../common/LoadingIndicator";
import { getDid } from './../hooks/UseContract';

const {
      REACT_APP_PINATA_API_KEY,
      REACT_APP_PINATA_API_SECRET
} = process.env;
  

/**
 * Buy
 */
const Buy = (props:any) => {
  const {
    currentAccount,
    fullDid
  }: any = props;

  // create contract
  const {
    updateWidth,
  }: any = useMyContext();

  const [isLoading, setIsLoading] = useState(false);
  const [successFlg, setSuccessFlg] = useState(false);
  const [failFlg, setFailFlg] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [file, setFile] = useState<any>({});
  const [fileName, setFileName] = useState('blockcert json file');
  const [pendingFlg, setPendingFlg] = useState(false);

  const navigate = useNavigate();



      /**
       * upload VC file
       * @param {*} e event
       */
      const upload = async () => {
            setIsLoading(true)
            // FormDataオブジェクトを生成
            let postData: any = new FormData();
            // APIを使って送信するリクエストパラメータを作成する。
            postData.append('file', file);
            postData.append('pinataOptions', '{"cidVersion": 1}');
            postData.append('pinataMetadata', `{"name": "${fileName}", "keyvalues": {"company": "vc"}}`);
            // get did
            var did = await getDid(currentAccount);
            
            try {
                  // フラグ ON
                  setPendingFlg(true);
                  // POSTメソッドでデータを送信する
                  await axios.post(
                        // APIのURL
                        PINTABaseURL + '/pinning/pinFileToIPFS',
                        // リクエストパラメータ
                        postData,
                        // ヘッダー情報
                        {
                              headers: {
                                    'Content-Type': `multipart/form-data; boundary=${postData._boundary}`,
                                    'pinata_api_key': `${REACT_APP_PINATA_API_KEY}`,
                                    'pinata_secret_api_key': `${REACT_APP_PINATA_API_SECRET}`,
                              },
                        }
                  ).then(function(res:any) {
                        // CIDを取得
                        console.log("CID:", res.data.IpfsHash);
                        // VCのCID情報をIPFSに登録するAPIを呼び出す
                        superAgent
                          .post(baseURL + '/api/updateVc')
                          .query({
                                did: fullDid,
                                name: fileName,
                                cid: res.data.IpfsHash
                          })
                          .end(async(err, res) => {
                            if (err) {
                              console.log("VCのCID情報をIPFSに登録するAPI呼び出し中に失敗", err);
                              // popUpメソッドの呼び出し
                              popUp(false);
                              // フラグ OFF
                              setPendingFlg(false);
                              setIsLoading(false);
                              return err;
                            }
                            console.log(res);
                            // フラグ OFF
                            setPendingFlg(false);
                            // CIDを出力
                            popUp(true);
                            setIsLoading(false);
                          });
                  });
            } catch (e) {
                  // フラグ OFF
                  setPendingFlg(false);
                  console.error("upload failfull.....：", e);
                  popUp(false);
                  setIsLoading(false)
                  alert("upload failfull.....");
            }
      };

      /**
       * Fileオブジェクトを登録する関数
       * @param {*} newFile 
       */
      const handleChangeFile = (newFile:any) => {
            setFile(newFile);
            setFileName(newFile.name)
      };



  /**
   * popUp
   * @param flg true: success false：fail
   */
  const popUp = (flg: any) => {
    if(flg === true) {
      // ステート変数を更新する。
      setSuccessFlg(true);
      setShowToast(true);       
      // 5秒後に非表示にする。
      setTimeout(() => {
          setSuccessFlg(false);
          setShowToast(false);             
      }, 5000);
    } else {
      // ステート変数を更新する。
      setFailFlg(true);
      setShowToast(true);     
      // 5秒後に非表示にする。
      setTimeout(() => {
          setFailFlg(false);
          setShowToast(false);
      }, 5000);
    }
  };

  const returnAction = () => {
      navigate("/home2");
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "primary.main" }}>
        <Toolbar sx={{ paddingLeft: "4px" }}>
          <Box
            display="flex"
            alignItems="center"
            sx={{ paddingTop: "8px", paddingBottom: "8px" }}
          >
            <img src={Logo} alt="Web3 Portfolio Walet - Logo" />
          </Box>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Upload
          </Typography>
        </Toolbar>
      </AppBar>

      {isLoading ? (
        <Grid container justifyContent="center">
          <div className="loading">
            <p><LoadingIndicator/></p>
            <h3>Please Wait・・・・</h3>
          </div>
        </Grid>
      ) :(
        <Stack
          spacing={4}
          alignContent={"center"}
          alignItems={"center"}
          sx={{
            paddingTop: "32pt",
            backgroundColor: indigo[100],
            height: "100vh",
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "8pt",
              padding: "16pt",
              width: "200pt",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                marginBottom: "16pt",
              }}
            >
             You can upload your VC
            </Typography>
            <div className="file-ui">
                  <MuiFileInput 
                        value={file} 
                        placeholder="Please select your file"
                        onChange={handleChangeFile} 
                        variant="outlined" 
                  />
            </div>
            <ActionButton2 
                  buttonName="upload" 
                  color="primary" 
                  clickAction={upload} 
            /> 
          </Box>
          <Box>
            <Button
              variant="contained"
              onClick={returnAction}
              sx={{
                borderRadius: "8px",
              }}
            >
              return to home
            </Button>
          </Box>
          {successFlg && (
            /* 成功時のポップアップ */
            <div id="toast" className={showToast ? "zero-show" : ""}>
              <div id="secdesc">Trasaction Successfull!!</div>
            </div>
          )}
          {failFlg && (
            /* 失敗時のポップアップ */
            <div id="toast" className={showToast ? "zero-show" : ""}>
              <div id="desc">Trasaction failfull..</div>
            </div>
          )}
        </Stack>
      )}
    </>
  );
};

export default Buy;
