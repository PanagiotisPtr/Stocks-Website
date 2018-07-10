import React, { Component } from 'react';
import './App.css';

import { Line } from 'react-chartjs-2';

import 'antd/dist/antd.css';

import { Layout, Menu } from 'antd';
import { AutoComplete, Icon, Input, Button } from 'antd';

const { Header, Content, Sider, Footer } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class App extends Component {

    state = {
        data: [],
        stocks: [],
        options: [],
        ticker: 'AAPL'
    }

    componentDidMount(){
        this.getStocks();
    }

    getStocks(){
        fetch(`http://localhost:4000/stocks`)
        .then(response => response.json())
        .then(response => this.setState({stocks: response.data.map(value => value.table_name)}))
        .then(_ => this.getData(this.state.stocks[0]))
        .catch(error => console.log(error));
    }

    handleSearch(value){
        value = value.toUpperCase();
        const {data, stocks, options, ticker} = this.state;
        const search_result = stocks.filter(ticker => ticker.startsWith(value)===true);
        this.setState({
            data: data,
            stocks: stocks,
            options: search_result,
            ticker: ticker
        });
    }

    onSelect(value) {
        console.log('onSelect', value);
    }

    timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var time = date + ' ' + month + ' ' + year;
        return time;
    }

    renderStock = stock => <Menu.Item key={this.state.stocks.indexOf(stock)+1}>{stock}</Menu.Item>;

    getData = stock => {
        fetch(`http://localhost:4000/data?ticker=${stock}&points=-1`)
        .then(response => response.json())
        .then(response => this.setState({data: response.data }))
        .catch(error => console.log(error));
    }

    render() {
        const {data, stocks, options, ticker} = this.state;
        var searchBox = "";
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
                            onClick={({item, key, keyPath}) => this.getData(stocks[key-1])}
                            style={{ height: '100%', borderRight: 0}}>

                            <AutoComplete
                                style={{width: '14vh', margin: '5%', alignItems: 'center'}}
                                className="global-search"
                                dataSource={options}
                                onSearch={this.handleSearch}
                                placeholder="Search ticker"
                                onChange={e => searchBox = e}
                            >
                                <Input
                                suffix={(
                                  <Button
                                      className="search-btn"
                                      size="default"
                                      onClick={() => {
                                          console.log(searchBox);
                                          if(stocks.includes(searchBox))this.getData(searchBox);
                                      }}
                                      type="primary">
                                    <Icon type="search" />
                                  </Button>
                                )}
                              />
                          </AutoComplete>
                            <MenuItemGroup key="g1" className="scrollable">
                            {stocks.map(this.renderStock)}
                            </MenuItemGroup>
                        </Menu>
                    </Sider>
                <Layout>
                    <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                        <Line
                            data={{
                                labels: data.map(value => value.date).map(value => this.timeConverter(value)),
                                datasets: [{
                                    data: data.map(value => value.close),
                                    label: {ticker},
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
    }
}

export default App;
