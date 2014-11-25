/*globals videojs, PREF_FORMATS, FORMATS, OPTIONS, prefChangeHandler */
(function () {
    "use strict";
    var player, player_container;
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
        prefChangeHandler = function (pref) {
            if (player && pref.name === "volume") {
                player[pref.name] = pref.value / 100;
            }
        };
    }
    function changePlayer() {
        var conf = getConfig();
        if (conf === undefined)
            return;
        asyncText(INFO_URL + conf.id).then(getURL(conf)).then(function (url) {
            try {
                if (player_container)
                    player_container.innerHTML = "";
                player_container = document.getElementById("player-mole-container");
                if (conf.isEmbed)
                    player_container = document.body;
                if (conf.isChannel)
                    player_container = document.getElementsByClassName("c4-player-container")[0];
                if (!player_container)
                    return;
                player_container.innerHTML = "";
                var player_opt = {
                    id: "video_player",
                    src: url,
                    className: "video-js vjs-default-skin " + conf.className,
                    controls: true,
                    volume: OPTIONS.volume / 100
                };
                if (!conf.isEmbed)
                    player_opt.autoplay = true;
                player = createNode("video", player_opt);
                //videojs(player); //TODO: use video-js custom video player
                player_container.appendChild(player);
            } catch (e) {
                console.error("Exception on changePlayer()", e.lineNumber, e.columnNumber, e.message, e.stack);
            }
        });
    }
    function getConfig() {
        var isEmbed = location.href.search("youtube.com/embed/") > -1;
        var isWatch = location.href.search("youtube.com/watch?") > -1;
        var isChannel = location.href.search("youtube.com/channel/") > -1 || location.href.search("youtube.com/user/") > -1;
        if (!isEmbed && !isWatch && !isChannel)
            return;
        var player_id, player_class;
        if (isEmbed) {
            player_id = location.pathname.match(/^\/embed\/([^?#/]*)/)[1];
            player_class = "full-frame";
        } else if (isChannel) {
            var upsell = document.getElementById("upsell-video");
            if (!upsell)
                return;
            player_id = upsell.dataset["videoId"];
            player_class = "html5-main-video";
        } else {
            player_id = location.search.slice(1).match(/v=([^/?#]*)/)[1];
            player_class = "player-width player-height";
        }
        if (!player_id)
            return;
        return {
            isEmbed: isEmbed,
            isWatch: isWatch,
            isChannel: isChannel,
            id: player_id,
            className: player_class
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
            for (var i = 0; i < PREF_FORMATS.length; i++)
                if (formats[PREF_FORMATS[i]]) {
                    return Promise.resolve(formats[PREF_FORMATS[i]]);
                }
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
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
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
    try {
        if (document.readyState !== "loading")
            main();
        else
            document.addEventListener("DOMContentLoaded", main);
    } catch (e) {
        console.error("Exception on main()", e.lineNumber, e.columnNumber, e.message, e.stack);
    }
}());