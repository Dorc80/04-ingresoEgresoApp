import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../../app.reducer';
import { AuthService } from '../../services/auth.service';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean = false;
  uiSubscription!: Subscription;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _store: Store<AppState>,
    private _router: Router
  ) {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.uiSubscription = this._store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  login() {

    if (this.loginForm.invalid) { return; }

    this._store.dispatch(ui.isLoading());

    // Swal.fire({
    //   title: 'Espere por favor ',
    //   didOpen: () => {
    //     Swal.showLoading(null);
    //   }
    // });

    const { email, password } = this.loginForm.value;

    this._authService.loginUsuario(email, password)
      .then(() => {
        // Swal.close();
        this._store.dispatch(ui.stopLoading());
        this._router.navigate(['/'])
      })
      .catch(error => {
        this._store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        })
      });

  }

}
