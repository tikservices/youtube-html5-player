/* jshint esnext:true*/
var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
pageMod.PageMod({
	  include: "*.www.youtube.com",
	  contentScriptFile: data.url("youtube.js"),
	  contentScriptWhen: "ready"
});
