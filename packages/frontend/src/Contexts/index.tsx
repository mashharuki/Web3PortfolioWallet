import { createContext, useContext, useState } from "react";

// create Context
export const MyContext = createContext({});

/**
 * useContractContext function
 * @returns 
 */
export function useMyContext() {
  return useContext(MyContext);
}

/**
 * ContextProvider
 * @param children
 */
export function ContextProvider({ children }: any) {
  const [width, setWidth] = useState(0);
  const [qrResult, setQrResult] = useState({});

  /**
   * update screent width
   * @param {*} event 
   */
  const updateWidth = (event: any) => {
    setWidth(window.innerWidth)
  }

  return (
    <MyContext.Provider 
      value={{
        width,
        setWidth,
        qrResult, 
        setQrResult,
        updateWidth,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};