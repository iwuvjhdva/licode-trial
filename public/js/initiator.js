/*jshint indent:4, strict:true*/

$(function () {
    "use strict";

    var nuveData = $('#js-nuve-data').data();
    var room = Erizo.Room({token: nuveData.token});

    room.connect();

    room.addEventListener('room-connected', function (roomEvent) {
        subscribeToStreams(roomEvent.streams);
    });

    room.addEventListener('stream-subscribed', function(streamEvent) {
        var videoID = 'js-video-' + streamEvent.stream.getID();

        var video = $('<div />', {
            id: videoID,
            addClass: 'video'
        });

        $('#js-videos-container').append(video);

        streamEvent.stream.show(videoID);
    });

    room.addEventListener('stream-added', function (streamEvent) {
        subscribeToStreams([streamEvent.stream]);
    });

    room.addEventListener('stream-removed', function (streamEvent) {
        if (streamEvent.stream.elementID !== undefined) {
            $('#' + streamEvent.stream.elementID).remove();
        }
    });

    function subscribeToStreams(streams) {
        for (index in streams)
            room.subscribe(streams[index]);
    };
});
