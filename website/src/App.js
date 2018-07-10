import React, { Component } from 'react';
import './App.css';

import { Line } from 'react-chartjs-2';

import 'antd/dist/antd.css';

import { Layout, Menu } from 'antd';
import { Spin, Icon } from 'antd';

// Custom
import Searchbox from './Components/Searchbox.js'

const { Header, Content, Sider } = Layout;

const MenuItemGroup = Menu.ItemGroup;

class App extends Component {

    state = {
        data: [],
        stocks: [],
        ticker: 'A'
    }

    componentWillMount(){
        this.getStocks();
    }

    getStocks = () => {
        return fetch(`http://localhost:4000/stocks`)
        .then(response => response.json())
        .then(response => this.setState({stocks: response.data.map(value => value.table_name)}))
        .catch(error => console.log(error));
    }

    setSelection = (ticker) => {
        this.setState({ticker: ticker});
        this.getData(ticker);
    }

    renderStock = stock => <Menu.Item key={this.state.stocks.indexOf(stock)+1}>{stock}</Menu.Item>;

    timeConverter = UNIX_timestamp => {
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var time = date + ' ' + month + ' ' + year;
        return time;
    }

    getData = stock => {
        fetch(`http://localhost:4000/data?ticker=${stock}&points=-1`)
        .then(response => response.json())
        .then(response => this.setState({data: response.data }))
        .catch(error => console.log(error));
    }

    arrayExists(val){
        return (typeof val !== 'undefined' && val.length > 0);
    }

    render() {
        const {data, stocks, ticker} = this.state;
        console.log(ticker);
        if(this.arrayExists(stocks) && !this.arrayExists(data))this.getData(this.state.stocks[0]);
        if(this.arrayExists(stocks) && this.arrayExists(data)) {
            return (
                <Layout style={{height: '100vh'}} className="layout">
                    <Header style={{textAlign: 'center'}}>
                        <h1 className='logo'>Stocks</h1>
                    </Header>
                    <Layout>
                        <Sider>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                onClick={({item, key, keyPath}) => this.setSelection(stocks[key-1]) }
                                style={{ height: '100%', borderRight: 0}}>

                                <Searchbox stocks={stocks} onSearch={this.setSelection}/>

                                <MenuItemGroup key="g1" className="scrollable">{stocks.map(this.renderStock)}</MenuItemGroup>
                            </Menu>
                        </Sider>
                    <Layout>
                        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                            <Line
                                data={{
                                    labels: data.map(value => value.date).map(value => this.timeConverter(value)),
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
                        </Content>
                    </Layout>
                    </Layout>
                </Layout>
            );
        }else{
            const loadingIcon = <Icon type="loading" style={{ fontSize: 86 }} spin />;
            return (<div className='centerItem'><Spin indicator={loadingIcon} /></div>);
        }
    }
}

export default App;
