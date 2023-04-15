// mui関連のコンポーネントのインポート
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Container, Icon, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { indigo, cyan } from "@mui/material/colors";
import { AppBar, Toolbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import superAgent from "superagent";
import ActionButton2 from "../common/ActionButton2";
import LoadingIndicator from "../common/LoadingIndicator";
import SendDialog from "../common/SendDialog";
import "./../../assets/css/App.css";
import { useMyContext } from "../../Contexts";
import { baseURL, WIDTH_THRESHOLD } from "../common/Constant";
//import GroupButtons from "../common/GroupButtons";
import MainContainer from "../common/MainContainer";
import QrCodeDialog from "../common/QrCodeDialog";
import QrCodeReader from "../common/QrCodeReader";
import {
  getDid,
  getRegisterStatus,
  getTokenBalanceOf,
} from "../hooks/UseContract";
import Logo from "../../assets/imgs/Logo_v3.png";
import LogoS from "../../assets/imgs/LogoSmall_v3.png";

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
const Home2 = (props) => {
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
  } = useMyContext();

  const [balance, setBalance] = useState(0);
  const [did, setDid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [successFlg, setSuccessFlg] = useState(false);
  const [failFlg, setFailFlg] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [to, setTo] = useState(null);
  const [amount, setAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  /**
   * Register function
   */
  const registerAction = async () => {
    setIsLoading(true);

    // DID作成APIを呼び出す
    superAgent
      .post(baseURL + "/api/create")
      .query({ addr: currentAccount })
      .end(async (err, res) => {
        if (err) {
          console.log("DID作成用API呼び出し中に失敗", err);
          // popUpメソッドの呼び出し
          popUp(false, "failfull...");
          //setIsLogined(false);
          setIsLoading(false);
          return err;
        }

        // DIDを取得する。
        const result = await getDid(currentAccount);
        var modStr =
          result.substr(0, 9) + "..." + result.substr(result.length - 3, 3);

        setDid(modStr);
        setFullDid(result);
        console.log("DID作成用API呼び出し結果：", result);

        // Token発行APIを呼び出す
        superAgent
          .post(baseURL + "/api/mintToken")
          .query({
            to: currentAccount,
            amount: 10000,
          })
          .end(async (err, res) => {
            if (err) {
              console.log("Token発行用API呼び出し中に失敗", err);
              // popUpメソッドの呼び出し
              popUp(false, "failfull...");
              setIsLoading(false);
              return err;
            }
          });

        // popUpメソッドの呼び出し
        popUp(true, "successfull!!");
        await checkStatus();
        setIsLoading(false);
      });
  };

  /**
   * send function
   */
  const sendAction = async (to, amount) => {
    setIsLoading(true);

    // 送金用のAPIを呼び出す
    superAgent
      .post(baseURL + "/api/send")
      .query({
        from: fullDid,
        to: to,
        amount: amount,
      })
      .end(async (err, res) => {
        if (err) {
          console.log("Token送金用API呼び出し中に失敗", err);
          // popUpメソッドの呼び出し
          popUp(false, "failfull...");
          setIsLoading(false);
          return err;
        }
        await getBalance();
        setIsLoading(false);
        // popUpメソッドの呼び出し
        popUp(true, "successfull!!");
      });
  };

  /**
   * ポップアップ時の処理を担当するメソッド
   * @param flg true：成功 false：失敗
   */
  const popUp = (flg) => {
    // 成功時と失敗時で処理を分岐する。
    if (flg === true) {
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
   * クリップボードでDIDをコピーするための機能
   */
  const copy = () => {
    //コピー
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
    // 残高を取得する
    const num = await getTokenBalanceOf(currentAccount);
    setBalance(num);
  };

  /**
   * checkStatus function
   */
  const checkStatus = async () => {
    // 登録ステータスを確認する。
    var status = await getRegisterStatus(currentAccount);
    console.log("isRegistered:", isRegistered);
    setIsRegistered(status);

    if (status) {
      // DIDを取得する。
      const didData = await getDid(currentAccount);
      console.log("didData :", didData);
      // short
      var modStr =
        didData.substr(0, 9) + "..." + didData.substr(didData.length - 3, 3);
      setDid(modStr);
      setFullDid(didData);
    }
  };

  // QRコードを表示
  const showQRCode = async () => {
    alert("QRコードを表示します。");
  };

  // 友だちを探す
  const searchFriend = async () => {
    alert("友だちを探します");
  };

  // Token購入
  const buyToken = async () => {
    alert("Tokenを購入します");
  };

  // VCをアップロード
  const uploadYourVC = async () => {
    alert("VCをアップロードします");
  };

  // VCを検証
  const verifyYourVC = async () => {
    alert("VCを検証します");
  };

  let SocialScore = 100;
  const thisMinWidth = 300;

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
          <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
            Home
          </Typography>

          {/*<Button color="inherit">Login</Button>*/}
        </Toolbar>
      </AppBar>

      {/* 全部をまとめる */}
      <Stack
        spacing={4}
        alignContent={"center"}
        alignItems={"center"}
        sx={{
          paddingTop: "8pt",
          backgroundColor: indigo[100],
          height: "100vh",
        }}
      >
        {/* DID関連の2Boxをまとめる */}
        <Stack spacing={1}>
          {/* show your QR code*/}
          <Stack
            spacing={1}
            sx={{
              backgroundColor: cyan[50],
              borderRadius: "8pt",
              padding: "8pt",
              minWidth: { thisMinWidth },
            }}
          >
            <Box display="flex" alignItems="center">
              <InputLabel htmlFor="inputYourDID">Your DID:</InputLabel>
              <TextField
                id="inputYourDID"
                type="text"
                defaultValue="your.did"
              />
              <IconButton onClick={copy}>
                <FileCopyIcon />
              </IconButton>
            </Box>
            <Box>
              <Button
                buttonName="showYourQRCode"
                variant="contained"
                onClick={showQRCode}
                sx={{
                  borderRadius: "8px",
                }}
              >
                Show Your QR Code
              </Button>
            </Box>
          </Stack>
          {/* search friend */}
          <Stack
            spacing={1}
            sx={{
              backgroundColor: cyan[50],
              borderRadius: "8pt",
              padding: "8pt",
              minWidth: { thisMinWidth },
            }}
          >
            <Box display="flex" alignItems="center">
              <InputLabel htmlFor="inputFriendDID">Friend's DID:</InputLabel>
              <TextField
                id="inputFriendDID"
                type="text"
                defaultValue="****.did"
              />
            </Box>
            <Box>
              <Button
                buttonName="SearchFriend"
                variant="contained"
                onClick={searchFriend}
                sx={{
                  borderRadius: "8px",
                }}
              >
                Search Friend
              </Button>
            </Box>
            <Box>
              <Card>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ backgroundColor: cyan[50] }}
                >
                  Your Social Score: {SocialScore}
                </Typography>
              </Card>
            </Box>
          </Stack>
        </Stack>

        {/* your Token */}
        <Stack
          spacing={1}
          sx={{
            backgroundColor: "white",
            borderRadius: "8pt",
            padding: "8pt",
            minWidth: { thisMinWidth },
          }}
        >
          <Box display="flex" alignItems="center">
            <InputLabel htmlFor="inputFriendDID">Your Token:</InputLabel>
            <TextField id="inputFriendDID" type="text" defaultValue="0" />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Button
              buttonName="SendToken"
              variant="contained"
              onClick={sendAction}
              sx={{
                borderRadius: "8px",
              }}
            >
              Send Token
            </Button>
            <Button
              buttonName="BuyToken"
              variant="contained"
              onClick={buyToken}
              sx={{
                borderRadius: "8px",
              }}
            >
              Buy Token
            </Button>
          </Box>
        </Stack>

        {/* your VC */}
        <Stack
          spacing={1}
          sx={{
            backgroundColor: "white",
            borderRadius: "8pt",
            padding: "8pt",
            minWidth: { thisMinWidth },
          }}
        >
          <Box>
            <FormControl fullWidth>
              <InputLabel id="yourVC">YourVC</InputLabel>
              <Select labelId="yourVC" id="yourVC" label="Your VC">
                <MenuItem value={10}>.........</MenuItem>
                <MenuItem value={20}>zzzzzzzzz</MenuItem>
                <MenuItem value={30}>xxxxxxxxx</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Button
              buttonName="uploadYourVC"
              variant="contained"
              onClick={uploadYourVC}
              sx={{
                borderRadius: "8px",
              }}
            >
              Upload Your VC
            </Button>
            <Button
              buttonName="verifyYourVC"
              variant="contained"
              onClick={verifyYourVC}
              sx={{
                borderRadius: "8px",
              }}
            >
              Verify Your VC
            </Button>
          </Box>
        </Stack>
        {/* your NFT */}
        <Stack
          spacing={1}
          sx={{
            backgroundColor: "white",
            borderRadius: "8pt",
            padding: "8pt",
            minWidth: "300px",
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="yourNFT">Your NFT</InputLabel>
            <Select labelId="yourNFT" id="yourNFT" label="Your NFT">
              <MenuItem value={10}>.........</MenuItem>
              <MenuItem value={20}>zzzzzzzzz</MenuItem>
              <MenuItem value={30}>xxxxxxxxx</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>
    </>
  );
};

export default Home2;