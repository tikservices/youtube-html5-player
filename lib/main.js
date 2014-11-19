/* jshint esnext:true, node:true*/
"use strict";
var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
pageMod.PageMod({
    include: "*.www.youtube.com",
    contentStyleFile: data.url("video-js.css"),
    contentScriptFile: [
        data.url("video.dev.js") ,
        data.url("youtube-formats.js"),
        data.url("youtube.js")
    ],
    contentScriptWhen: "ready" //"start"
});

const { Cc, Ci, Cr } = require("chrome");

var events = require("sdk/system/events");
var utils = require("sdk/window/utils");
var YOUTUBE_FLASH_REGEX = /https?:\/\/(www.)?youtube.com\/v\/([^#?\/]*)/;
var YT_BIN_REGEX = /https:\/\/s.ytimg.com\/yts\/jsbin\/[^\/]*\/base.js/;
var YT_PLAYER_REGEX = /https:\/\/s.ytimg.com\/yts\/jsbin\/[^\/]*\/html5player.js/;
function listener(event) {
    var channel = event.subject.QueryInterface(Ci.nsIHttpChannel);
    var url = event.subject.URI.spec;
    var video_id = (YOUTUBE_FLASH_REGEX.exec(url) || [undefined, undefined, undefined])[2];

    if (video_id)
	channel.redirectTo(
		Cc["@mozilla.org/network/io-service;1"]
			.getService(Ci.nsIIOService)
			.newURI("https://www.youtube.com/embed/" + video_id, null, null)
	);
    else if(YT_PLAYER_REGEX.test(url))
	    channel.cancel(Cr.NS_BINDING_ABORTED);
}

exports.main = function() {
    events.on("http-on-modify-request", listener);
};
exports.onUnload = function (reason) {
    events.off("http-on-modify-request", listener);
};
