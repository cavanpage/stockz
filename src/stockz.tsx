import * as React from 'react';
import axios from 'axios';

import './stockz.css';
import logo from './logo.svg';

type StockzProps = {};
type StockzState = {keywords: string[], newkeyword:string, subreddit: string, subRedditPosts:any[], errorMessage:string};

class Stockz extends React.Component<StockzProps, StockzState> {

  popularThreads = ["stockaday", "investing", "BusinessHub", "technology", "SecurityAnalysis", "wallstreetbets","pennystocks","entrepreneur"];

  constructor(props:any){
    super(props);
    this.state = {
      keywords: ["NVIDIA", "INTEL","AMD", "AMZN", "LUV", "ARKW","GERN"],
      newkeyword:'',
      subreddit: this.popularThreads[0],
      subRedditPosts: [],
      errorMessage: ''
    }

    this.searchReddit = this.searchReddit.bind(this);
    this.addKeyword = this.addKeyword.bind(this);
    this.handleKeywordChange = this.handleKeywordChange.bind(this);
    this.handleSubRedditDropdown = this.handleSubRedditDropdown.bind(this);
    this.handleSubRedditChange = this.handleSubRedditChange.bind(this);
  }

  public render() {
    return (
      <div className="stockz">
        <header className="stockz-header">
          <h1 className="stockz-title">stockz</h1>
          <img src={logo} className="stockz-logo" alt="logo" />
        </header>

        <div className="stockz-search">
            <div className="stockz-keywords">
                {this.state.keywords.map((item, index)=> 
                  <div key={index}>
                      <label>{item}</label>
                      <button onClick={() => this.removeKeyword(index)}>remove</button>
                  </div>
                )}
            </div>             
            <br></br>

            <input type="text" name="keyword" value={this.state.newkeyword} onChange={this.handleKeywordChange}></input>
            <button onClick={this.addKeyword}>Add Keyword</button>
            <p>*Note: Keywords ARE case sensitive</p>
            <br></br>
            
            <p>Choose popular sub reddit from dropdown or enter a custom one</p>
            <select onChange={this.handleSubRedditDropdown} >
              {this.popularThreads.map((item, index)=>
                <option key={index}>{item}</option>
              )}
            </select>
            <input type="text" name = "subreddit" value = {this.state.subreddit} onChange={this.handleSubRedditChange}></input>
            <button onClick= {this.searchReddit}>Search SubReddit</button>

            <p className="stockz-error">{this.state.errorMessage}</p>
        </div>

        <div className="stockz-results">
          {this.state.subRedditPosts.map(function(item, index){
              return <div key = {index}>
                        <h3>{item.title}</h3>
                        <a href={item.url}>Go to article</a>
                        <p dangerouslySetInnerHTML={{__html: item.selftext}}></p>
                        <p>Author: {item.author}</p>
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

    if(temp.indexOf(this.state.newkeyword) > -1){
      this.setState({errorMessage: 'keyword already exists in list'})
    }
    else{
      temp.push(this.state.newkeyword);
      this.setState({keywords: temp});
    }

    this.setState({newkeyword: ''})
  }

  public removeKeyword(index:number) {
    this.setState({
      keywords: this.state.keywords.filter((_, i) => i !== index)
    });
  }

  handleSubRedditDropdown(event:any){
    this.setState({subreddit: event.target.value})
  }

  handleSubRedditChange(event: any){
    this.setState({subreddit: event.target.value})
  }

  public searchReddit(){
    let baseURL  = 'https://www.reddit.com';
    let subReddit = this.state.subreddit;//'RobinHood';
    //if(subReddit == '') subReddit = 
    this.setState({subRedditPosts: []})

    if(this.state.subreddit != ''){
      axios.get(baseURL + '/r/'+subReddit + '/new/.json')
      .then(response => this.filterRedditPosts(response.data.data.children));
    }
  }

  public filterRedditPosts(posts:any){
    if(this.state.keywords.length == 0){
      this.setState({subRedditPosts: posts})
    }
    else{
      for(let i = 0; i < posts.length; i++){
        let postTemp = posts[i].data;
        for(let j =0; j < this.state.keywords.length; j++){
          let keyword = this.state.keywords[j];     
          if((postTemp.title.indexOf(keyword) > -1) || (postTemp.selftext.indexOf(keyword) > -1)){

            let indexesSelfText = this.findIndicesOfSubString(postTemp.selftext, keyword);
            //let indexesTitle = this.findIndicesOfSubString(postTemp.selftext, keyword);

            for(let l = 0; l <indexesSelfText.length; l++){
              let pre = '<span class="highlight">';
              let post = '</span>';

              let actualIndex = l;
              if(l != 0) actualIndex = actualIndex + pre.length + post.length;

              postTemp.selftext = this.insertString(postTemp.selftext, indexesSelfText[l], pre);
              postTemp.selftext = this.insertString(postTemp.selftext, indexesSelfText[l]+keyword.length+pre.length, post);
            }

            //postTemp.selftext = postTemp.selftext.slice(1, -1);//remove quotes

            let temp = this.state.subRedditPosts;
            temp.push(postTemp);
            this.setState({subRedditPosts: temp}) ;
            break;
          }
        }
      }  
    }
  }
  
  public findIndicesOfSubString(mainString:string, subString:string): number[]{ 
    let indices = [];
    let i = -1;

    while((i = mainString.indexOf(subString, i +1)) >= 0) indices.push(i);
    return indices;
  }

  public insertString(input:string, index:number, insertText:string){
    return [input.slice(0, index), insertText, input.slice(index)].join('');
  }
}

export default Stockz;