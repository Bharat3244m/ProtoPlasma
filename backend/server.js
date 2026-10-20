const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// Simulation engine
const SimulationEngine = require("./engine/SimulationEngine");

// Socket event handlers
const setupSocketHandlers = require("./socket/socketHandler");


// ==========================================
// 1. CREATE EXPRESS APPLICATION
// ==========================================

const app = express();


// ==========================================
// 2. CREATE HTTP SERVER
// ==========================================

const server = http.createServer(app);


// ==========================================
// 3. CREATE SOCKET.IO SERVER
// ==========================================

const io = new Server(server, {

    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }

});


// ==========================================
// 4. CREATE SIMULATION
// ==========================================

const simulation = new SimulationEngine(io);


// ==========================================
// 5. SETUP SOCKET EVENTS
// ==========================================

setupSocketHandlers(io, simulation);


// ==========================================
// 6. TEST / STATUS ENDPOINT
// ==========================================

app.get("/", (req, res) => {

    res.json({

        project: "ProtoPlasma",

        backend: "online",

        simulationRunning: simulation.running,

        tick: simulation.tick,

        particles: simulation.world.particles.length

    });

});


// ==========================================
// 7. START SERVER
// ==========================================

const PORT = process.env.PORT || 3000;


server.listen(PORT, () => {

    console.log(
        `ProtoPlasma backend running on port ${PORT}`
    );

    console.log(
        `Backend URL: http://localhost:${PORT}`
    );


    // ======================================
    // AUTO-START SIMULATION
    // Temporary for frontend integration
    // ======================================

    simulation.start();

    console.log(
        "Simulation started automatically"
    );

});