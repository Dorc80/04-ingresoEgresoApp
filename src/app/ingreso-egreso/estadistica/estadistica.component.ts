import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit, OnDestroy {

  ingresos: number = 0;
  egresos: number = 0;

  totalIngresos: number = 0;
  totalEgresos: number = 0;

  ingresosEgresosSubs!: Subscription;

  public doughnutChartLabels: string[] = [ 'Ingresos', 'Egresos' ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [ 350, 450 ] },
    ]
  };
  public doughnutChartType: ChartType = 'doughnut';

  constructor(private _store: Store<AppState>) { }

  ngOnInit(): void {
    this.ingresosEgresosSubs = this._store.select('ingresosEgresos').subscribe(({ items }) => this.generarEstadisitica(items));
  }

  generarEstadisitica(items: IngresoEgreso[]) {

    this.totalEgresos = 0;
    this.totalIngresos = 0;
    this.ingresos = 0;
    this.egresos = 0;

    for (const item of items) {
      if (item.tipo === 'ingreso') {
        this.totalIngresos += item.monto;
        this.ingresos++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos++;
      }
    }

    this.doughnutChartData.datasets = [
      { data: [ this.totalIngresos, this.totalEgresos ] },
    ]

  }

  ngOnDestroy(): void {
    this.ingresosEgresosSubs.unsubscribe();
  }

}
