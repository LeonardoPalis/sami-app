import createPalette from 'material-ui/styles/palette';
import {createMuiTheme} from 'material-ui/styles';
import { indigo, orange } from 'material-ui/colors';



export function createNewMuiTheme(palette){
  global.muiTheme = createMuiTheme({
    palette: palette,
  });
  return global.muiTheme;
}

export function getDefaultMuiTheme(){
  var theme = createMuiTheme(createPalette({
    primary: indigo,
    secondary: orange
  }));
  global.muiTheme = theme;
  return theme;
}

export const defaultMuiTheme = getDefaultMuiTheme();
