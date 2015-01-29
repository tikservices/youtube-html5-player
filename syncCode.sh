#!/usr/bin/bash
# guessing that HTML5-video-everywhere project dir is on same parent dir
h5vew=../html5-video-everywhere/
[ ! -d $h5vew ] && exit 1
cp $h5vew/data/{common,youtube,youtube-formats}.js data/
cp $h5vew/lib/{youtube,main}.js lib/
cp $h5vew/spec/youtube.md youtube-status.md
cp $h5vew/{.jshintrc,package.json} ./

sed -i 's/"name": "html5-video-everywhere",/"name": "youtube-video-player",/' package.json
sed -i 's/"title": "HTML5 Video Everywhere!",/"title": "Youtube HTML5 Video Player",/' package.json
sed -i 's/"id": "html5-video-everywhere@lejenome.me",/"id": "youtube-video-player@lejenome.me",/' package.json
sed -i 's/"description": "Replace video player with Firefox native video player",/"description": "Youtube video player stucks a lot, this basic video player sucks less",/' package.json
sed -i 's/"homepage": "https:\/\/github.com\/lejenome\/html5-video-everywhere",/"homepage": "https:\/\/github.com\/lejenome\/youtube-html5-player",/' package.json

perl -0777 -pe 's/(const drivers = \[)[^\]]*(\];)/\1\nrequire(".\/youtube")\n\2/' -i lib/main.js

make
git add --all
[ "$(git diff --name-only --staged | wc -l)" -le 1 ] && exit 0
git commit -m "update to lastest HTML5-video-everywhere code revision"
