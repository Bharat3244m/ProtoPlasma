const express = require("express");
const http = require("http");

const { Server } = require("socket.io");

const SimulationEngine =
    require("./engine/SimulationEngine");

const setupSocketHandlers =
    require("./socket/socketHandler");


const app = express();

const server =
    http.createServer(app);


const io = new Server(server, {

    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }

});


const simulation =
    new SimulationEngine(io);


setupSocketHandlers(
    io,
    simulation
);


// Simple test endpoint
app.get("/", (req, res) => {

    res.json({
        project: "ProtoPlasma",
        backend: "online",
        simulationRunning:
            simulation.running,
        tick:
            simulation.tick
    });
});


const PORT =
    process.env.PORT || 3000;


server.listen(PORT, () => {

    console.log(
        `ProtoPlasma backend running on port ${PORT}`
    );

    console.log(
        `http://localhost:${PORT}`
    );
});