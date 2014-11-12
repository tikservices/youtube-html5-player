"use strict";
function main(){
	var INFO_URL = 'http://www.youtube.com/get_video_info?hl=en_US&el=detailpage&video_id=';
	var embed = location.href.search("youtube.com/embed") > -1;
	var normal = location.href.search("youtube.com/watch?") > -1;
	if (!embed && !normal) return;
	var video_container, video_id;
	if(embed){
		video_id = location.pathname.match(/embed\/([^?#/]*)/)[1];
	} else {
		video_id = location.search.slice(1).match(/v=([^/?#]*)/)[1];
	}
	video_container = document.getElementsByClassName("html5-video-player")[0];
	asyncText(INFO_URL + video_id).then(function(data){
		var info = data.match(/url_encoded_fmt_stream_map=([^&]*)/)[1];
		info = decodeURIComponent(info);
		var formats = {};
		info.split(",").forEach(function(f,i){
			f = decodeURIComponent(f);
			var itag = f.match(/itag=([^&]*)/)[1];
			var url = f.match(/url=([^&]*)/)[1];
			if(FORMATS[itag])
				formats[FORMATS[itag]] = url;
		});
	});
}

function asyncText(url, headers) {
    return new Promise(function (resolve, reject) {
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
    });
}
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
'37': {
container: 'mp4',
resolution: '1080p',
encoding: 'H.264',
profile: 'high',
bitrate: '3-5.9',
audioEncoding: 'aac',
audioBitrate: 192,
},
'38': {
container: 'mp4',
resolution: '3072p',
encoding: 'H.264',
profile: 'high',
bitrate: '3.5-5',
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
},
'44': {
container: 'webm',
resolution: '480p',
encoding: 'VP8',
profile: null,
bitrate: '1',
audioEncoding: 'vorbis',
audioBitrate: 128,
},
'45': {
container: 'webm',
resolution: '720p',
encoding: 'VP8',
profile: null,
bitrate: '2',
audioEncoding: 'vorbis',
audioBitrate: 192,
},
'46': {
container: 'webm',
resolution: '1080p',
encoding: 'vp8',
profile: null,
bitrate: null,
audioEncoding: 'vorbis',
audioBitrate: 192,
},
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
main();
