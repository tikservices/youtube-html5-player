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
resolution: '360p'
},
'22': {
container: 'mp4',
resolution: '720p'
},
'43': {
container: 'webm',
resolution: '360p'
}
};
var FORMATS_3D = {
'82': {
container: 'mp4',
resolution: '360p'
},
'83': {
container: 'mp4',
resolution: '240p'
},
'84': {
container: 'mp4',
resolution: '720p'
},
'85': {
container: 'mp4',
resolution: '1080p'
},
'100': {
container: 'webm',
resolution: '360p'
},
'101': {
container: 'webm',
resolution: '360p'
},
'102': {
container: 'webm',
resolution: '720p'
}
};
var FORMATS_DASH_VIDEO = {
'133': {
container: 'mp4',
resolution: '240p'
},
'134': {
container: 'mp4',
resolution: '360p'
},
'135': {
container: 'mp4',
resolution: '480p'
},
'136': {
container: 'mp4',
resolution: '720p'
},
'137': {
container: 'mp4',
resolution: '1080p'
},
'160': {
container: 'mp4',
resolution: '144p'
},
'264': {
container: 'mp4',
resolution: '1440p'
}
};
var FORMATS_DASH_AUDIO = {
'139': {
container: 'mp4',
audioEncoding: 'aac',
audioBitrate: 48
},
'140': {
container: 'mp4',
audioEncoding: 'aac',
audioBitrate: 128
},
'141': {
container: 'mp4',
audioEncoding: 'aac',
audioBitrate: 256
},
'171': {
container: 'webm',
audioBitrate: 128
},
'172': {
container: 'webm',
audioBitrate: 192
}
};
var FORMAT_LIVE_STREAM = {
'242': {
container: 'webm',
resolution: '240p'
},
'243': {
container: 'webm',
resolution: '360p'
},
'244': {
container: 'webm',
resolution: '480p'
},
'247': {
container: 'webm',
resolution: '720p'
},
'248': {
container: 'webm',
resolution: '1080p'
},
};
try{
main();
}catch(e){document.body.innerHTML= "<code>"+e.name+" - "+e.columnNumber+" - "+e.message+" - \n"+e.stack+"</code>";}
