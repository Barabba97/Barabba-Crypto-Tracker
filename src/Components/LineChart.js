import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { HistoricalChart } from '../config/api';
import { CryptoState } from '../CryptoContext';
import { Chart as ChartJS} from 'chart.js/auto';
import { Line } from "react-chartjs-2";
import { chartDays } from "../config/data";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        width: "100%",
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

const LineChart = ({ coin }) => {
    const [historicData, setHistoricData] = useState();
    const [days, setDays] = useState(1);
    const [flag, setFlag] = useState(false);
    const { currency } = CryptoState();

    const classes = useStyles();

    const fetchHistoricData = async () => {
        try {
            const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
            setFlag(true);
            setHistoricData(data.prices);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchHistoricData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [days]);

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff",
            },
            type: "dark",
        },
    });

    const handleDays = (event, newDays) => {
        if (newDays !== null) {
            setDays(newDays);
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
                        <Line
                            data={{
                                labels: historicData.map((coin) => {
                                    let date = new Date(coin[0]);
                                    let time = 
                                        date.getHours() > 12
                                        ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                                        : `${date.getHours()}:${date.getMinutes()} AM`;
                                    return days === 1 ? time : date.toLocaleDateString();
                                }),

                                datasets: [
                                    {
                                        data: historicData.map((coin) => coin[1]),
                                        label: `Price (Past ${days} Days ) in ${currency}`,
                                        borderColor: "#f51720",
                                    },
                                ],
                            }}
                            options={{
                                elements: {
                                    point: {
                                        radius: 1,
                                    },
                                },
                            }}
                        />

                        {/*Buttons*/}
                        <div>
                            {chartDays.map((day) => (
                                <StyledToggleButtonGroup
                                    value={days}
                                    exclusive
                                    onChange={handleDays}
                                >
                                    <ToggleButton
                                        value={day.value}
                                    >
                                        {day.label}
                                    </ToggleButton>
                                </StyledToggleButtonGroup>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </ThemeProvider>
    );
};

export default LineChart;
