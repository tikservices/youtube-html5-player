"use strict";
/*globals videojs*/
var player, video_container;
var INFO_URL = 'https://www.youtube.com/get_video_info?hl=en_US&el=detailpage&video_id=';
function main() {
	changePlayer();
	window.addEventListener("spfrequest", function(){
		if(player)
			player.src = "";
	});
	window.addEventListener("spfdone", function(){
		changePlayer();
	});
}
function changePlayer(){
	var embed = location.href.search("youtube.com/embed/") > -1;
	var normal = location.href.search("youtube.com/watch?") > -1;
	var channel = location.href.search("youtube.com/channel/") > -1 ||
		location.href.search(/youtube.com\/user\/[^/?#]*\/featured/) > -1;
	if (!embed && !normal && !channel) return;
	var video_id, video_class;
	if(embed){
		video_id = location.pathname.match(/embed\/([^?#/]*)/)[1];
		video_class = "full-frame";
	} else if (channel){
		var upsell =  document.getElementById("upsell-video");
		if(!upsell) return;
		video_id = upsell.dataset["videoId"];
		video_class = "html5-main-video";
	} else {
		video_id = location.search.slice(1).match(/v=([^/?#]*)/)[1];
		video_class = "player-width player-height";
	}
	if(!video_id) return;
	asyncText(INFO_URL + video_id).then(function(data){
		var info = data.match(/url_encoded_fmt_stream_map=([^&]*)/)[1];
		info = decodeURIComponent(info);
		var formats = {};
		info.split(",").forEach(function(f,i){
			var itag = f.match(/itag=([^&]*)/)[1];
			var url = decodeURIComponent(f.match(/url=([^&]*)/)[1]);
			if(FORMATS[itag])
				formats[itag] = url;
		});
		if (Object.keys(FORMATS).length < 1) return;
		var v_url;
		for(var i = 0; i < PREF.length && !v_url; i++)
			if (formats[PREF[i]])
				v_url = formats[PREF[i]];
		try{
			video_container = document.getElementById("player-mole-container");
			if(embed) video_container = document.body;
			if(channel) video_container = document.getElementsByClassName("c4-player-container")[0];
			if(! video_container) return;
			video_container.innerHTML = "";
			player = createNode("video",{
				id: "video_player",
				src: v_url,
				className: "video-js vjs-default-skin " + video_class,
				controls: "true",
				preload: embed? "false" : "auto",
				autoplay: embed? "false" : "true"
			});
			video_container.appendChild(player);
/*			if(embed) {
				player.style.width ="100%";
				player.style.height="100%";
			}
*/
//			videojs(player, {}, function(){});
		}catch(e){document.body.innerHTML= "<code>"+e.name+" - "+e.fileName+" - "+e.columnNumber+" - "+e.message+" - \n"+e.stack+"</code>";}

	});
}
function createNode(type, obj, data, style){
        var node = document.createElement(type);
        if (obj)
            for (var opt in obj)
                if (obj.hasOwnProperty(opt))
                    node[opt] = obj[opt];
        if (data)
            for (var el in data)
                if (data.hasOwnProperty(el))
                    node.dataset[el] = data[el];
        if (style)
            for (var st in style)
                if (style.hasOwnProperty(st))
                    node.style[st] = style[st];
	return node;
}
function asyncText(url, headers, success) {
//    return new Promise(function (resolve, reject) {
    return {then: function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        if (xhr.overrideMimeType)
            xhr.overrideMimeType("text/plain");
        xhr.onload = function () {
            if (this.status !== 200) {
                reject(this.status);
                return;
            }
            resolve(this.responseText);
        };
        xhr.onerror = function () {
            reject();
        };
        if (headers) {
            for (var header in headers) {
                if (headers.hasOwnProperty(header))
                    xhr.setRequestHeader(header, headers[header]);
            }
        }
        xhr.send();
    }
    };
//    );
}
var PREF = ["18", "43", "22"];
var FORMATS = {
'18': {
container: 'mp4',
resolution: '360p',
encoding: 'H.264',
profile: 'baseline',
bitrate: '0.5',
audioEncoding: 'aac',
audioBitrate: 96,
},
'22': {
container: 'mp4',
resolution: '720p',
encoding: 'H.264',
profile: 'high',
bitrate: '2-3',
audioEncoding: 'aac',
audioBitrate: 192,
},
'43': {
container: 'webm',
resolution: '360p',
encoding: 'VP8',
profile: null,
bitrate: '0.5',
audioEncoding: 'vorbis',
audioBitrate: 128,
}
};
var unused = {
//profile 3d
'82': {
container: 'mp4',
resolution: '360p',
encoding: 'H.264',
profile: '3d',
bitrate: '0.5',
audioEncoding: 'aac',
audioBitrate: 96,
},
'83': {
container: 'mp4',
resolution: '240p',
encoding: 'H.264',
profile: '3d',
bitrate: '0.5',
audioEncoding: 'aac',
audioBitrate: 96,
},
'84': {
container: 'mp4',
resolution: '720p',
encoding: 'H.264',
profile: '3d',
bitrate: '2-3',
audioEncoding: 'aac',
audioBitrate: 192,
},
'85': {
container: 'mp4',
resolution: '1080p',
encoding: 'H.264',
profile: '3d',
bitrate: '3-4',
audioEncoding: 'aac',
audioBitrate: 192,
},
'100': {
container: 'webm',
resolution: '360p',
encoding: 'VP8',
profile: '3d',
bitrate: null,
audioEncoding: 'vorbis',
audioBitrate: 128,
},
'101': {
container: 'webm',
resolution: '360p',
encoding: 'VP8',
profile: '3d',
bitrate: null,
audioEncoding: 'vorbis',
audioBitrate: 192,
},
'102': {
container: 'webm',
resolution: '720p',
encoding: 'VP8',
profile: '3d',
bitrate: null,
audioEncoding: 'vorbis',
audioBitrate: 192,
},
// DASH (video only)
'133': {
container: 'mp4',
resolution: '240p',
encoding: 'H.264',
profile: 'main',
bitrate: '0.2-0.3',
audioEncoding: null,
audioBitrate: null,
},
'134': {
container: 'mp4',
resolution: '360p',
encoding: 'H.264',
profile: 'main',
bitrate: '0.3-0.4',
audioEncoding: null,
audioBitrate: null,
},
'135': {
container: 'mp4',
resolution: '480p',
encoding: 'H.264',
profile: 'main',
bitrate: '0.5-1',
audioEncoding: null,
audioBitrate: null,
},
'136': {
container: 'mp4',
resolution: '720p',
encoding: 'H.264',
profile: 'main',
bitrate: '1-1.5',
audioEncoding: null,
audioBitrate: null,
},
'137': {
container: 'mp4',
resolution: '1080p',
encoding: 'H.264',
profile: 'high',
bitrate: '2-3',
audioEncoding: null,
audioBitrate: null,
},
'160': {
container: 'mp4',
resolution: '144p',
encoding: 'H.264',
profile: 'main',
bitrate: '0.1',
audioEncoding: null,
audioBitrate: null,
},
'264': {
container: 'mp4',
resolution: '1440p',
encoding: 'H.264',
profile: 'high',
bitrate: '4-5',
audioEncoding: null,
audioBitrate: null,
},
// DASH (audio only)
'139': {
container: 'mp4',
resolution: null,
encoding: null,
profile: null,
bitrate: null,
audioEncoding: 'aac',
audioBitrate: 48,
},
'140': {
container: 'mp4',
resolution: null,
encoding: null,
profile: null,
bitrate: null,
audioEncoding: 'aac',
audioBitrate: 128,
},
'141': {
container: 'mp4',
resolution: null,
encoding: null,
profile: null,
bitrate: null,
audioEncoding: 'aac',
audioBitrate: 256,
},
'171': {
container: 'webm',
resolution: null,
encoding: null,
profile: null,
bitrate: null,
audioEncoding: 'vorbis',
audioBitrate: 128,
},
'172': {
container: 'webm',
resolution: null,
encoding: null,
profile: null,
bitrate: null,
audioEncoding: 'vorbis',
audioBitrate: 192,
},
// Live streaming
'242': {
container: 'webm',
resolution: '240p',
encoding: 'VP9',
profile: null,
bitrate: '0.14',
audioEncoding: null,
audioBitrate: null,
},
'243': {
container: 'webm',
resolution: '360p',
encoding: 'VP9',
profile: null,
bitrate: '0.26',
audioEncoding: null,
audioBitrate: null,
},
'244': {
container: 'webm',
resolution: '480p',
encoding: 'VP9',
profile: null,
bitrate: '0.585',
audioEncoding: null,
audioBitrate: null,
},
'247': {
container: 'webm',
resolution: '720p',
encoding: 'VP9',
profile: null,
bitrate: '1.184',
audioEncoding: null,
audioBitrate: null,
},
'248': {
container: 'webm',
resolution: '1080p',
encoding: 'VP9',
profile: null,
bitrate: '1.895',
audioEncoding: null,
audioBitrate: null,
},
};
try{
main();
}catch(e){document.body.innerHTML= "<code>"+e.name+" - "+e.columnNumber+" - "+e.message+" - \n"+e.stack+"</code>";}
