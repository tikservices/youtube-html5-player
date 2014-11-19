/*globals videojs, PREF, FORMATS */
(function () {
    "use strict";
    var player, video_container;
    var INFO_URL = "https://www.youtube.com/get_video_info?hl=en_US&el=detailpage&video_id=";
    function main() {
        changePlayer();
        window.addEventListener("spfrequest", function () {
            if (player)
                player.src = "";
        });
        window.addEventListener("spfdone", function () {
            changePlayer();
        });
    }
    function changePlayer() {
        var conf = getConfig();
        if (conf === undefined)
            return;
        asyncText(INFO_URL + conf.id).then(getURL(conf)).then(function (url) {
            try {
                if (video_container)
                    video_container.innerHTML = "";
                video_container = document.getElementById("player-mole-container");
                if (conf.isEmbed)
                    video_container = document.body;
                if (conf.isChannel)
                    video_container = document.getElementsByClassName("c4-player-container")[0];
                if (!video_container)
                    return;
                video_container.innerHTML = "";
		var player_opt = {
                    id: "video_player",
                    src: url,
                    className: "video-js vjs-default-skin " + conf.className,
                    controls: "true"
		};
		if(! conf.isEmbed)
			player_opt.autoplay = "true";
                player = createNode("video", player_opt);
                //videojs(player);
                video_container.appendChild(player);
            } catch (e) {
                document.body.innerHTML = "<code>" + e.name + " - " + e.fileName + " - " + e.lineNumber + ":" + e.columnNumber + " - " + e.message + " - \n" + e.stack + "</code>";
            }
        });
    }
    function getConfig() {
        var isEmbed = location.href.search("youtube.com/embed/") > -1;
        var isWatch = location.href.search("youtube.com/watch?") > -1;
        var isChannel = location.href.search("youtube.com/channel/") > -1 || location.href.search("youtube.com/user/") > -1;
        if (!isEmbed && !isWatch && !isChannel)
            return;
        var video_id, video_class;
        if (isEmbed) {
            video_id = location.pathname.match(/^\/embed\/([^?#/]*)/)[1];
            video_class = "full-frame";
        } else if (isChannel) {
            var upsell = document.getElementById("upsell-video");
            if (!upsell)
                return;
            video_id = upsell.dataset["videoId"];
            video_class = "html5-main-video";
        } else {
            video_id = location.search.slice(1).match(/v=([^/?#]*)/)[1];
            video_class = "player-width player-height";
        }
        if (!video_id)
            return;
        return {
            isEmbed: isEmbed,
            isWatch: isWatch,
            isChannel: isChannel,
            id: video_id,
            className: video_class
        };
    }
    function getURL(conf) {
        return function (data) {
            var info = data.match(/url_encoded_fmt_stream_map=([^&]*)/)[1];
            info = decodeURIComponent(info);
            var formats = {};
            info.split(",").forEach(function (f, i) {
                var itag = f.match(/itag=([^&]*)/)[1];
                var url = decodeURIComponent(f.match(/url=([^&]*)/)[1]);
                if (FORMATS[itag])
                    formats[itag] = url;
            });
            if (Object.keys(FORMATS).length < 1)
                return Promise.reject();
            for (var i = 0; i < PREF.length; i++)
                if (formats[PREF[i]])
                    return Promise.resolve(formats[PREF[i]]);
        };
    }
    function createNode(type, obj, data, style) {
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
        return new Promise(function (resolve, reject) {
            //        return {
            //            then: function (resolve, reject) {
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
        }    //        };   
);
    }
    try {
        main();
    } catch (e) {
        document.body.innerHTML = "<code>" + e.name + " - " + e.fileName + " - " + e.lineNumber + ":" + e.columnNumber + " - " + e.message + " - \n" + e.stack + "</code>";
    }
}());
