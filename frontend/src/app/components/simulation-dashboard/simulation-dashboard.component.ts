import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Particle } from '../../models/simulation.model';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-simulation-dashboard',
  templateUrl: './simulation-dashboard.component.html',
  styleUrl: './simulation-dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimulationDashboardComponent implements AfterViewInit {
  @ViewChild('plasmaCanvas')
  private readonly canvas?: ElementRef<HTMLCanvasElement>;

  private readonly socketService = inject(SocketService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);
  private animationFrameId?: number;
  private particles: Particle[] = [];
  private frames = 0;
  private lastFrameTime = performance.now();

  readonly fps = signal(0);
  readonly particleCount = signal(0);
  readonly lastTick = signal(0);
  readonly connectionStatus = this.socketService.connectionStatus;

  constructor() {
    this.socketService.physicsUpdates$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        this.particles = state.particles;
        this.particleCount.set(state.particles.length);
        this.lastTick.set(state.tick);
      });

    this.destroyRef.onDestroy(() => {
      if (this.animationFrameId !== undefined) {
        cancelAnimationFrame(this.animationFrameId);
      }
    });
  }

  ngAfterViewInit(): void {
    const canvas = this.canvas?.nativeElement;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return;
    }

    this.zone.runOutsideAngular(() => this.render(canvas, context));
  }

  private render(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
    context.fillStyle = '#1A1A24';
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (const particle of this.particles) {
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius || 5, 0, Math.PI * 2);
      context.fillStyle = particle.color || '#00ADB5';
      context.shadowBlur = 10;
      context.shadowColor = context.fillStyle;
      context.fill();
    }

    context.shadowBlur = 0;
    this.updateFps();
    this.animationFrameId = requestAnimationFrame(() => this.render(canvas, context));
  }

  private updateFps(): void {
    this.frames++;
    const now = performance.now();

    if (now - this.lastFrameTime >= 1000) {
      this.zone.run(() => this.fps.set(this.frames));
      this.frames = 0;
      this.lastFrameTime = now;
    }
  }
}
