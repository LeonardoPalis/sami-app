import createPalette from 'material-ui/styles/palette';
import {muiTheme, getDefaultMuiTheme} from './Theme';
import {createNewMuiTheme} from './Theme';

class ColorManager {

  constructor(){
    this.lastInitPlace = null;
  }

  initDefaultColor(){
    var defaultMuiTheme = getDefaultMuiTheme();
    defaultMuiTheme.palette.primary3Color = "#ffffff";
    defaultMuiTheme.palette.primary2Color = "#cacaca";
    defaultMuiTheme.palette.primary1Color = "#cacaca";
    defaultMuiTheme.palette.secondary = "#cacaca";
    defaultMuiTheme.palette.primary[500] = "#cacaca";
    defaultMuiTheme.palette.accent.A200 = "#cacaca";
    this._initColor(defaultMuiTheme.palette);
    this.lastInitPlace = null;
  }

  _initColor(palette){
    var newMuiTheme = createNewMuiTheme(palette);
    // newMuiTheme.appBar.textColor = palette.primary3Color;
  }
}

export default new ColorManager();
