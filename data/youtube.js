/*globals videojs, PREF, FORMATS */
var player, video_container;
var INFO_URL = "https://www.youtube.com/get_video_info?hl=en_US&el=detailpage&video_id=";
function main() {
    "use strict";
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
    "use strict";
    var embed = location.href.search("youtube.com/embed/") > -1;
    var normal = location.href.search("youtube.com/watch?") > -1;
    var channel = location.href.search("youtube.com/channel/") > -1 || location.href.search(/youtube.com\/user\/[^/?#]*\/featured/) > -1;
    if (!embed && !normal && !channel)
        return;
    var video_id, video_class;
    if (embed) {
        video_id = location.pathname.match(/embed\/([^?#/]*)/)[1];
        video_class = "full-frame";
    } else if (channel) {
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
    asyncText(INFO_URL + video_id).then(function (data) {
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
            return;
        var v_url;
        for (var i = 0; i < PREF.length && !v_url; i++)
            if (formats[PREF[i]])
                v_url = formats[PREF[i]];
        try {
            video_container = document.getElementById("player-mole-container");
            if (embed)
                video_container = document.body;
            if (channel)
                video_container = document.getElementsByClassName("c4-player-container")[0];
            if (!video_container)
                return;
            video_container.innerHTML = "";
            player = createNode("video", {
                id: "video_player",
                src: v_url,
                className: "video-js vjs-default-skin " + video_class,
                controls: "true",
                preload: embed ? "false" : "auto",
                autoplay: embed ? "false" : "true"
            });
            // videojs(player, {}, function(){});
            video_container.appendChild(player);
        } catch (e) {
            document.body.innerHTML = "<code>" + e.name + " - " + e.fileName + " - " + e.columnNumber + " - " + e.message + " - \n" + e.stack + "</code>";
        }
    });
}
function createNode(type, obj, data, style) {
    "use strict";
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
    "use strict";
    // return new Promise(function (resolve, reject) {
    return {
        then: function (resolve, reject) {
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
    };    //  );
}
try {
    main();
} catch (e) {
    document.body.innerHTML = "<code>" + e.name + " - " + e.columnNumber + " - " + e.message + " - \n" + e.stack + "</code>";
}