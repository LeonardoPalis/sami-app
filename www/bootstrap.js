(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var EXECUTION_MODE = module.exports = 'dev'; //dev || prd

if (EXECUTION_MODE === 'dev') {
  loadScript("app.js");
} else {
  //production
  document.addEventListener('deviceready', function () {
    console.debug("Bootstrap - Loading app");
    var appUrl = cordova.file.dataDirectory + "files/app.js";
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
      fs.root.getFile("app.js", { create: false, exclusive: false }, function (fileEntry) {
        //loading download app version
        console.debug("Bootstrap - Loaded app from filesystem");
        loadScript(appUrl + "?timestamp=" + new Date().getTime());
        console.debug("Bootstrap - Updating new app version for next time...");
        requestNewAppVersion(appUrl);
      }, function (err) {
        //loading local file
        console.debug("Bootstrap - Loading packaged app", err);
        loadScript("app.js");
        console.debug("Bootstrap - loading app from cloud...");
        requestNewAppVersion(appUrl);
      });
    }, function (err) {
      console.error("Error when tried to request file system", err);
      loadScript("app.js");
    });
  }, false);
}

function loadScript(url) {
  var ss = document.createElement("script");
  ss.type = "text/javascript";
  ss.src = url;
  document.getElementsByTagName("body")[0].appendChild(ss);
}

function requestNewAppVersion(appUrl) {
  var fileTransfer = new FileTransfer();
  fileTransfer.download("https://storage.googleapis.com/zapt-app-releases/app2.js?timestamp=" + new Date().getTime(), appUrl, function (entry) {
    console.debug("Bootstrap - loaded new version from cloud", entry);
  }, function (error) {
    console.debug("Bootstrap - error when tried to load new version from cloud", error);
  }, false);
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvd3d3L3N0YXRpYy9qcy9ib290c3RyYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQU0saUJBQWlCLE9BQU8sT0FBUCxHQUFpQixLQUF4QyxDLENBQStDOztBQUUvQyxJQUFHLG1CQUFpQixLQUFwQixFQUEwQjtBQUN4QixhQUFXLFFBQVg7QUFDRCxDQUZELE1BRU87QUFBRztBQUNSLFdBQVMsZ0JBQVQsQ0FBMEIsYUFBMUIsRUFBeUMsWUFBSTtBQUMzQyxZQUFRLEtBQVIsQ0FBYyx5QkFBZDtBQUNBLFFBQUksU0FBUyxRQUFRLElBQVIsQ0FBYSxhQUFiLEdBQTZCLGNBQTFDO0FBQ0EsV0FBTyxpQkFBUCxDQUF5QixnQkFBZ0IsVUFBekMsRUFBcUQsQ0FBckQsRUFBd0QsVUFBQyxFQUFELEVBQVE7QUFDOUQsU0FBRyxJQUFILENBQVEsT0FBUixDQUFnQixRQUFoQixFQUEwQixFQUFFLFFBQVEsS0FBVixFQUFpQixXQUFXLEtBQTVCLEVBQTFCLEVBQStELFVBQUMsU0FBRCxFQUFlO0FBQzVFO0FBQ0EsZ0JBQVEsS0FBUixDQUFjLHdDQUFkO0FBQ0EsbUJBQVcsU0FBTyxhQUFQLEdBQXFCLElBQUksSUFBSixHQUFXLE9BQVgsRUFBaEM7QUFDQSxnQkFBUSxLQUFSLENBQWMsdURBQWQ7QUFDQSw2QkFBcUIsTUFBckI7QUFDRCxPQU5ELEVBTUcsVUFBUyxHQUFULEVBQWE7QUFDZDtBQUNBLGdCQUFRLEtBQVIsQ0FBYyxrQ0FBZCxFQUFrRCxHQUFsRDtBQUNBLG1CQUFXLFFBQVg7QUFDQSxnQkFBUSxLQUFSLENBQWMsdUNBQWQ7QUFDQSw2QkFBcUIsTUFBckI7QUFFRCxPQWJEO0FBY0QsS0FmRCxFQWVHLFVBQVMsR0FBVCxFQUFhO0FBQ2QsY0FBUSxLQUFSLENBQWMseUNBQWQsRUFBeUQsR0FBekQ7QUFDQSxpQkFBVyxRQUFYO0FBQ0QsS0FsQkQ7QUFtQkQsR0F0QkQsRUFzQkcsS0F0Qkg7QUF1QkQ7O0FBRUQsU0FBUyxVQUFULENBQW9CLEdBQXBCLEVBQXdCO0FBQ3RCLE1BQUksS0FBSyxTQUFTLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBVDtBQUNBLEtBQUcsSUFBSCxHQUFVLGlCQUFWO0FBQ0EsS0FBRyxHQUFILEdBQVMsR0FBVDtBQUNBLFdBQVMsb0JBQVQsQ0FBOEIsTUFBOUIsRUFBc0MsQ0FBdEMsRUFBeUMsV0FBekMsQ0FBcUQsRUFBckQ7QUFDRDs7QUFFRCxTQUFTLG9CQUFULENBQThCLE1BQTlCLEVBQXFDO0FBQ25DLE1BQUksZUFBZSxJQUFJLFlBQUosRUFBbkI7QUFDQSxlQUFhLFFBQWIsQ0FBc0Isd0VBQXNFLElBQUksSUFBSixHQUFXLE9BQVgsRUFBNUYsRUFBa0gsTUFBbEgsRUFDRSxVQUFTLEtBQVQsRUFBZ0I7QUFDZCxZQUFRLEtBQVIsQ0FBYywyQ0FBZCxFQUEyRCxLQUEzRDtBQUNELEdBSEgsRUFJRSxVQUFTLEtBQVQsRUFBZ0I7QUFDZCxZQUFRLEtBQVIsQ0FBYyw2REFBZCxFQUE2RSxLQUE3RTtBQUNELEdBTkgsRUFPRSxLQVBGO0FBU0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgRVhFQ1VUSU9OX01PREUgPSBtb2R1bGUuZXhwb3J0cyA9ICdkZXYnOyAvL2RldiB8fCBwcmRcblxuaWYoRVhFQ1VUSU9OX01PREU9PT0nZGV2Jyl7XG4gIGxvYWRTY3JpcHQoXCJhcHAuanNcIik7XG59IGVsc2UgeyAgLy9wcm9kdWN0aW9uXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RldmljZXJlYWR5JywgKCk9PntcbiAgICBjb25zb2xlLmRlYnVnKFwiQm9vdHN0cmFwIC0gTG9hZGluZyBhcHBcIik7XG4gICAgdmFyIGFwcFVybCA9IGNvcmRvdmEuZmlsZS5kYXRhRGlyZWN0b3J5ICsgXCJmaWxlcy9hcHAuanNcIjtcbiAgICB3aW5kb3cucmVxdWVzdEZpbGVTeXN0ZW0oTG9jYWxGaWxlU3lzdGVtLlBFUlNJU1RFTlQsIDAsIChmcykgPT4ge1xuICAgICAgZnMucm9vdC5nZXRGaWxlKFwiYXBwLmpzXCIsIHsgY3JlYXRlOiBmYWxzZSwgZXhjbHVzaXZlOiBmYWxzZSB9LCAoZmlsZUVudHJ5KSA9PiB7XG4gICAgICAgIC8vbG9hZGluZyBkb3dubG9hZCBhcHAgdmVyc2lvblxuICAgICAgICBjb25zb2xlLmRlYnVnKFwiQm9vdHN0cmFwIC0gTG9hZGVkIGFwcCBmcm9tIGZpbGVzeXN0ZW1cIik7XG4gICAgICAgIGxvYWRTY3JpcHQoYXBwVXJsK1wiP3RpbWVzdGFtcD1cIituZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCJCb290c3RyYXAgLSBVcGRhdGluZyBuZXcgYXBwIHZlcnNpb24gZm9yIG5leHQgdGltZS4uLlwiKTtcbiAgICAgICAgcmVxdWVzdE5ld0FwcFZlcnNpb24oYXBwVXJsKTtcbiAgICAgIH0sIGZ1bmN0aW9uKGVycil7XG4gICAgICAgIC8vbG9hZGluZyBsb2NhbCBmaWxlXG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCJCb290c3RyYXAgLSBMb2FkaW5nIHBhY2thZ2VkIGFwcFwiLCBlcnIpO1xuICAgICAgICBsb2FkU2NyaXB0KFwiYXBwLmpzXCIpO1xuICAgICAgICBjb25zb2xlLmRlYnVnKFwiQm9vdHN0cmFwIC0gbG9hZGluZyBhcHAgZnJvbSBjbG91ZC4uLlwiKTtcbiAgICAgICAgcmVxdWVzdE5ld0FwcFZlcnNpb24oYXBwVXJsKTtcblxuICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24oZXJyKXtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciB3aGVuIHRyaWVkIHRvIHJlcXVlc3QgZmlsZSBzeXN0ZW1cIiwgZXJyKTtcbiAgICAgIGxvYWRTY3JpcHQoXCJhcHAuanNcIik7XG4gICAgfSk7XG4gIH0sIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gbG9hZFNjcmlwdCh1cmwpe1xuICB2YXIgc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICBzcy50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcbiAgc3Muc3JjID0gdXJsO1xuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF0uYXBwZW5kQ2hpbGQoc3MpO1xufVxuXG5mdW5jdGlvbiByZXF1ZXN0TmV3QXBwVmVyc2lvbihhcHBVcmwpe1xuICB2YXIgZmlsZVRyYW5zZmVyID0gbmV3IEZpbGVUcmFuc2ZlcigpO1xuICBmaWxlVHJhbnNmZXIuZG93bmxvYWQoXCJodHRwczovL3N0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vemFwdC1hcHAtcmVsZWFzZXMvYXBwMi5qcz90aW1lc3RhbXA9XCIrbmV3IERhdGUoKS5nZXRUaW1lKCksIGFwcFVybCxcbiAgICBmdW5jdGlvbihlbnRyeSkge1xuICAgICAgY29uc29sZS5kZWJ1ZyhcIkJvb3RzdHJhcCAtIGxvYWRlZCBuZXcgdmVyc2lvbiBmcm9tIGNsb3VkXCIsIGVudHJ5KTtcbiAgICB9LFxuICAgIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmRlYnVnKFwiQm9vdHN0cmFwIC0gZXJyb3Igd2hlbiB0cmllZCB0byBsb2FkIG5ldyB2ZXJzaW9uIGZyb20gY2xvdWRcIiwgZXJyb3IpO1xuICAgIH0sXG4gICAgZmFsc2VcbiAgKTtcbn1cbiJdfQ==
