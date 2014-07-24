/*jshint indent:4, strict:true*/

$(function () {
    "use strict";

    var participantID = prompt("Please enter your participant ID", 'virtual-group');

    var localStream = Erizo.Stream({
        audio: false,
        video: true,
        data: true,
        videoSize: [640, 480, 640, 480]
    });

    $.post('/_tokens', {user: participantID}, onTokenCreated, 'json');

    var room;

    function onTokenCreated(data) {
        console.log("Got token", data.token);
        room = Erizo.Room(data);

        localStream.addEventListener('access-accepted', function () {
            room.connect();
            localStream.show('js-local-video', {speaker: false});
        });
    }

    localStream.init();
});
