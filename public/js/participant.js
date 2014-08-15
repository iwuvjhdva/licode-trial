/*jshint indent:4, strict:true*/

var room, broadcastingStream;

$(function () {
    "use strict";

    var participantID = prompt("Please enter your participant ID", 'virtual-group');

    broadcastingStream = Erizo.Stream({
        audio: false,
        video: true,
        data: true,
        attributes: {participantID: participantID},
        videoSize: [640, 480, 640, 480]
    });

    $.post('/_tokens', {user: participantID}, onTokenCreated, 'json');

    function onTokenCreated(data) {
        console.log("Got token", data.token);

        room = Erizo.Room(data);

        broadcastingStream.addEventListener('access-accepted', function () {
            room.connect();

            var localStream = Erizo.Stream({
                stream: broadcastingStream.stream.clone(),
                video: true,
            });

            localStream.show('js-local-video', {speaker: false});
        });

        room.addEventListener("room-connected", function (roomEvent) {
            room.publish(broadcastingStream, {maxVideoBW: 450});
        });
    }

    broadcastingStream.init();
});
