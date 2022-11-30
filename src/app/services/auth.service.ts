import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, Subscription } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import * as actions from "../auth/auth.actions";
import { AppState } from '../app.reducer';
import { unSetItems } from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSuscription!: Subscription;
  private _user!: Usuario | null;

  constructor(
    private _auth: AngularFireAuth,
    private _firestore: AngularFirestore,
    private _store: Store<AppState>
  ) { }

  get user() {
    return { ...this._user };
  }

  initAuthListener() {

    this._auth.authState.subscribe(fuser => {

      if (fuser) {

        this.userSuscription = this._firestore.doc(`${fuser?.uid}/usuario`).valueChanges().subscribe(firestoreUser => {

          const user = Usuario.fromFirebase(firestoreUser);
          this._user = user;
          this._store.dispatch(actions.setUser({ user: { ...user } }))

        });

      } else if (this.userSuscription) {
        console.log('me sali y que pasa');
        this.userSuscription.unsubscribe();
        this._user = null;
        this._store.dispatch(actions.unSetUser());
        this._store.dispatch(unSetItems());
      }

    });

  }

  crearUsuario(nombre: string, email: string, password: string) {

    return this._auth.createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new Usuario(user!.uid, nombre, email);
        return this._firestore.doc(`${user?.uid}/usuario`).set({ ...newUser });
      });

  }

  loginUsuario(email: string, password: string) {

    return this._auth.signInWithEmailAndPassword(email, password);

  }

  logout() {
    return this._auth.signOut();
  }

  isAuth() {
    return this._auth.authState.pipe(
      map(fbUser => fbUser != null)
    );
  }

}
