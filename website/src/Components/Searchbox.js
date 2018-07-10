import React, { Component } from 'react';
import { AutoComplete, Input, Button, Icon } from 'antd';

class Searchbox extends Component{

    state = {
        stocks: [],
        options: []
    }

    constructor(props){
        super(props);
        this.state = {stocks: props.stocks, options: []};
    }

    handleSearch = value => {
        const {stocks} = this.state;
        value = value.toUpperCase();
        const searchResult = stocks.filter(ticker => ticker.startsWith(value)===true);
        this.setState({options: searchResult});
    }

    onSelect = searchBox => {
        const {stocks} = this.state;
        console.log(searchBox);
        if(stocks.includes(searchBox))
            this.props.onSearch(searchBox);
    }

    render(){
        const {options} = this.state;
        var searchBox = "";
        return (
            <AutoComplete
                style={{width: '14vh', margin: '5%', alignItems: 'center'}}
                className="global-search"
                dataSource={options}
                onSelect={this.onSelect}
                onSearch={this.handleSearch}
                placeholder="Search ticker"
                onChange={e => searchBox = e}
            >
                <Input
                spellCheck="false"
              />
          </AutoComplete>
        );
    }
};

export default Searchbox;
