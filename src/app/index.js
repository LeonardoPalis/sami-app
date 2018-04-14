import {render} from 'react-dom';
import LogInit from './util/logging/LogInit';
import AppRouting from './routes';

render(AppRouting, document.getElementById('app'));
window.appLoaded = true;
