/* jshint esnext:true*/
var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
pageMod.PageMod({
	  include: "*.www.youtube.com",
	  contentStyleFile: data.url("video-js.css"),
	  contentScriptFile: [/*data.url("video.dev.js") ,*/data.url("youtube.js")],
	  contentScriptWhen: "ready"
});
