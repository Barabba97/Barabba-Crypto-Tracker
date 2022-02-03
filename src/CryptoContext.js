import React, { createContext, useContext, useState, useEffect } from 'react';

const Crypto = createContext();

export const CryptoState = () => {
    return useContext(Crypto);
};

const CryptoContext = ({children}) => {
    const [currency, setCurrency] = useState("EUR");
    const [symbol, setSymbol] = useState("€");

    useEffect(() => {
        if (currency === "EUR") setSymbol("€");
        else if (currency === "USD") setSymbol("$");
    }, [currency]);

    return (
        <Crypto.Provider value={{currency, symbol, setCurrency}}>
            {children}
        </Crypto.Provider>
    );
};

export default CryptoContext;
