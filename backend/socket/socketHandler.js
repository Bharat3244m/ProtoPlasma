function setupSocketHandlers(io, simulation) {

    io.on("connection", (socket) => {

        console.log(
            "Client connected:",
            socket.id
        );


        // Send current state immediately
        // when frontend connects.
        socket.emit(
            "physics_update",
            simulation.getState()
        );


        socket.on(
            "simulation:start",
            () => {

                console.log(
                    "Start requested by:",
                    socket.id
                );

                simulation.start();
            }
        );


        socket.on(
            "simulation:pause",
            () => {

                console.log(
                    "Pause requested by:",
                    socket.id
                );

                simulation.pause();
            }
        );


        socket.on(
            "simulation:reset",
            () => {

                console.log(
                    "Reset requested by:",
                    socket.id
                );

                simulation.reset();
            }
        );


        socket.on(
            "disconnect",
            () => {

                console.log(
                    "Client disconnected:",
                    socket.id
                );
            }
        );
    });
}

module.exports = setupSocketHandlers;