import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { SimulationState } from '../models/simulation.model';

const BACKEND_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class SocketService {
  readonly connectionStatus = signal('Connecting...');

  private readonly socket: Socket;
  private readonly simulationUpdates = new Subject<SimulationState>();

  readonly physicsUpdates$: Observable<SimulationState> =
    this.simulationUpdates.asObservable();

  constructor() {
    this.socket = io(BACKEND_URL);

    this.socket.on('connect', () => {
      this.connectionStatus.set('Backend Connected');
    });

    this.socket.on('disconnect', () => {
      this.connectionStatus.set('Backend Disconnected');
    });

    this.socket.on('connect_error', () => {
      this.connectionStatus.set('Backend Unavailable');
    });

    this.socket.on('physics_update', (state: SimulationState) => {
      if (state && Array.isArray(state.particles)) {
        this.simulationUpdates.next(state);
      }
    });
  }
}
