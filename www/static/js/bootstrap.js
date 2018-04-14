const EXECUTION_MODE = module.exports = 'dev'; //dev || prd

if(EXECUTION_MODE==='dev'){
  loadScript("app.js");
} else {  //production
  document.addEventListener('deviceready', ()=>{
    console.debug("Bootstrap - Loading app");
    var appUrl = cordova.file.dataDirectory + "files/app.js";
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fs) => {
      fs.root.getFile("app.js", { create: false, exclusive: false }, (fileEntry) => {
        //loading download app version
        console.debug("Bootstrap - Loaded app from filesystem");
        loadScript(appUrl+"?timestamp="+new Date().getTime());
        console.debug("Bootstrap - Updating new app version for next time...");
        requestNewAppVersion(appUrl);
      }, function(err){
        //loading local file
        console.debug("Bootstrap - Loading packaged app", err);
        loadScript("app.js");
        console.debug("Bootstrap - loading app from cloud...");
        requestNewAppVersion(appUrl);

      });
    }, function(err){
      console.error("Error when tried to request file system", err);
      loadScript("app.js");
    });
  }, false);
}

function loadScript(url){
  var ss = document.createElement("script");
  ss.type = "text/javascript";
  ss.src = url;
  document.getElementsByTagName("body")[0].appendChild(ss);
}

function requestNewAppVersion(appUrl){
  var fileTransfer = new FileTransfer();
  fileTransfer.download("https://storage.googleapis.com/zapt-app-releases/app2.js?timestamp="+new Date().getTime(), appUrl,
    function(entry) {
      console.debug("Bootstrap - loaded new version from cloud", entry);
    },
    function(error) {
      console.debug("Bootstrap - error when tried to load new version from cloud", error);
    },
    false
  );
}
