/*jshint indent:4, strict:true*/

var room;

$(function () {
    "use strict";

    var nuveData = $('#js-nuve-data').data();

    var dataStream = Erizo.Stream({
        data: true,
        attributes: {role: 'initiator'},
    });
    room = Erizo.Room({token: nuveData.token});

    room.addEventListener('room-connected', function (roomEvent) {
        for (var index in roomEvent.streams)
            addParticipant(roomEvent.streams[index]);
        room.publish(dataStream);
    });

    room.addEventListener('stream-subscribed', function(streamEvent) {
        var participantID = streamEvent.stream.getAttributes().participantID;
        var participant = getObjectByUserID('js-participant', participantID);
        participant.prop('disabled', false);
    });

    room.addEventListener('stream-added', function (streamEvent) {
        addParticipant(streamEvent.stream);
    });

    room.addEventListener('stream-removed', function (streamEvent) {
        var attrs = streamEvent.stream.getAttributes();
        if (attrs.role == 'participant') {
            getObjectByUserID('js-participant', attrs.participantID).remove();
            hideParticipantVideo(attrs.participantID);
        }
    });

    dataStream.init();
    room.connect();

    function addParticipant(stream) {
        var attrs = stream.getAttributes();

        if (attrs.role != 'participant') return;

        var participantID = attrs.participantID;

        var attrs = {
            type: 'button',
            text: participantID,
            'class': 'js-participant btn btn-default',
            disabled: true,
            'data-id': participantID
        };
        var participant = $('<button />', attrs);
        $('#js-participants-container').append(participant);

        participant.click(function () {
            if ($(this).hasClass('active'))
                hideParticipantVideo(participantID);
            else
                showParticipantVideo(participantID);
        });

        room.subscribe(stream);
    }

    function showParticipantVideo(participantID) {
        var stream = room.getStreamsByAttribute('participantID', participantID)[0];
        dataStream.sendData({action: 'unhold', participantID: participantID});

        var videoID = 'js-video-' + stream.getID();

        var video = $('<div />', {
            id: videoID,
            addClass: 'video'
        });

        $('#js-videos-container').append(video);

        stream.show(videoID);
    }

    function hideParticipantVideo(participantID) {
        var stream = room.getStreamsByAttribute('participantID', participantID)[0];
        dataStream.sendData({action: 'hold', participantID: participantID});
        stream.hide();
        $('#' + stream.elementID).remove();
    }

    /* Returns a jQuery object by its CSS class name and the data-id attribute
     */
    function getObjectByUserID(className, participantID) {
        "use strict";
        return $('.' + className + '[data-id="' + participantID + '"]');
    }
});
