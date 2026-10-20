class Particle {

    constructor(id, x, y, vx, vy, charge, radius) {

        this.id = id;

        this.x = x;
        this.y = y;

        this.vx = vx;
        this.vy = vy;

        this.radius = radius;
        this.charge = charge;

        // Keep color here because it is part of
        // the agreed frontend data contract.
        this.color =
            charge === 1
                ? "#FF2E63"
                : "#00ADB5";
    }
}

module.exports = Particle;