import FileCopyIcon from "@mui/icons-material/FileCopy";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { ethers } from 'ethers';
import LoadingIndicator from "../common/LoadingIndicator";
import QrCodeDialog from "../common/QrCodeDialog";

import { AppBar, Toolbar } from "@mui/material";
import { cyan, indigo } from "@mui/material/colors";
import { useState } from "react";
import superAgent from "superagent";
import { useQuery } from 'urql';
import { useMyContext } from "../../Contexts";
import Logo from "../../assets/imgs/Logo_v3.png";
import getUserInfoQuery from "../../graphql/getUserInfo";
import { baseURL } from "../common/Constant";
import "./../../assets/css/App.css";

/**
 * Homeコンポーネント
 */
const Home2 = (props: any) => {
  // create contract
  const {
    currentAccount,
    updateWidth,
    width,
    setWidth,
    isOpenQRCamera,
    setIsOpenQRCamera,
    setQrResult,
    clickOpenQrReader,
    successFlg,
    fullDid,
    setFullDid,
    failFlg,
    showToast,
    isLoading,
    setIsLoading,
    popUp
  }: any = useMyContext();

  const [to, setTo] = useState(null);
  const [amount, setAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [addrQrOpen, setAddrQrOpen] = useState(false);
  

  // execute query
  const [result] = useQuery({ 
    query: getUserInfoQuery,
    variables: { 
      addr: "0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072",
      did: "did:ion:er....rer"
    }
  });
  // get indexed data
  const { data, fetching, error } = result;
  console.log(`respose:${JSON.stringify(data)}`);
  // variables for user info
  var did;
  var name;
  var score;
  var balance;


  if(data !== undefined) {
    did = JSON.stringify(data.registereds[0].did).replace(/"/g, "");
    name = JSON.stringify(data.registereds[0].name).replace(/"/g, "");
    score = JSON.stringify(data.updateScores[0].score).replace(/"/g, "");
    balance = ethers.utils.formatEther(JSON.stringify(data.balanceChangeds[0].balanceOf).replace(/"/g, ""));
  }

  /**
   * send function
   */
  const sendAction = async (to:any, amount:any) => {
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
          popUp(false);
          setIsLoading(false);
          return err;
        }
        setIsLoading(false);
        // popUpメソッドの呼び出し
        popUp(true);
      });
  };

  /**
   * Open Dialog
   * @param wallet MultoSig Wallet Addr
   */
  const handleOpen = () => {
    setOpen(true);
  };

  /**
   * Close Dialog
   */
  const handleClose = () => {
    setOpen(false);
  };

  /**
   * クリップボードでDIDをコピーするための機能
   */
  const copyDid = () => {
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
   * クリップボードでDIDをコピーするための機能
   */
  const copyAddr = () => {
    //コピー
    navigator.clipboard.writeText(currentAccount).then(
      function() {
        console.log("Async: Copyed to clipboard was successful!");
        alert("Copying to clipboard was successful!");
      },
      function(err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };

  // QRコードを表示
  const showDidQRCode = async () => {
    setQrOpen(true);
  };

  const handleQrClose = () => {
    setQrOpen(false);
  };

  const showAddrQRCode = async () => {
    setAddrQrOpen(true);
  };

  const handleAddrQrClose = () => {
    setAddrQrOpen(false);
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

  const thisMinWidth = 300;

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

      {/* QrCodeDialog */}
      <QrCodeDialog
        title="My DID"
        open={qrOpen}
        did={fullDid}
        handleClose={() => {handleQrClose()}} 
      />
      <QrCodeDialog
        title="My WalletAddress"
        open={addrQrOpen}
        did={currentAccount}
        handleClose={() => {handleAddrQrClose()}} 
      />

      {fetching ? (
        <Grid container justifyContent="center">
          <div className="loading">
            <p><LoadingIndicator/></p>
            <h3>Please Wait・・・・</h3>
          </div>
        </Grid>
      ) : (
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
                  value={did}
                />
                <IconButton onClick={copyDid}>
                  <FileCopyIcon />
                </IconButton>
              </Box>
              <Box>
                <Card>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ backgroundColor: cyan[50] }}
                  >
                    Your DNS: {name}
                  </Typography>
                </Card>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  onClick={showDidQRCode}
                  sx={{
                    borderRadius: "8px",
                  }}
                >
                  Show Your QR Code
                </Button>
              </Box>
            </Stack>
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
                <InputLabel htmlFor="inputYourDID">Your Address:</InputLabel>
                <TextField
                  id="inputYourAddress"
                  type="text"
                  value={currentAccount}
                />
                <IconButton onClick={copyAddr}>
                  <FileCopyIcon />
                </IconButton>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  onClick={showAddrQRCode}
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
                    Your Social Score: {score}
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
              <TextField id="inputFriendDID" type="text" value={balance} />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <Button
                variant="contained"
                onClick={buyToken}
                sx={{
                  borderRadius: "8px",
                }}
              >
                Send Token
              </Button>
              <Button
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
                variant="contained"
                onClick={uploadYourVC}
                sx={{
                  borderRadius: "8px",
                }}
              >
                Upload Your VC
              </Button>
              <a href="https://www.blockcerts.org/">
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: "8px",
                  }}
                >
                  Verify Your VC
                </Button>
              </a>
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
      )}
    </>
  );
};

export default Home2;
