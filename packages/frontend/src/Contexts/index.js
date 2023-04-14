import { createContext, useContext, useState } from "react";

// create Context
export const MyContext = createContext({});

/**
 * useContractContext function
 * @returns 
 */
export const useMyContext = () => {
  return useContext(MyContext);
}

/**
 * ContextProvider
 * @param 子コンポーネント
 */
export const ContextProvider = ({ children }) => {
  // ステート変数
  const [currentAccount, setCurrentAccount] = useState(null);
  const [fullDid, setFullDid] = useState(null);
  const [width, setWidth] = useState(0);
  const [isOpenQRCamera, setIsOpenQRCamera] = useState(false);
  const [qrResult, setQrResult] = useState({});
  const [successFlg, setSuccessFlg] = useState(false);
  const [failFlg, setFailFlg] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * update screent width
   * @param {*} event 
   */
  const updateWidth = (event) => {
    setWidth(window.innerWidth)
  }

  /**
   * clickOpenQrReader function
   */
  const clickOpenQrReader = () => {
    setIsOpenQRCamera(true);
  };

  /**
   * popUp
   * @param flg true: success false：fail
   */
  const popUp = (flg) => {
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

  return (
    <MyContext.Provider 
      value={{
        currentAccount,
        setCurrentAccount,
        width,
        setWidth,
        fullDid, 
        setFullDid,
        isOpenQRCamera, 
        setIsOpenQRCamera,
        qrResult, 
        setQrResult,
        successFlg,
        setSuccessFlg,
        failFlg,
        setFailFlg,
        showToast,
        setShowToast,
        isLoading,
        setIsLoading,
        updateWidth,
        clickOpenQrReader,
        popUp
      }}
    >
      {children}
    </MyContext.Provider>
  );
};