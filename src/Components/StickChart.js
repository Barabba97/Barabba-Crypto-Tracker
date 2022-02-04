import {useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import useGoogleCharts from '../useGoogleCharts';

const StickChart = ({historicData}) => {
    const [chart, setChart] = useState(null);
    const apiData = historicData;
    const google = useGoogleCharts();

    var timestamp = [];
    var openPrice = [];
    var highPrice = [];
    var lowPrice = [];
    var closePrice = [];
    var dataArray = [];

    for (let i = 0; i < apiData.length; i++){
        timestamp[i]  = new Date(apiData[i][0]);
        openPrice[i]  = apiData[i][1];
        highPrice[i]  = apiData[i][2];
        lowPrice[i]   = apiData[i][3];
        closePrice[i] = apiData[i][4];

        dataArray.push([timestamp[i], lowPrice[i], openPrice[i], closePrice[i], highPrice[i]]);
    }

    console.log(dataArray);

    const drawChart = async () => {
        //Create the data table
        const data = await new google.visualization.arrayToDataTable([dataArray], true);
                
        //Set chart options
        var options = {
            legend: 'none',
            backgroundColor: "",
            bar: { groupWidth: "100%" }, // Remove space between bars.
            candlestick: {
              fallingColor: { strokeWidth: 0, fill: "#a52714" }, // red
              risingColor: { strokeWidth: 0, fill: "#0f9d58" }, // green
            },
        };
    
        //Instantiate and draw our chart, passing in some options
        var container = document.getElementById('chartDiv');
        const newChart = await new google.visualization.CandlestickChart(container);
        newChart.draw(data, options);
        setChart(newChart);
    }

    useEffect(() => {
        drawChart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [google, chart, historicData])

    return (
        <>
            {!chart && <Spinner />}
            <div id="chartDiv" className={!chart ? 'd-none' : ''} />
        </>
    );
};

export default StickChart;
