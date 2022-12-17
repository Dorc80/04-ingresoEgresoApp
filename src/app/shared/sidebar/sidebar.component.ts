import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from '../../app.reducer';
import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre: string = '';
  userSubs!: Subscription;

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _store: Store<AppState>) { }

  ngOnInit(): void {
    this.userSubs = this._store.select('user')
      .pipe(
        filter(({ user }) => user != null)
      )
      .subscribe(({ user }) => this.nombre = user!.nombre)
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }

  logout() {
    this._auth.logout()
      .then(() => this._router.navigate(['/login']))
      .catch(error => console.log(error));
  }

}
