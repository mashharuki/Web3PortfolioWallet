import AppBar from "@mui/material/AppBar";
import GlobalStyles from "@mui/material/GlobalStyles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import {
  Link,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import { useMyContext } from "./../Contexts";
import "./../assets/css/App.css";
import Web3Menu from "./common/Web3Menu";
import { connectWallet } from "./hooks/UseContract";
import NoPage from "./pages/NoPage";
//
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Logo from "../assets/imgs/Logo_v3.png";
import backgroundImage from "../assets/imgs/background.png";
import Home1 from "./pages/Home1";
import Home2 from "./pages/Home2";

import { Client, Provider, cacheExchange, fetchExchange } from 'urql';
import { GRAPHQL_API_ENDPOINT } from "./common/Constant";

// create graphQL client
const client = new Client({
  url: GRAPHQL_API_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
});


/**
 * App Component
 */
function AppContent() {
  // create contract
  const { currentAccount, setCurrentAccount }: any = useMyContext();

  /**
   * connect wallet method
   */
  const connectWalletAction = async () => {
    try {
      // call createContractObject function
      const { signer } = await connectWallet();

      setCurrentAccount(signer);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * 詳細のモーダルダイアログ表示の処理
   */
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 340,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 1,
  };

  // Bloctoでアカウント作成後はHome1画面に遷移
  const navigate = useNavigate();

  useEffect(() => {
    if (currentAccount !== null) {
      navigate("/Home1");
    }
  }, [currentAccount, navigate]);

  return (
    <>
      <GlobalStyles styles={{ body: { margin: 0, padding: 0 } }} />
      <div>
        <Stack
          sx={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100vw",
            height: "100vh",
          }}
        >
          <AppBar position="static" sx={{ backgroundColor: "primary.main" }}>
            <Toolbar>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100vw",
                  backgroundColor: "primary.main",
                }}
              >
                <img
                  src={Logo}
                  alt="Web3 Portfolio Walet - Logo"
                  style={{ width: "222px" }}
                />
              </Box>
            </Toolbar>
          </AppBar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Stack
              divider={<Divider orientation="horizontal" flexItem />}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "283px",
                height: "120px",
                marginTop: "40px",
                marginButtom: "28px",
                backgroundColor: "primary.contrastText",
                borderRadius: "8px",
              }}
            >
              <Typography
                variant="h5"
                color="primary.main"
                sx={{ flexGrow: 1 }}
              >
                Easy To Use
              </Typography>
              <Typography
                variant="h5"
                color="primary.main"
                sx={{ flexGrow: 1 }}
              >
                Show Your identity
              </Typography>
              <Typography
                variant="h5"
                color="primary.main"
                sx={{ flexGrow: 1 }}
              >
                Comm. Together
              </Typography>
            </Stack>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "28px",
              marginBottom: "28px",
            }}
          >
            <Button
              variant="contained"
              endIcon={<ArrowForwardIosIcon />}
              onClick={handleOpen}
              sx={{
                borderRadius: "8px",
              }}
            >
              Show Details
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  The Characteristics of Web3 Portfolio Wallet
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <p>
                    This wallet is a portfolio wallet that consolidates the
                    information that forms one's digital identity in the
                    blockchain world, including DID, wallet address,
                    VerifiableCredentials, and NFT.
                  </p>
                  <p>
                    In addition, it is envisioned to enable the registration and
                    management of DIDs that are unfamiliar to humans to be
                    registered and managed under an easy-to-understand name as
                    DID Name Service.
                  </p>
                  <p>
                    As the number of exchanges on the blockchain increases,
                    Social Identity tokens will be granted, which can be used
                    for money transfers.
                  </p>
                  <p>
                    The more connections you have with others, the more your
                    score will increase, which will be converted into a score in
                    the blockchain domain.
                  </p>
                  <p>
                    It is a wallet where activity itself is structured as a
                    portfolio.
                  </p>
                </Typography>
              </Box>
            </Modal>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "28px",
              marginBottom: "28px",
            }}
          >
            {currentAccount === null && currentAccount === undefined ? (
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={connectWalletAction}
                  sx={{
                    borderRadius: "8px",
                    marginTop: "60px",
                  }}
                >
                  Enter App
                </Button>

                <Link to="/Home1">tmp: link to Home1</Link>
                <Link to="/Home2">tmp: link to Home2</Link>
              </Stack>
            ) : (
              /* 各画面に遷移するためのWeb3Menuコンポーネントを表示する。 */
              <Web3Menu /> // Todo：Web3Menuを表示する代わりにBlocto作業が終わったらHome1に遷移させる
            )}
          </Box>
        </Stack>
      </div>
    </>
  );
}

/**
 * App Component
 * @returns 
 */
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/home1" element={<Home1 />} />
          <Route path="/home2" element={<Home2 />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </Router>
    </div>
  );
}

function Root() {
  return (
    <Provider value={client}>
      <App />
    </Provider>
  );
}

export default Root;
