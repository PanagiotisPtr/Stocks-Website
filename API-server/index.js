const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'database'
});

connection.connect(error => {
    if(error)
    console.log(error);
});

app.use(cors());

function return_query_json(query, respond){
    connection.query(query, (error, result) => {
        if(error)respond.send(error);
        else{
            respond.json({
                data: result
            });
        }
    });
}

app.get('/stocks', (request, respond) => {
    const q = `select table_name from information_schema.tables where table_schema='database';`;
    return_query_json(q, respond);
});

app.get('/', (request, respond) => {
    respond.send('Welcome to the stocks API! Go to /stocks to see available tickers. For more information please refer to documentation on link_to_documentation');
});

app.get('/data', (request, respond) => {
    const {ticker, points} = request.query;
    if(!ticker || !points)respond.send('Please give the ticker and the number of data points as parameters. Example /data?ticker=AAPL&points=20. To get all points enter -1 as a parameter');
    else {
        if(points < 0)
            return_query_json(`select * from ${ticker}`, respond);
        else
            return_query_json(`select * from ${ticker} limit ${points}`, respond);
    }
});

app.listen(4000, () => {
    console.log('API server listening on port 4000');
});
