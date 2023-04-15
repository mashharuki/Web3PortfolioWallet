// mui関連のコンポーネントのインポート
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { indigo } from "@mui/material/colors";
import { AppBar, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import superAgent from "superagent";
import ActionButton2 from "../common/ActionButton2";
import LoadingIndicator from "../common/LoadingIndicator";
import SendDialog from "../common/SendDialog";
import "./../../assets/css/App.css";
import { useMyContext } from "./../../Contexts";
import { baseURL } from "../common/Constant";
//import GroupButtons from "../common/GroupButtons";
import MainContainer from "./../common/MainContainer";
import QrCodeDialog from "./../common/QrCodeDialog";
import QrCodeReader from "./../common/QrCodeReader";
import {
  getDid,
  getRegisterStatus,
  getTokenBalanceOf,
} from "../hooks/UseContract";
import Logo from "../../assets/imgs/Logo_v3.png";
import LogoS from "../../assets/imgs/LogoSmall_v3.png";
//
import { useNavigate } from "react-router-dom";

/**
 * StyledPaperコンポーネント
 */
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: 400,
  //minHeight: 200,
  //backgroundColor: "rgb(150, 144, 144)",
}));

/**
 * Homeコンポーネント
 */
const Home1 = (props) => {
  // create contract
  const {
    currentAccount,
    updateWidth,
    width,
    setWidth,
    fullDid,
    setFullDid,
    isOpenQRCamera,
    setIsOpenQRCamera,
    setQrResult,
    clickOpenQrReader,
    successFlg,
    failFlg,
    showToast,
    isLoading,
    setIsLoading,
    popUp,
  } = useMyContext();

  const [balance, setBalance] = useState(0);
  const [did, setDid] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [to, setTo] = useState(null);
  const [amount, setAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

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
          popUp(false, "failfull...");
          //setIsLogined(false);
          setIsLoading(false);
          return err;
        }

        // get DID
        const result = await getDid(currentAccount);
        var modStr =
          result.substr(0, 9) + "..." + result.substr(result.length - 3, 3);

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
              popUp(false, "failfull...");
              setIsLoading(false);
              return err;
            }
          });

        // call popUp method
        popUp(true, "successfull!!");
        await checkStatus();
        setIsLoading(false);
      });
    // transition to Home2 after registering DID
    navigate("/home2");
  };

  /**
   * send function
   */
  const sendAction = async (to, amount) => {
    setIsLoading(true);

    // call Token send API
    superAgent
      .post(baseURL + "/api/send")
      .query({
        from: fullDid,
        to: to,
        amount: amount,
      })
      .end(async (err, res) => {
        if (err) {
          console.log("fail: during call Token send API", err);
          // call popUp method
          popUp(false, "failfull...");
          setIsLoading(false);
          return err;
        }
        await getBalance();
        setIsLoading(false);
        // call popUp method
        popUp(true, "successfull!!");
      });
  };

  /**
   * Open Dialog
   * @param wallet MultoSig Wallet Addr
   */
  const handleOpen = (wallet) => {
    setOpen(true);
  };

  /**
   * Close Dialog
   */
  const handleClose = () => {
    setOpen(false);
  };

  /**
   * Open Dialog
   * @param wallet MultoSig Wallet Addr
   */
  const handleQrOpen = (wallet) => {
    setQrOpen(true);
  };

  /**
   * Close Dialog
   */
  const handleQrClose = () => {
    setQrOpen(false);
  };

  /**
   * copy DID via clipboard
   */
  const copy = () => {
    // copy
    navigator.clipboard.writeText(fullDid).then(
      function() {
        console.log("Async: Copyed to clipboard was successful!");
        alert("Copying to clipboard was successful!");
      },
      function(err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };

  /**
   * getBalance function
   */
  const getBalance = async () => {
    // get balance
    const num = await getTokenBalanceOf(currentAccount);
    setBalance(num);
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
    }
  };

  useEffect(() => {
    getBalance();
    checkStatus();
    setWidth(window.innerWidth);

    window.addEventListener(`resize`, updateWidth, {
      capture: false,
      passive: true,
    });

    return () => window.removeEventListener(`resize`, updateWidth);
  }, []);

  // set DID name
  const [didName, setDidName] = useState("foo");

  const handleChange = (event) => {
    setDidName(event.target.value);
  };

  return (
    <>
      {/* // Todo: integrate isOpenQRCamera 
      {isOpenQRCamera ? (
        <Container maxWidth="md" style={{ paddingTop: "1em", paddingBottom: "10em" }}>
          <QrCodeReader 
            onRead={e => {
              setIsOpenQRCamera(false);
              setQrResult(e);
              setTo(e.text);
            }} 
            setOpen={setIsOpenQRCamera} 
          />
        </Container>
      ):(
    */}
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

          {/*<Button color="inherit">Login</Button>*/}
        </Toolbar>
      </AppBar>

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
            buttonName="Register" // Regiter button --------------
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
    </>
  );
};

export default Home1;
