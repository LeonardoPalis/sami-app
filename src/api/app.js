import constants from './constants';
import BaseView from './view/BaseView';
import React, {Component} from 'react';
import {Link, hashHistory} from 'react-router';
import Dialog from 'material-ui/Dialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Drawer from 'material-ui/Drawer';
import {MenuItem} from 'material-ui/Menu';
import MenuIcon from 'material-ui-icons/Menu';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
import Grid from 'material-ui/Grid';
import muiTheme from './util/looknfeel/Theme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {withStyles, createStyleSheet} from 'material-ui/styles';
import {bodyStyle, appbar, appbarIconLeft, primary3Color} from './view/styles';
import cardService from './service/CardService';
import i18nService from './service/I18nService';
import {sendEvent, getWidth} from './util';
import {beaconMonitoringService} from './service/BeaconMonitoringService';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


const DRAWER_WIDTH = "225px";
let menuOpen = false;

const backButtonRoutes = {
  "card": true,
  "place": true
}

export function onChangeRoute(route){

  window.scrollTo(0, 0);
  menuOpen = false;
  var splitted = window.location.hash.split("/");
  var hash;
  if(splitted.length>1){
    hash = splitted[1].substr(0,window.location.hash.indexOf('?')-2);
  } else {
    hash = window.location.hash.substr(2,window.location.hash.indexOf('?')-2);
  }
  var isBackButton = false;
  for(var keys in backButtonRoutes){
    if(hash === keys){
      isBackButton = true;
      break;
    }
  }

  sendEvent("backButton", isBackButton);
}

export class App extends BaseView {

  constructor(props, context){
    super(props, context);
    var self = this;

    this.cardService = cardService;
    this.handleTouchTapLeftIconButton = this.handleTouchTapLeftIconButton.bind(this);
    this.state = {
      placeName: "Zapt",
      muiTheme: muiTheme,
      labels: {},
      subtitleDescription: ""
    };
    this.lastTap = new Date().getTime() - TAP_TIME;
    window.addEventListener('changeAppBar', (event) =>
      this.changeAppBar(event)
    );
    window.addEventListener('changeSubtitle', (event) =>
      this.changeSubtitle(event)
    );
    window.addEventListener('backButton', (event) =>
      this.manageBackButton(event)
    );
    window.addEventListener('changeBackgroundColor', (event) =>
      this.changeBackgroundColor(event)
    );
    window.addEventListener('changeName', (event) =>
      this.changeName(event.detail)
    );
  }

  handleTouchTapLeftIconButton(){

    if(this.state.appBarLeftIcons){
      this.goBack();
    } else {
      menuOpen = !menuOpen;
      this.setState(this.state);
    }
  }

  handleTouchTap(){

    hashHistory.push('/');
  }

  componentDidMount() {
    this.initZaptColors();
    i18nService.loadLabels().then((labels)=>{
      this.state.labels = labels;
      this.setState(this.state);
    });

    if(cordova && cordova.plugins && cordova.plugins.permissions){
      var permissions = cordova.plugins.permissions;
      permissions.requestPermissions([permissions.ACCESS_COARSE_LOCATION, permissions.ACCESS_FINE_LOCATION, permissions.BLUETOOTH, permissions.ACCESS_WIFI_STATE], function(result){
      }, null);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('changeAppBar', this.changeAppBar);
    window.removeEventListener('changeSubtitle', this.changeSubtitle);
    window.removeEventListener('changeBackgroundColor', this.changeBackgroundColor);
    window.removeEventListener('changeName', this.changeName);
  }

  changeAppBar(event){
    var eventDetail = event.detail;
    this.state.appBarRightIcons = eventDetail;
    this.setState(this.state);
  }

  changeName(name){
    this.state.placeName = name;
    this.changeSubtitle({"detail": this.state.subtitleDescription + " "})
    this.setState(this.state);
  }

  goBack(){
    this.state.appBarLeftIcons = undefined;
    this.setState(this.state);
    hashHistory.goBack();
  }

  manageBackButton(event){
    if(!event || event.detail){
      this.state.appBarLeftIcons = (
        <IconButton disableRipple className="small-icon" onClick={() => this.goBack()}>
          <Icon style={{color:this.state.muiTheme && this.state.muiTheme.palette && this.state.muiTheme.palette.primary3Color ? this.state.muiTheme.palette.primary3Color :  "#ffffff"}}>
            &#xE317;
          </Icon>
        </IconButton>
      );
    } else {
      this.state.appBarLeftIcons = undefined;
    }
    this.setState(this.state);
  }

  changeSubtitle(event){
    this.state.subtitleDescription = event.detail;
    if(!event.detail){
      this.state.subtitleDescription = "";
    }
    this.setState(this.state);
  }

  changeBackgroundColor(event){
    this.state.muiTheme = event.detail;
    if(this.state.appBarLeftIcons){
      this.manageBackButton();
    }
    this.setState(this.state);
  }

  onRequestChange(open) {
    menuOpen = open;
    this.setState(this.state);
  }

  render(){
    return (
      <MuiThemeProvider muiTheme={this.state.muiTheme}>
        <div>
          <AppBar style={appbar} title={<div><span className="header-subtitle" style={{color:primary3Color()}}>{this.state.subtitleDescription}</span></div>}>
            <Toolbar>
              {this.state.appBarLeftIcons != null ?
                this.state.appBarLeftIcons
                :
                <IconButton disableRipple color="contrast" onClick={this.handleTouchTapLeftIconButton}>
                  <MenuIcon />
                </IconButton>
              }
              <Typography type="title" color="inherit">{this.state.subtitleDescription}</Typography>
              <Grid container justify="flex-end">
                {this.state.appBarRightIcons}
              </Grid>
            </Toolbar>
          </AppBar>
          <Drawer style={{width: DRAWER_WIDTH}} open={menuOpen} onRequestClose={this.handleTouchTapLeftIconButton.bind(this)}>
            <AppBar style={appbar} title={<div><span className="header-subtitle" style={{color:primary3Color()}}>{this.state.subtitleDescription}</span></div>}>
              <Toolbar>
                <IconButton disableRipple color="contrast" onClick={this.handleTouchTapLeftIconButton}>
                  <MenuIcon />
                </IconButton>
                <span className={this.state.placeName==="Zapt" ? "appbar" : "appbar-custom-name"}>{this.state.placeName}</span>
              </Toolbar>
            </AppBar>
            <Link className="a-menu-item" to="map" style={{width: DRAWER_WIDTH, marginTop: "65px"}}><MenuItem><Icon>map</Icon><span className="menu-item">{this.state.labels["menuItemMap"]}</span></MenuItem></Link>
            <Link className="a-menu-item" to="info" style={{width: DRAWER_WIDTH}}><MenuItem><Icon>&#xE569;</Icon><span className="menu-item">{this.state.labels["menuItemHotspots"]}</span></MenuItem></Link>
            <Link className="a-menu-item" to="tour" style={{width: DRAWER_WIDTH}}><MenuItem><Icon>&#xE438;</Icon><span className="menu-item">{this.state.labels["menuItemTour"]}</span></MenuItem></Link>
            <Link className="a-menu-item" to={{ pathname: '/places', query: {avoidRedirect: true }}} style={{width: DRAWER_WIDTH}}><MenuItem><span><Icon className="material-icons">place</Icon><span className="menu-item">{this.state.labels["menuItemPlaces"]}</span></span></MenuItem></Link>
            <Link className="a-menu-item" to="restrooms"><MenuItem><Icon>wc</Icon><span className="menu-item" style={{width: DRAWER_WIDTH}}>{this.state.labels["menuItemRestroom"]}</span></MenuItem></Link>
            <Link className="a-menu-item" to="food"><MenuItem><Icon>restaurant</Icon><span className="menu-item" style={{width: DRAWER_WIDTH}}>{this.state.labels["menuItemFeed"]}</span></MenuItem></Link>
            <Link className="a-menu-item" to="exit"><MenuItem><Icon>&#xE879;</Icon><span className="menu-item" style={{width: DRAWER_WIDTH}}>{this.state.labels["menuItemExit"]}</span></MenuItem></Link>
            <Link className="a-menu-item" to="about"><MenuItem><Icon>help</Icon><span className="menu-item" style={{width: DRAWER_WIDTH}}>{this.state.labels["menuItemAbout"]}</span></MenuItem></Link>
          </Drawer>
          <div id="body" style={bodyStyle}>
            {this.props.children}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
};
