var styles = {
  appbar: {
    position: 'fixed',
    color:global.muiTheme ? global.muiTheme.palette.primary3Color : "#ffffff"
  },
  linkHome: {
    marginRight: 0
  },
  bodyStyle: {
    height:"30%",
    margin: "auto",
    paddingTop: "50px"
  },
  homeCard:{
    marginTop: "10px",
    margin: "auto"
  },
  homeCardFirst:{
    marginTop: "18px",
    margin: "auto"
  },
  homeCardHeader:{
    paddingTop: "0px",
    marginTop: "10px"
  },
  homeRaisedButton: {
    minWidth: "31%",
    height: "90px",
    marginRight: "4px",
    marginLeft: "4px"
  },
  lastHomeRaisedButton: {
    minWidth: "30%",
    height: "90px",
    marginRight: "4px",
    marginLeft: "4px"
  },
  linearProgress: {
    position: "fixed",
    backgroundColor: "white",
    zIndex: 100,
    paddingTop:"9px",
    marginTop: "-20px"
  },
  card: {
    width:"95%",
    margin: "auto",
    marginBottom: "5px",
    height: "100%",
    marginTop: "25px"
  },
  refresh: {
    position: 'absolute',
    left: -20,
    right: 0,
    top: "calc(50% - 50px)",
    bottom: 0,
    transform: "translate3d(10px, 10px, 0px)",
    margin: "auto",
    width: "60px"
  },
  linkCards: {
    textDecoration: "none",
    marginRight: "0px"
  },
  nocarddiv: {
    marginTop: "40px",
    marginLeft: '10px'
  },
  nocard: {
    position: 'fixed',
    fontSize: "136px",
    top: "50%",
    left: "31%",
    color: "#cac7c7"
  },
  nocardmessage: {
    fontSize: "25px",
    marginTop: "15%",
    textAlign: "center"
  },
  ops: {
    fontSize: "40px",
    textAlign: "center",
    marginTop: "0"
  },
  refreshText: {
    fontSize: "15px"
  },
  iconButtonLarge: {
    fontSize: "48px"
  },
  largeIcon: {
    width: 60,
    height: 60,
  },
  nothingFoundPage: {
    width: "95%",
    marginLeft: "10px",
    textAlign: "center"
  },
  smallIcon: {
    fontSize: "20px !important"
  },
  toggleTrack: {
    width: "80%",
    height: "10px",
    marginTop: "2px"
  },
  toggle: {
    marginTop: "13px"
  },
  regionsListing: {
    cardStyleFirst:{
      marginTop: "18px",
      marginBottom: "0px",
      marginLeft: "4px",
      marginRight: "4px"
    },
    cardStyle:{
      marginTop: "7px",
      marginBottom: "0px",
      marginLeft: "4px",
      marginRight: "4px"
    },
    avatarSize: 70,
    cardHeader: {
      paddingBottom: "2px"
    },
    cardHeaderText: {
      paddingRight: "2px"
    },
    cardText: {
      paddingTop: "0px",
      paddingBottom: "5px"
    },
    cardAction: {
      paddingTop: "0px"
    },
    filterText: {
      width: "75%",
      marginLeft: "20px",
      marginRight: "5px",
      textColor: "#ffffff",
      hintColor: muiTheme.palette.hintStyle,
      floatingLabelColor: muiTheme.palette.hintStyle,
      focusColor: "#ffffff",
      position: "absolute",
      left: "50px",
      color: muiTheme.palette.primary3Color,
      top: "15px"
    }
  },
  places: {
    cardStyleFirst:{
      marginTop: "18px",
      marginBottom: "0px",
      marginLeft: "4px",
      marginRight: "4px",
      height: "178px"
    },
    cardStyle:{
      marginTop: "7px",
      marginBottom: "0px",
      marginLeft: "4px",
      marginRight: "4px",
      height: "178px"
    },
    avatarSize: 70,
    cardHeader: {
      paddingBottom: "2px"
    },
    cardHeaderText: {
      paddingRight: "2px",
      minHeight: "115px"
    },
    cardAction: {
      paddingTop: "0px",
      paddingBottom: "0px",
      position: "relative",
      top: "-30px",
      textAlign: "center"
    }
  },
  homeFilterText: {
    width: "75%",
    marginLeft: "20px",
    marginRight: "10px",
    textColor: (muiTheme.palette.primary3Color || muiTheme.palette.hintStyle),
    hintColor: muiTheme.palette.hintStyle,
    floatingLabelColor: muiTheme.palette.hintStyle,
    focusColor: (muiTheme.palette.primary3Color || muiTheme.palette.hintStyle),
    position: "absolute",
    left: "50px",
    top: "15px"
  },
  underlineFilterText: function(){
    return {
      borderTop: "none " + (muiTheme.palette.primary3Color || muiTheme.palette.hintStyle),
      borderRight: "none " + (muiTheme.palette.primary3Color || muiTheme.palette.hintStyle),
      borderBottom: "1px solid " + (muiTheme.palette.primary3Color || muiTheme.palette.hintStyle),
      borderLeft: "none " + (muiTheme.palette.primary3Color || muiTheme.palette.hintStyle),
      borderColor: muiTheme.palette.primary3Color || muiTheme.palette.hintStyle
    };
  },
  underlineFocusFilterText: function(){
    return {
      borderTop: "none " + (muiTheme.palette.primary3Color || muiTheme.palette.hintStyle),
      borderRight: "none " + (muiTheme.palette.primary3Color || muiTheme.palette.hintStyle),
      borderBottom: "1px solid " + + (muiTheme.palette.primary3Color || muiTheme.palette.hintStyle),
      borderLeft: "none " + (muiTheme.palette.primary3Color || muiTheme.palette.hintStyle),
      borderColor: (muiTheme.palette.primary3Color || muiTheme.palette.hintStyle)
    };
  },
  primary3Color: function(){
    return global.muiTheme.palette.primary3Color || "#ffffff";
  },
  tryAgainButton: {
    top: "64%",
    marginBottom: "5%"
  },
  about: {
    marginTop:"38px",
    marginLeft: "30px",
    marginRight: "30px"
  },
  imageResponsive: {
    maxWidth: "100%",
    height: "100%",
    width: "100%"
  }
};

module.exports = styles;
