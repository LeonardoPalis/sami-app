/**
 * In this file, we create a React component
 * which incorporates components providedby material-ui.
 */
import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
let moment = require('moment');
global.SEEDURL = "http://192.168.1.10:3000";
const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
  },
};

class Main extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.state = {
      checkins: [],
      open: false,
      loading: true,
      openCheckins: false,
      disabled: true,
      isChecked: false,
      day: "0",
      month: "0",
      year: "0",
      hours: "0",
      minutes: "0",
      seconds: "0"
    };


  }

  handleRequestClose() {
    window.location.reload();
    this.setState({
      open: false,
    });
  }

  checkinsHandleRequestOpen() {
    this.setState({
      openCheckins: true,
    });
  }

  handleTouchTap() {

    var obj = new Object();
    let date = new Date().getTime();
    obj.timestamp  = date;
    var jsonString= JSON.stringify(obj);
    var url = global.SEEDURL + "/checkins/SM-J510MN@1eb35523c3295ff@b71fc425";
    fetch(url, { method: "POST", headers: {"Content-Type": "application/json; charset=utf-8"}, body: JSON.stringify({ "timestamp": new Date().getTime() }) });
    this.setState({
      open: true,
      loading: false,
      isChecked: true,
      c_day: this.state.day,
      c_month: this.state.month,
      c_year: this.state.year,
      c_hours: this.state.hours,
      c_minutes: this.state.minutes,
      c_seconds: this.state.seconds
    });
  }

  setTime(){

    var date = new Date();
    var current_day = date.getDate();
    var current_month = date.getMonth() + 1;
    var current_year = date.getFullYear();
    var current_hour = date.getHours();
    var current_minute = date.getMinutes();
    var current_second = date.getSeconds();
    current_day = current_day.toString();
    current_month = current_month.toString();
    current_year = current_year.toString();
    current_hour = current_hour.toString();
    current_minute = current_minute.toString();
    current_second = current_second.toString();
    current_day = (current_day.length == 1) ? "0" + current_day : current_day;
    current_month = (current_month.length == 1) ? "0" + current_month : current_month;
    current_hour = (current_hour.length == 1) ? "0" + current_hour : current_hour;
    current_minute = (current_minute.length == 1) ? "0" + current_minute : current_minute;
    current_second = (current_second.length == 1) ? "0" + current_second : current_second;
    this.setState({
      day: current_day,
      month: current_month,
      year: current_year,
      hours: current_hour,
      minutes: current_minute,
      seconds: current_second
    });
  }

  componentWillUnmout(){
    clearInterval(this.intervalId);
  }

  componentDidMount(){
    var r = "";
    document.addEventListener("deviceready", () => {
     this.state = {
       disabled: false
     };
     console.log(device.model + "@" + device.uuid + "@" + device.serial)
    }, false);
    var url = global.SEEDURL + "/checkins/SM-J510MN@1eb35523c3295ff@b71fc425";
    fetch(url, { method: "GET" }).then((response)=>{
      response.json().then((value)=>{
        console.log(value[0]["timestamp"]);
        this.setState({checkins: value, loading: false});
      });
    });
    this.intervalId = window.setInterval(()=> {
     this.setTime();
   }, 500);


  }

  render() {

    const tmp = (
      this.state.checkins != null ?
        this.state.checkins.map((item) => {
          var dateNow = new Date(item.timestamp);

          return (
            <div>
              <label>{
                moment(item.timestamp).isSame(Date.now(), 'day') ?
                moment(dateNow).format('LLLL') : ""
              }</label>
            </div>
          )
        }) : ""
    );


    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>

          <Dialog
            open={this.state.open}
            title="Done!"
            actions={standardActions}
            onRequestClose={this.handleRequestClose}
          >
          Your ckeckin was done!
          </Dialog>
          <h1>Welcome to SAMI API!</h1>

          { this.state.loading ?
              <h3>Loading...</h3>
            : <h3>Today:</h3>
          }


          <div className="card-prop">
            {tmp}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
