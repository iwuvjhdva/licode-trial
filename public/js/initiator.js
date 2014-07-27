/*jshint indent:4, strict:true*/

var room;

$(function () {
    "use strict";

    var nuveData = $('#js-nuve-data').data();

    room = Erizo.Room({token: nuveData.token});

    room.addEventListener('room-connected', function (roomEvent) {
        for (var index in roomEvent.streams)
            addParticipant(roomEvent.streams[index]);
    });

    room.addEventListener('stream-subscribed', function(streamEvent) {
        var videoID = 'js-video-' + streamEvent.stream.getID();

        var video = $('<div />', {
            id: videoID,
            addClass: 'video'
        });

        $('#js-videos-container').append(video);

        streamEvent.stream.show(videoID, {speaker: false});
    });

    room.addEventListener('stream-added', function (streamEvent) {
        addParticipant(streamEvent.stream);
    });

    room.addEventListener('stream-removed', function (streamEvent) {
        var participantID = streamEvent.stream.getAttributes().participantID;
        $('.js-participant[data-id="' + participantID + '"]').remove();
    });

    room.connect();

    function subscribeToStreams(streams) {
        for (var index in streams)
            room.subscribe(streams[index]);
    };

    function addParticipant(stream) {
        var participantID = stream.getAttributes().participantID;

        var attrs = {
            type: 'button',
            text: participantID,
            'class': 'js-participant btn btn-default',
            'data-id': participantID
        };
        var participant = $('<button />', attrs);
        $('#js-participants-container').append(participant);

        participant.click(function () {
            if ($(this).hasClass('active')) {
                $('#' + stream.elementID).remove();
                room.unsubscribe(stream);
            } else
                room.subscribe(stream);
        });
    }
});
