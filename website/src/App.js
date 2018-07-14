import React, { Component } from 'react';
import './App.css';

import 'antd/dist/antd.css';
import './Components/Searchbox.css'

import { Layout, Menu } from 'antd';
import { Spin, Icon } from 'antd';
import { DatePicker } from 'antd';
import { Card } from 'antd';

// Components
import Searchbox from './Components/Searchbox.js';
import StockChart from './Components/StockChart.js';

const { Header, Content, Sider } = Layout;
const { RangePicker } = DatePicker;
const MenuItemGroup = Menu.ItemGroup;
const { Meta } = Card;

class App extends Component {

    state = {
        data: [],
        stocks: [],
        news: [],
        ticker: 'AAPL',
        start: 0,
        end: Date.now()
    }

    toUnixTimestamp = input => {
        input = input.split(" - ").map(function (date){
        return Date.parse(date+"-0500")/1000;
        }).join(" - ");
    }

    onChange = (date, dateString) => {
        if(!this.arrayExists(date))this.setState({start: 0, end: Date.now()});
        else this.setState({start: date[0].unix(), end: date[1].unix()});
    }

    componentWillMount(){
        this.getStocks();
    }

    getTickers = (data) => {
        return data.map(value => value.Tables_in_DATABASE).filter(value => !value.includes("_"));
    }

    getStocks = () => {
        return fetch(`http://localhost:4000/stocks`)
        .then(response => response.json())
        .then(response => this.setState({stocks: this.getTickers(response.data)}))
        .catch(error => console.log(error));
    }

    getNews = ticker => {
        return fetch(`http://localhost:4000/news?ticker=${ticker}`)
        .then(response => response.json())
        .then(response => this.setState({news: response.data}))
        .catch(error => console.log(error));
    }

    setSelection = ticker => {
        this.setState({ticker: ticker});
        this.getData(ticker);
        this.getNews(ticker);
    }

    renderStock = stock => <Menu.Item key={this.state.stocks.indexOf(stock)+1}>{stock}</Menu.Item>;

    renderCard = ({urlToImage, title, description}) =>
    <Card
        hoverable
        cover={<img alt="thumbnail" src={urlToImage} />}
      >
        <Meta
          title={title}
          description={description}
        />
    </Card>;

    getData = stock => {
        fetch(`http://localhost:4000/data?ticker=${stock}&points=-1`)
        .then(response => response.json())
        .then(response => this.setState({data: response.data }))
        .catch(error => console.log(error));
    }

    arrayExists = val => {
        return (typeof val !== 'undefined' && val.length > 0);
    }

    getClosestIdx = (array, item) => {
        var size = array.length;
        if(item <= array[0])return 0;
        if(item >= array[size-1])return size-1;
        // This is bad. Really bad. I should replace this with a Binary Search at some point...
        var idx = 0;
        while(array[idx] < item)idx++;
        return idx;
    }

    cropData = data => {
        const {start, end} = this.state;
        const dates = data.map(value => value.date);
        var startIdx = this.getClosestIdx(dates, start);
        var endIdx = this.getClosestIdx(dates, end);
        return data.slice(startIdx, endIdx);
    }

    render() {
        const {data, stocks, news, ticker} = this.state;
        if(this.arrayExists(stocks) && !this.arrayExists(data)){
            this.getData(this.state.ticker);
            this.getNews(this.state.ticker)
        }
        if(this.arrayExists(stocks) && this.arrayExists(data)) {
            const chartData = this.cropData(data);
            return (
                <Layout style={{height: '100vh'}} className="layout">
                    <Header style={{textAlign: 'center'}}>
                        <h1 className='logo'>Stocks</h1>
                    </Header>
                    <Layout>
                        <Sider>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={[(this.state.stocks.indexOf(ticker)+1).toString()]}
                                onClick={({item, key, keyPath}) => this.setSelection(stocks[key-1]) }
                                style={{ height: '100%', borderRight: 0}}>

                                <Searchbox stocks={stocks} onSearch={this.setSelection}/>

                                <RangePicker className="searchbox" onChange={this.onChange} />

                                <MenuItemGroup className="scrollable">{stocks.map(this.renderStock)}</MenuItemGroup>
                            </Menu>
                        </Sider>
                    <Layout>
                        <Content className="mainContent">
                            <StockChart
                                data={chartData}
                                ticker={ticker}/>
                        </Content>
                        <Sider className="scrollable" style={{ height: '100vh', background: 'white'}}>
                            <h3>Powered by the NewsAPI</h3>
                            {news.map(this.renderCard)}
                        </Sider>
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
