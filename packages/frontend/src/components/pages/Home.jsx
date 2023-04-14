// mui関連のコンポーネントのインポート
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Container } from '@mui/material';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import superAgent from 'superagent';
import ActionButton2 from '../common/ActionButton2';
import LoadingIndicator from '../common/LoadingIndicator';
import SendDialog from '../common/SendDialog';
import { useMyContext } from './../../Contexts';
import './../../assets/css/App.css';
import {
    baseURL
} from './../common/Constant';
import MainContainer from './../common/MainContainer';
import QrCodeDialog from './../common/QrCodeDialog';
import QrCodeReader from './../common/QrCodeReader';
import {
    getDid, getRegisterStatus, getTokenBalanceOf
} from './../hooks/UseContract';

/** 
 * StyledPaperコンポーネント
 */
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    maxWidth: 400,
    //minHeight: 200,
    backgroundColor: 'rgb(150, 144, 144)'
}));

/**
 * Home Component
 */
const Home = (props) => {
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
        popUp
    } = useMyContext();

    const [balance, setBalance] = useState(0);
    const [did, setDid] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [to, setTo] = useState(null);
    const [amount, setAmount] = useState(0);
    const [open, setOpen] = useState(false);
    const [qrOpen, setQrOpen] = useState(false);

    /**
     * Register function 
     */
    const registerAction = async() => {
        setIsLoading(true);
        
        // DID作成APIを呼び出す
        superAgent
            .post(baseURL + '/api/create')
            .query({addr: currentAccount})
            .end(async(err, res) => {
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
                var modStr = result.substr(0, 9) + '...' + result.substr(result.length - 3, 3);

                setDid(modStr);
                setFullDid(result);
                console.log("DID作成用API呼び出し結果：", result);  

                // Token発行APIを呼び出す
                superAgent
                    .post(baseURL + '/api/mintToken')
                    .query({
                        to: currentAccount,
                        amount: 10000
                    })
                    .end(async(err, res) => {
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
    }

    /**
     * send function
     */
    const sendAction = async(to, amount) => {
        setIsLoading(true);
        
        // 送金用のAPIを呼び出す
        superAgent
            .post(baseURL + '/api/send')
            .query({
                from: fullDid,
                to: to,
                amount: amount
            })
            .end(async(err, res) => {
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
     * Open Dialog
     * @param wallet MultoSig Wallet Addr
     */
    const handleOpen = (wallet) => {
        setOpen(true);
    }

    /**
     * Close Dialog
     */
    const handleClose = () => {
        setOpen(false);
    }

    /**
     * Open Dialog
     * @param wallet MultoSig Wallet Addr
     */
    const handleQrOpen = (wallet) => {
        setQrOpen(true);
    }

    /**
     * Close Dialog
     */
    const handleQrClose = () => {
        setQrOpen(false);
    }

    /**
     * クリップボードでDIDをコピーするための機能
     */
    const copy = () => {
        //コピー
        navigator.clipboard.writeText(fullDid)
            .then(function() {
                console.log('Async: Copyed to clipboard was successful!');
                alert("Copying to clipboard was successful!")
            }, function(err) {
                console.error('Async: Could not copy text: ', err);
            });
    };

    /**
     * getBalance function
     */
    const getBalance = async() => {
        // 残高を取得する
        const num = await getTokenBalanceOf(currentAccount);
        setBalance(num);
    }

    /**
     * checkStatus function
     */
    const checkStatus = async() => {
        
        // 登録ステータスを確認する。
        var status = await getRegisterStatus(currentAccount);
        console.log("isRegistered:", isRegistered);
        setIsRegistered(status);

        if(status) {
            // DIDを取得する。
            const didData = await getDid(currentAccount);
            console.log("didData :", didData);
            // short
            var modStr = didData.substr(0, 9) + '...' + didData.substr(didData.length - 3, 3)
            setDid(modStr);
            setFullDid(didData);
        }
    };

    useEffect(()=> {
        getBalance();
        checkStatus();
        setWidth(window.innerWidth);

        window.addEventListener(`resize`, updateWidth, {
            capture: false,
            passive: true,
        })
      
        return () => window.removeEventListener(`resize`, updateWidth)
    }, []);

    return (
        <>
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
                <MainContainer>
                    { /* Dialog */ } 
                    <SendDialog 
                        open={open} 
                        amount={amount}
                        to={to}
                        handleClose={(e) => {handleClose()}} 
                        sendAction={(e) => {sendAction(to, amount)}} 
                        setTo={(e) => {setTo(e.target.value)}}
                        setAmountAction={(e) => {setAmount(e.target.value)}} 
                        clickOpenQrReader={clickOpenQrReader}
                    />
                    {/* QrCodeDialog */}
                    <QrCodeDialog
                        open={qrOpen}
                        did={fullDid}
                        handleClose={(e) => {handleQrClose()}} 
                    />
                    <StyledPaper 
                        sx={{
                            my: 1, 
                            mx: "auto", 
                            p: 0, 
                            borderRadius: 4, 
                            marginTop: 4
                        }}
                    >
                        {isLoading ? (
                            <Grid container justifyContent="center">
                                <div className="loading">
                                    <p><LoadingIndicator/></p>
                                    <h3>Please Wait・・・・</h3>
                                </div>
                            </Grid>
                        ) : ( 
                            <>
                                <Grid 
                                    container 
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <div className="App-content">
                                        <p><strong>My Soul</strong></p>
                                        {isRegistered ? (
                                            <>
                                                <p>Your DID:{did} <ContentCopyIcon className='pointer' fontSize="small" onClick={copy}/></p>
                                                <p>Your Token:{balance}</p>
                                                <Grid
                                                    container
                                                    direction="row"
                                                    justifyContent="center"
                                                    alignItems="center"
                                                    flex={true}
                                                >
                                                    <ActionButton2 buttonName="send" color="primary" clickAction={handleOpen} />
                                                    <ActionButton2 buttonName="My QR Code" color="secondary" clickAction={handleQrOpen} />
                                                </Grid>
                                            </>
                                        ) : (
                                            <>
                                                <ActionButton2 buttonName="Register" color="primary" clickAction={registerAction} />
                                            </>
                                        )}
                                    </div>
                                </Grid>
                            </>
                        )}
                    </StyledPaper>
                    {successFlg && (
                        /* 成功時のポップアップ */
                        <div id="toast" className={showToast ? "zero-show" : ""}>
                            <div id="secdesc">Create Trasaction Successfull!!</div>
                        </div>
                    )}
                    {failFlg && (
                        /* 失敗時のポップアップ */
                        <div id="toast" className={showToast ? "zero-show" : ""}>
                            <div id="desc">Create Trasaction failfull..</div>
                        </div>
                    )}
                </MainContainer>
            )}
        </>
    );
};

export default Home;