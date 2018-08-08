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
    axios.get('http://localhost:3001/acolyte').then((res) => {
      console.log(res.data);
      this.setState({
        acolytes: _.mapKeys(res.data, 'LocTag'),
      })
    })
    socket.on('refresh-acolytes', ({data}) => {
      console.log(data);
      this.setState({
        acolytes: _.mapKeys(data, 'LocTag')
      })
    });
  }
  notification = (name) => {
    if (Notification.permission === "granted")  {
      if(!this.state.discovered.find((acolyte) => {
        return acolyte === name;
      })) {
        var notification = new Notification(`${name} is DETECTED!`);
        this.setState({
          discovered: _.map(this.state.acolytes, ({Discovered, LocTag}) => {
            return Discovered ? LocTag : false;
          })
        })
      }
    }
  }
  render() {
    if(!this.state.acolytes) {return (<div></div>)}
      const acolytes = _.map(this.state.acolytes, acolyte => {
        if(acolyte.Discovered) {
          this.notification(acolyte.LocTag);
        }
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
