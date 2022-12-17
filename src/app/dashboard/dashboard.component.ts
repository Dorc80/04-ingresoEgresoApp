import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import { setItems } from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubscription!: Subscription;
  ingresosSubs!: Subscription;

  constructor(private _store: Store<AppState>, private _ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.userSubscription = this._store.select('user')
      .pipe(
        filter(({ user }) => user != null)
      )
      .subscribe(user => {
        this.ingresosSubs = this._ingresoEgresoService.initIngresosEgresosListener(user.user?.uid!).subscribe(
          ingresosEgresosFB => {
            this._store.dispatch(setItems({ items: ingresosEgresosFB }))
          }
        );
      });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.ingresosSubs.unsubscribe();
  }

}
