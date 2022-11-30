import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../../app.reducer';
import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosEgresosSubs!: Subscription;

  constructor(private _store: Store<AppState>, private _ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.ingresosEgresosSubs = this._store.select('ingresosEgresos').subscribe(({ items }) => {
      this.ingresosEgresos = items;
    });
  }

  ngOnDestroy(): void {
    this.ingresosEgresosSubs.unsubscribe();
  }

  borrar(uid: string) {
    console.log('uid', uid);
    this._ingresoEgresoService.borrarIngresoEgreso(uid)
      .then(() => Swal.fire('Borrado', 'Item borrado'))
      .catch(error => Swal.fire('Error', error.message));

  }

}
