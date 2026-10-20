const PhysicsWorld = require("./PhysicsWorld");
const config = require("../config/simulationConfig");
const serializeState = require("../utils/stateSerializer");

class SimulationEngine {

    constructor(io) {

        this.io = io;

        this.world = new PhysicsWorld();

        this.tick = 0;

        this.running = false;

        this.interval = null;
    }


    start() {

        // Prevent multiple loops from being started
        if (this.running) {
            return;
        }

        this.running = true;

        console.log("Simulation started");


        this.interval = setInterval(() => {

            this.update();

        }, 1000 / config.TICK_RATE);
    }


    update() {

        if (!this.running) {
            return;
        }


        // 1. Update physics
        this.world.step();


        // 2. Increase tick
        this.tick++;


        // 3. Create network state
        const state =
            serializeState(
                this.world,
                this.tick
            );


        // 4. Send to all connected clients
        this.io.emit(
            "physics_update",
            state
        );
    }


    pause() {

        if (!this.running) {
            return;
        }

        this.running = false;

        if (this.interval) {

            clearInterval(this.interval);

            this.interval = null;
        }

        console.log("Simulation paused");
    }


    reset() {

        this.pause();

        this.tick = 0;

        this.world.reset();

        const state =
            serializeState(
                this.world,
                this.tick
            );


        // Immediately show reset state
        this.io.emit(
            "physics_update",
            state
        );

        console.log("Simulation reset");
    }


    getState() {

        return serializeState(
            this.world,
            this.tick
        );
    }
}

module.exports = SimulationEngine;