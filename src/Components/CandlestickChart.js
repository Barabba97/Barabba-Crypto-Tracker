import { makeStyles, ThemeProvider } from "@material-ui/core";
import { createTheme } from "@mui/material";
import React, { useState, useEffect } from "react";
import { BinanceChartApi } from "../config/api";
import { CryptoState } from "../CryptoContext";
import { timeIntervals } from '../config/data';
import { CircularProgress } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';
import StickChart from "./StickChart";

const useStyles = makeStyles((theme) => ({
  container: {
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      padding: 40,
      [theme.breakpoints.down("md")]: {
          width: "100%",
          marginTop: 0,
          padding: 20,
          paddingTop: 0,
      },
  },
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButtonGroup-grouped': {
      margin: theme.spacing(0.2),
      border: "1px solid #f51720",
      borderRadius: 5,
      padding: 10,
      paddingLeft: 20,
      paddingRight: 20,
      fontFamily: "Montserrat",
      cursor: "pointer",
      backgroundColor: "",
      color: "white",
      fontWeight: 500,
      marginTop: 20,
      width: "100%",
      "&.Mui-selected, &:hover": {
          backgroundColor: "#f51720",
          color: "black",
          fontWeight: 600,
      },
      //margin: 5,
      '&.Mui-disabled': {
        border: 0,
      },
      '&:not(:first-of-type)': {
        borderRadius: 1,
      },
      '&:first-of-type': {
        borderRadius: 1,
      },
  },
}));

const darkTheme = createTheme({
  palette: {
      primary: {
          main: "#fff",
      },
      type: "dark",
  },
});

const CandlestickChart = ({coin}) => {
    const [historicData, setHistoricData] = useState();
    const [intervals, setIntervals] = useState("1d");
    const [flag, setFlag] = useState(false);
    const { currency } = CryptoState();

    const classes = useStyles();
    
    const fetchHistoricData = async () => {
        try {
            var api_url = BinanceChartApi(coin.symbol.toUpperCase(), currency.toUpperCase(), intervals);
            const response = await fetch(api_url);
            const apiData = await response.json();
            
            setFlag(true);
            setHistoricData(apiData);
        } catch (err) {
            console.error(err);
        }
    };
    
    useEffect (() => {
        fetchHistoricData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [intervals]);

    const handleIntervals = (event, newInterval) => {
      if (newInterval !== null) {
          setIntervals(newInterval);
          setFlag(false);
      }
    }

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
                {!historicData || flag===false ? (
                    <CircularProgress
                        style={{ 
                            color: "#f51720" 
                        }}
                        size={250}
                        thickness={1}
                    />
                ) : (
                    <>
                        {/*Chart*/}
                        <StickChart historicData={historicData}/>

                        {/*Buttons*/}
                        <div>
                            {timeIntervals.map((interval) => (
                                <StyledToggleButtonGroup
                                    value={intervals}
                                    exclusive
                                    onChange={handleIntervals}
                                >
                                    <ToggleButton
                                        value={interval.value}
                                    >
                                        {interval.label}
                                    </ToggleButton>
                                </StyledToggleButtonGroup>
                            ))}
                        </div>
                    </>
                )}
            </div>
    </ThemeProvider>
  );
}

export default CandlestickChart;