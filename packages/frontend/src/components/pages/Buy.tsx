// mui関連のコンポーネントのインポート
import { AppBar, Toolbar, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { indigo } from "@mui/material/colors";
import { useState } from "react";
import superAgent from "superagent";
import { useMyContext } from "../../Contexts";
import Logo from "../../assets/imgs/Logo_v3.png";
import "./../../assets/css/App.css";
import {
      baseURL
} from "./../common/Constant";
//
import { useNavigate } from "react-router-dom";
import ActionButton2 from "../common/ActionButton2";
import LoadingIndicator from "../common/LoadingIndicator";
import PaymentDialog from '../common/PaymentDialog';

/**
 * Buy
 */
const Buy = (props:any) => {
  const {
    currentAccount,
  }: any = props;

  // create contract
  const {
    updateWidth,
  }: any = useMyContext();

  const [did, setDid] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [to, setTo] = useState(null);
  const [amount, setAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [didName, setDidName] = useState("foo");
  const [isLoading, setIsLoading] = useState(false);
  const [successFlg, setSuccessFlg] = useState(false);
  const [failFlg, setFailFlg] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  /**
   * Buy function 
   */
  const buyAction = async() => {
      setIsLoading(true);
      // call mint token API
      superAgent
            .post(baseURL + '/api/mintToken')
            .query({
                  to: currentAccount,
                  amount: amount
            })
            .end(async(err, res) => {
                  if (err) {
                        console.log("発行用API呼び出し中に失敗", err);
                        // popUpメソッドの呼び出し
                        popUp(false);
                        setIsLoading(false);
                        return err;
                  }
                  // popUpメソッドの呼び出し
                  popUp(true);
                  setIsLoading(false);   
            });
  };

      /**
       * Open Dialog
       * @param wallet MultoSig Wallet Addr
       */
      const handleOpen = () => {
            setOpen(true);
      }

      /**
       * Close Dialog
       */
      const handleClose = () => {
            setOpen(false);
      }


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
            Buy
          </Typography>
        </Toolbar>
      </AppBar>

      { /* Payment Dialog */ } 
      <PaymentDialog 
            open={open} 
            handleClose={(e:any) => {handleClose()}} 
            buyAction={(e:any) => {buyAction()}}
      />

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
             You can buy token
            </Typography>
            <TextField 
                  id="amount" 
                  placeholder="enter amount" 
                  margin="normal" 
                  required
                  onChange={ (e:any) => setAmount(e.target.value) } 
                  variant="outlined" 
                  inputProps={{ 'aria-label': 'amount' }} 
            />
            <ActionButton2 buttonName="buy" color="primary" clickAction={handleOpen} /> 
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
        </Stack>
      )}
    </>
  );
};

export default Buy;
