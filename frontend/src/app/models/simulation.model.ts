export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  charge: number;
  color: string;
}

export interface SimulationState {
  timestamp: number;
  tick: number;
  bounds: {
    width: number;
    height: number;
  };
  particles: Particle[];
}
