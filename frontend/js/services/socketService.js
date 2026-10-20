app.factory('SocketService', function() {

    const socket = io('http://localhost:3000');

    return {

        on: function(eventName, callback) {
            socket.on(eventName, callback);
        },

        emit: function(eventName, data) {
            socket.emit(eventName, data);
        }

    };
});