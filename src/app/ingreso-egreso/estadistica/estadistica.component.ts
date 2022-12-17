import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';

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

  constructor(private _store: Store<AppState>) { }

  ngOnInit(): void {
    this.ingresosEgresosSubs = this._store.select('ingresosEgresos').subscribe(({ items }) => this.generarEstadisitica(items));
  }

  generarEstadisitica(items: IngresoEgreso[]) {

    for (const item of items) {
      if (item.tipo === 'ingreso') {
        this.totalIngresos += item.monto;
        this.ingresos++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos++;
      }
    }

  }

  ngOnDestroy(): void {
    this.ingresosEgresosSubs.unsubscribe();
  }

}
