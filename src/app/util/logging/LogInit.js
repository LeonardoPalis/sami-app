import EXECUTION_MODE from '../../execution-mode';

var logger = require('loglevel');
logger.disableAll();
if(EXECUTION_MODE==='dev'){
  var defaultLevel = 'trace';
} else {
  var defaultLevel = 'silent';
}
logger.setDefaultLevel(defaultLevel);
logger.setLevel(defaultLevel);
//overriding default logger.
console.log = logger.info;
console.error = logger.error;
console.warn = logger.warn;
console.debug = logger.debug;

global.logger = logger;
