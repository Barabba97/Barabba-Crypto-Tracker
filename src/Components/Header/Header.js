import { AppBar, Container, createTheme, MenuItem, Select, ThemeProvider, Toolbar, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CryptoState } from '../../CryptoContext';

const useStyles = makeStyles({
    title: {
        flex: 1,
        color: "#f51720",
        fontFamily: "Montserrat",
        fontWeight: "bold",
        cursor: "pointer",
    }
});

const Header = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    const { currency, setCurrency } = CryptoState();

    const handleClick = () => {
        navigate('/');
    }

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff"
            },
            mode: 'dark',
        },
      });

    return (
        <ThemeProvider theme={darkTheme}>
            <AppBar class='bar'>
                <Container>
                    <Toolbar>
                        <Typography
                            onClick={handleClick}
                            className={classes.title}
                            variant='h6'
                        >
                            Crypto Tracker
                        </Typography>
                        <Select
                            class='selector' 
                            variant='outlined' 
                            style={{
                                width: 100,
                                height: 40,
                                marginRight: 15,
                            }}
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            <MenuItem value={"USD"}>USD</MenuItem>
                            <MenuItem value={"EUR"}>EUR</MenuItem>
                        </Select>
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    );
};

export default Header;