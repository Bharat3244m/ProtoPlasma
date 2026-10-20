const Particle = require("./Particle");
const config = require("../config/simulationConfig");

class PhysicsWorld {

    constructor() {

        this.width = config.WIDTH;
        this.height = config.HEIGHT;

        this.particles = [];

        this.createParticles();
    }


    createParticles() {

        this.particles.length = 0;

        for (let i = 0; i < config.PARTICLE_COUNT; i++) {

            const radius = config.PARTICLE_RADIUS;

            // Keep particles inside the simulation box
            const x =
                radius +
                Math.random() *
                (this.width - 2 * radius);

            const y =
                radius +
                Math.random() *
                (this.height - 2 * radius);

            // Random initial velocities
            const vx = (Math.random() - 0.5) * 6;
            const vy = (Math.random() - 0.5) * 6;

            // Random positive/negative charge
            const charge =
                Math.random() > 0.5 ? 1 : -1;

            const particle = new Particle(
                i + 1,
                x,
                y,
                vx,
                vy,
                charge,
                radius
            );

            this.particles.push(particle);
        }
    }


    step() {

        for (const particle of this.particles) {

            this.updatePosition(particle);

            this.handleBoundaryCollision(particle);
        }
    }


    updatePosition(particle) {

        particle.x += particle.vx * config.DT;
        particle.y += particle.vy * config.DT;
    }


    handleBoundaryCollision(particle) {

        // LEFT WALL
        if (particle.x - particle.radius <= 0) {

            particle.x = particle.radius;
            particle.vx *= -1;
        }


        // RIGHT WALL
        else if (
            particle.x + particle.radius >= this.width
        ) {

            particle.x =
                this.width - particle.radius;

            particle.vx *= -1;
        }


        // TOP WALL
        if (particle.y - particle.radius <= 0) {

            particle.y = particle.radius;
            particle.vy *= -1;
        }


        // BOTTOM WALL
        else if (
            particle.y + particle.radius >= this.height
        ) {

            particle.y =
                this.height - particle.radius;

            particle.vy *= -1;
        }
    }


    reset() {

        this.createParticles();
    }
}

module.exports = PhysicsWorld;