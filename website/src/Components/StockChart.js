import React from 'react';

import { Line } from 'react-chartjs-2';

const timeConverter = UNIX_timestamp => {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = date + ' ' + month + ' ' + year;
    return time;
}

const StockChart = ({data, ticker}) => {
    return (
        <Line
            data={{
                labels: data.map(value => value.date).map(value => timeConverter(value)),
                datasets: [{
                    data: data.map(value => value.close),
                    label: ticker,
                    borderColor: "#3e95cd",
                    borderWidth: 1.5,
                    fill: false,
                    lineTension: 0
                }
            ]
        }}
        options={{
            maintainAspectRatio: false,
            elements: { point: { radius: 0 } }
        }}
    />
    );
}

export default StockChart;
