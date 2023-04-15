// mui関連のコンポーネントのインポート
import { AppBar, Toolbar, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { indigo } from "@mui/material/colors";
import { useEffect, useState } from "react";
import superAgent from "superagent";
import { useMyContext } from "../../Contexts";
import Logo from "../../assets/imgs/Logo_v3.png";
import {
  getDid,
  getRegisterStatus
} from "../hooks/UseContract";
import "./../../assets/css/App.css";
import {
  baseURL
} from "./../common/Constant";
//
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../common/LoadingIndicator";

/**
 * Homeコンポーネント
 */
const Home1 = (props:any) => {
  const {
    currentAccount,
    fullDid,
    setFullDid
  }: any = props;

  // create contract
  const {
    updateWidth,
  }: any = useMyContext();

  const [balance, setBalance] = useState(0);
  const [did, setDid] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [to, setTo] = useState(null);
  const [amount, setAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [didName, setDidName] = useState("foo");
  const [isLoading, setIsLoading] = useState(false);
  const [successFlg, setSuccessFlg] = useState(false);
  const [failFlg, setFailFlg] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  /**
   * Register function
   */
  const registerAction = async () => {
    setIsLoading(true);
    // call DID creation API
    superAgent
      .post(baseURL + "/api/create")
      .query({
        addr: currentAccount,
        name: didName,
      })
      .end(async (err, res) => {
        if (err) {
          console.log("fail: during call DID creation API", err);
          // call popUp method
          popUp(false);
          //setIsLogined(false);
          setIsLoading(false);
          return err;
        }

        // get DID
        const result = await getDid(currentAccount);
        var modStr = result.substr(0, 9) + "..." + result.substr(result.length - 3, 3);

        setDid(modStr);
        setFullDid(result);
        console.log("result of DID call API: ", result);

        // call Token mint API
        superAgent
          .post(baseURL + "/api/mintToken")
          .query({
            to: currentAccount,
            amount: 10000,
          })
          .end(async (err, res) => {
            if (err) {
              console.log("fail: during call Token mint API", err);
              // call popUp method
              popUp(false);
              setIsLoading(false);
              return err;
            }
          });

        // call popUp method
        popUp(true);
        await checkStatus();
        setIsLoading(false);
        // transition to Home2 after registering DID
        navigate("/home2");
      });
  };

  /**
   * checkStatus function
   */
  const checkStatus = async () => {
    // check registerd status
    var status = await getRegisterStatus(currentAccount);
    console.log("isRegistered:", isRegistered);
    setIsRegistered(status);

    if (status) {
      // get DID
      const didData = await getDid(currentAccount);
      console.log("didData :", didData);
      // short
      var modStr =
        didData.substr(0, 9) + "..." + didData.substr(didData.length - 3, 3);
      setDid(modStr);
      setFullDid(didData);
      navigate("/home2");
    }
  };

  const handleChange = (event: any) => {
    setDidName(event.target.value);
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

  useEffect(() => {
    checkStatus();

    window.addEventListener(`resize`, updateWidth, {
      capture: false,
      passive: true,
    });

    return () => window.removeEventListener(`resize`, updateWidth);
  }, []);

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
            Register DID
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
              Your Account &amp; Wallet is <br /> Successfully Created
            </Typography>
            <Typography variant="body1">
              Don't worry about your private key!
              <br /> I control it safely.
            </Typography>
          </Box>
          <Box>
            <TextField
              required
              id="filled-required"
              label="Your Identity (DID) name"
              value={didName}
              onChange={handleChange}
              variant="filled"
              sx={{
                backgroundColor: "white",
                borderRadius: "8pt",
              }}
            />
          </Box>
          <Box>
            <Button
              variant="contained"
              onClick={registerAction}
              sx={{
                borderRadius: "8px",
              }}
            >
              Register Your Identity
            </Button>
          </Box>
        </Stack>
      )}
    </>
  );
};

export default Home1;
