function serializeState(world, tick) {

    return {

        timestamp: Date.now(),

        tick: tick,

        bounds: {
            width: world.width,
            height: world.height
        },

        particles: world.particles.map((particle) => ({

            id: particle.id,

            x: particle.x,
            y: particle.y,

            vx: particle.vx,
            vy: particle.vy,

            radius: particle.radius,
            charge: particle.charge,
            color: particle.color
        }))
    };
}

module.exports = serializeState;