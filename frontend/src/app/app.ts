import { Component } from '@angular/core';
import { SimulationDashboardComponent } from './components/simulation-dashboard/simulation-dashboard.component';

@Component({
  selector: 'app-root',
  imports: [SimulationDashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
