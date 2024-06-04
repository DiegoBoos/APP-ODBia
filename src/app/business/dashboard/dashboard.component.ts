import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
  signal,
} from '@angular/core';

import { UsageService } from '@services/usage.service';
import { environment } from '@environment/environment';
import { SidemenuComponent } from '@shared/components/sidemenu/sidemenu.component';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ChartComponent,
  NgApexchartsModule,
  ApexPlotOptions,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidemenuComponent, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardComponent {
  @ViewChild('chart') chart: ChartComponent | undefined = undefined;

  public usageService = inject(UsageService);
  public apexChart: ApexChart = {
    height: 350,
    type: 'radialBar',
  };

  public isLoading = signal(false);


  public plotOptions: ApexPlotOptions = {
    radialBar: {
      // Opciones específicas para configurar las barras radiales
      dataLabels: {
        show: true, // Asegúrate de que el contenedor general de dataLabels esté activo
        name: {
          show: true, // Muestra los nombres de las etiquetas (opcional)
          fontSize: '22px',
        },
        value: {
          show: false, // Desactiva la visualización de valores
        },
      },
    },
  };

  constructor() {}

  increaseLimit() {
    this.isLoading.set(true);
    this.usageService.createCheckout().subscribe({
      next: (url) => {
        if (url) {
          window.open(url, '_self');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load the URL', err);
        this.isLoading.set(false);
      }
    });
  }
}
