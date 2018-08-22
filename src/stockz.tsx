import * as React from 'react';
import axios from 'axios';

import './stockz.css';
import logo from './logo.svg';

type StockzProps = {};
type StockzState = {keywords: string[], newkeyword:string, subreddit: string, subRedditPosts:any[]};

class Stockz extends React.Component<StockzProps, StockzState> {

  constructor(props:any){
    super(props);
    this.state = {
      keywords: ["NVIDIA", "INTEL","AMD"],
      newkeyword:'',
      subreddit: 'robinhood',
      subRedditPosts: []
    }

    this.searchReddit = this.searchReddit.bind(this);
    this.addKeyword = this.addKeyword.bind(this);
    this.handleKeywordChange = this.handleKeywordChange.bind(this);
    this.handleSubRedditChange = this.handleSubRedditChange.bind(this)
  }

  public render() {
    return (
      <div className="stockz">
        <header className="stockz-header">
          <h1 className="stockz-title">stockz</h1>
          <img src={logo} className="stockz-logo" alt="logo" />
        </header>

        <div className="stockz-search">
        <div className="stockz-keywords"></div>
            {this.state.keywords.map((item, index)=> 
               <div key={index}>
                  <b>{item}</b>
                  <button onClick={() => this.removeKeyword(index)}>remove</button>
              </div>
            )}
          <input type="text" name="keyword" value={this.state.newkeyword} onChange={this.handleKeywordChange}></input>
          <button onClick={this.addKeyword}>Add</button>
          <br></br>
          <input type="text" name = "subreddit" value = {this.state.subreddit} onChange={this.handleSubRedditChange}></input>
          <button onClick= {this.searchReddit}>Search SubReddit</button>
        </div>

        <div className="stockz-results">
          {this.state.subRedditPosts.map(function(item, index){
              return <div key = {index}>
                        <h3>{item.data.title}</h3>
                        <a href={item.data.url}>Go to article</a>
                        <p>{item.data.selftext}</p>
                        <p>Author: {item.data.author}</p>
                      </div>
            })}
        </div>
      </div>
    );
  }

  public handleKeywordChange(event:any){
    this.setState({newkeyword: event.target.value})
  }
  
  public addKeyword(){
    let temp = this.state.keywords;
    temp.push(this.state.newkeyword);
    this.setState({keywords: temp});
  }

  public removeKeyword(index:number) {
    this.setState({
      keywords: this.state.keywords.filter((_, i) => i !== index)
    });
  }

  handleSubRedditChange(event: any){
    this.setState({subreddit: event.target.value})
  }

  public searchReddit(){
    let baseURL  = 'https://www.reddit.com';
    let subReddit = this.state.subreddit;//'RobinHood';
    this.setState({subRedditPosts: []})

    if(this.state.subreddit != ''){
      axios.get(baseURL + '/r/'+subReddit + '.json?limit=5')
      .then(response => this.filterRedditPosts(response.data.data.children));//this.setState({subRedditPosts: response.data.data.children}));//this.setState({response : response}))
    }
  }

  public filterRedditPosts(posts:any){
    
    for(let i = 0; i < posts.length; i++){
      for(let j =0; j < this.state.keywords.length; j++){
        if( (posts[i].data.title.indexOf(this.state.keywords[j]) > -1) || (posts[i].data.selftext.indexOf(this.state.keywords[j]) > -1)){
          let temp = this.state.subRedditPosts;
          temp.push(posts[i]);
          this.setState({subRedditPosts: temp}) ;
          break;
        }
      }
    }   
  }
}

export default Stockz;