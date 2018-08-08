import React, { Component } from 'react';

class Settings extends Component {
  handleEnableNotific = () => {
    requestNotificationPermission();
  }
  render() {
    return (
      <div className="settings">
        <button onClick={this.handleEnableNotific}>enable notifications</button>
      </div>
    );
  }
}

function requestNotificationPermission () {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    var notification = new Notification("Already enabled");
  }  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });
  }
}

export default Settings;
