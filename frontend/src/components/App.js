import React, { Component } from 'react';
import axios from 'axios';
import Settings from './settings';
import { socket } from './socket';
import _ from 'lodash';

class App extends Component {
  state = {
    acolytes: {},
    discovered: []
  }
  componentDidMount() {
    axios.get(`${process.env.REACT_APP_API_URL}/acolyte`).then(({ data }) => {
      this.handleRefresh(data);
    })
    socket.on('refresh-acolytes', ({data}) => {
      console.log(data);
      this.handleRefresh(data);
    });
  }

  handleRefresh = (data) => {
    var discovered = [];
    for(let key in data) {
      if(data[key].Discovered) {
        var name = data[key].LocTag;
        discovered.push(name);
        if(!this.state.discovered.find((acolyte) => acolyte === name)) {
          this.notification(name);
        }
      }
    }

    this.setState({
      acolytes: _.mapKeys(data, 'LocTag'),
      discovered
    })
  }

  notification = (name) => {
    if (Notification.permission === "granted")  {
      var notification = new Notification(`${name} is DETECTED!`);
    }
  }
  render() {
    if(!this.state.acolytes) {return (<div></div>)}
      const acolytes = _.map(this.state.acolytes, acolyte => {
        return (
          <h1 key={acolyte.LocTag} className="App-title">{acolyte.LocTag}: {acolyte.Discovered ? 'YES' : 'NO'}</h1>
        )
      });
    return (
      <div className="App">
        <header className="App-header">
          {acolytes}
        </header>
        <div>
          <Settings />
        </div>
      </div>
    );
  }
}

export default App;
