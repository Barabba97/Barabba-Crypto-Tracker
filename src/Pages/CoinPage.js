import { LinearProgress, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SingleCoin } from '../config/api';
import { CryptoState } from '../CryptoContext';
import ReactHtmlParser from "react-html-parser";
import { numberWithCommas } from '../Components/CoinsTable';
import LineChart from '../Components/LineChart';
import { makeStyles } from '@material-ui/core';
import CandlestickChart from '../Components/CandlestickChart';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        [theme.breakpoints.down("md")]: {
            flexDirection: "column",
            alignItems: "center",
        },
    },
    sidebar: {
        width: "30%",
        [theme.breakpoints.down("md")]: {
            width: "100%",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 25,
        borderRight: "2px solid grey",
    },
    heading: {
        fontWeight: "bold",
        marginBottom: 20,
        fontFamily: "Montserrat",
    },
    description: {
        width: "100%",
        fontFamily: "Montserrat",
        padding: 25,
        paddingBottom: 15,
        paddingTop: 0,
        textAlign: "justify",
    },
    marketData: {
        alignSelf: "start",
        padding: 25,
        paddingTop: 10,
        width: "100%",
        [theme.breakpoints.down("md")]: {
            display: "flex",
            justifyContent: "space-around",
        },
        [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
            alignItems: "center",
        },
        [theme.breakpoints.down("xs")]: {
            alignItems: "start",
        },
    },
    chartContainer: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
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
        marginBottom: 20, //Risolvere bug buttons
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

const StyledTypography = styled(Typography)(({theme}) => ({
    '& .MuiTypography': {
        variant: "h8",
        fontFamily: "Montserrat",
        fontWeight: "bold",
        marginBottom: 20,
    }
}));

const CoinPage = () => {
    const { id } = useParams();
    const [coin, setCoin] = useState();
    const [toggle, setToggle] = useState("line");

    const handleToggle = (event, newToggle) => {
        if (newToggle !== null) {
            setToggle(newToggle);
        }
    }

    const { currency, symbol } = CryptoState();

    const fetchCoin = async () => {
        try{
            const { data } = await axios.get(SingleCoin(id));

            setCoin(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCoin();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const classes = useStyles();
    
    if (!coin) return (<LinearProgress style={{ backgroundColor: "#f51720"}} />);
    
    return (
        <div className={classes.container}>
            <div className={classes.sidebar}>
                <img
                    src={coin?.image.large}
                    alt={coin?.name}
                    height="200"
                    style={{ marginBottom: 20 }}                
                />
                <Typography variant="h3" className={classes.heading}>
                    {coin?.name}
                </Typography>
                <Typography variant="subtitle1" className={classes.description}>
                    {ReactHtmlParser(coin?.description.en.split(". ")[0])}.
                </Typography>

                <div className={classes.marketData}>

                    <span style={{ display: "flex"}}>
                        <StyledTypography>
                            Rank:
                        </StyledTypography>
                        &nbsp; &nbsp;
                        <StyledTypography>
                            {numberWithCommas(coin?.market_cap_rank)}
                        </StyledTypography>
                    </span>

                    <span style={{ display: "flex"}}>
                        <StyledTypography>
                            Current Price:
                        </StyledTypography>
                        &nbsp; &nbsp;
                        <StyledTypography>
                            {symbol}{" "}
                            {numberWithCommas(
                                coin?.market_data.current_price[currency.toLowerCase()]
                            )}
                        </StyledTypography>
                    </span>

                    <span style={{ display: "flex"}}>
                        <StyledTypography>
                            Market Cap:
                        </StyledTypography>
                        &nbsp; &nbsp;
                        <StyledTypography>
                            {symbol}{" "}
                            {numberWithCommas(
                                coin?.market_data.market_cap[currency.toLowerCase()]
                                    .toString()
                                    .slice(0, -6)
                            )}
                            M
                        </StyledTypography>
                    </span>

                    <span style={{ display: "flex" }}>
                        <StyledTypography>
                            All time high:
                        </StyledTypography>
                        &nbsp; &nbsp;
                        <StyledTypography>
                            {symbol}{" "}
                            {numberWithCommas(
                                coin?.market_data.ath[currency.toLowerCase()]
                            )}
                        </StyledTypography>
                    </span>

                    <span style={{ display: "flex" }}>
                        <StyledTypography>
                            All time low:
                        </StyledTypography>
                        &nbsp; &nbsp;
                        <StyledTypography>
                            {symbol}{" "}
                            {numberWithCommas(
                                coin?.market_data.atl[currency.toLowerCase()]
                            )}
                        </StyledTypography>
                    </span>
                </div>

            </div>
            <div className={classes.chartContainer} >
                <StyledToggleButtonGroup
                    value={toggle}
                    exclusive
                    onChange={handleToggle}
                >
                    <ToggleButton
                        value="candlestick"
                    >
                        Candlestick
                    </ToggleButton>
                    <ToggleButton
                        value="line"
                    >
                        Line
                    </ToggleButton>
                </StyledToggleButtonGroup>
                {toggle === "candlestick" && <CandlestickChart coin={coin}/>}
                {toggle === "line" && <LineChart coin={coin}/>}
            </div>
        </div>
    );
};

export default CoinPage;
