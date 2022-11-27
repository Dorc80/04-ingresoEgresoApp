import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, Subscription } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import * as actions from "../auth/auth.actions";
import { AppState } from '../app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSuscription!: Subscription;

  constructor(
    private _auth: AngularFireAuth,
    private _firestore: AngularFirestore,
    private _store: Store<AppState>
  ) { }

  initAuthListener() {

    this._auth.authState.subscribe(fuser => {

      if (fuser) {

        this.userSuscription = this._firestore.doc(`${fuser?.uid}/usuario`).valueChanges().subscribe(firestoreUser => {
          console.log(firestoreUser);

          const user = Usuario.fromFirebase(firestoreUser);
          this._store.dispatch(actions.setUser({ user: { ...user } }))

        });

      } else {
        this.userSuscription.unsubscribe();
        console.log('que pasoooooo');
        this._store.dispatch(actions.unSetUser());
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
