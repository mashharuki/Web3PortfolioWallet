import StartIcon from '@mui/icons-material/Start';
import AppBar from '@mui/material/AppBar';
import GlobalStyles from '@mui/material/GlobalStyles';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useMyContext } from './../Contexts';
import './../assets/css/App.css';
import ActionButton2 from './common/ActionButton2';
import Web3Menu from "./common/Web3Menu";
import {
  connectWallet
} from './hooks/UseContract';
import Home from './pages/Home';
import NoPage from './pages/NoPage';
import Verify from './pages/Verify';

/**
 * App Component
 */
function App() {
  // create contract
  const {
    currentAccount,
    setCurrentAccount
  } = useMyContext();

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

  return (
    <>
      <GlobalStyles styles={{ body: { margin: 0, padding: 0 } }} />
      <Router>
        <div sx={{ flexGrow: 1 }}>
          <AppBar position="static" color="transparent">
            <Toolbar>
              <Typography variant="h6" color="black" sx={{ flexGrow: 1 }}>
                <strong>Web3 Wallet</strong>
              </Typography>
              <Typography variant="h6" color="inherit">
                {currentAccount === null ? (
                  <IconButton 
                    aria-label="more"
                    id="connect-wallet"
                    aria-haspopup="true"
                    onClick={connectWalletAction}
                  >
                    <StartIcon />
                  </IconButton>
                ) :
                  <Web3Menu/>
                }
              </Typography>
            </Toolbar>
          </AppBar>
          { currentAccount === null ? (
            <header className="App-header">
              <p>Welcome to Web3PortfolioWallet!!</p>
              <ActionButton2 buttonName="Enter App" color="primary" clickAction={connectWalletAction} />
            </header>
          ) : (
            <Routes>
              <Route path="/" exact element={ <Home /> } />
              <Route path="/home" exact element={ <Home /> } />
              <Route path="/verify" exact element={ <Verify/> } />
              <Route path="*" exact element={ <NoPage/> } />
            </Routes>
          )}
        </div>
      </Router>
    </>
  );
}

export default App;