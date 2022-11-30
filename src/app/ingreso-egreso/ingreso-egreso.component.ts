import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as actions from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoEgresoForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  loadingSubs!: Subscription;

  constructor(private _formBuilder: FormBuilder, private _ingresoEgresoService: IngresoEgresoService, private _store: Store<AppState>) {

    this.ingresoEgresoForm = this._formBuilder.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.loadingSubs = this._store.select('ui').subscribe(ui => this.cargando = ui.isLoading);
  }

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }

  guardar() {


    if (this.ingresoEgresoForm.invalid) { return; }

    this._store.dispatch(actions.isLoading());

    const { descripcion, monto } = this.ingresoEgresoForm.value;

    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

    this._ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then(ref => {
        this.ingresoEgresoForm.reset();
        this._store.dispatch(actions.stopLoading());
        Swal.fire('Registro creado', descripcion);
      })
      .catch(error => {
        this._store.dispatch(actions.stopLoading());
        Swal.fire('Error', error.message)
      });

  }

}
