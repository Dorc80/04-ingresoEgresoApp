import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _auth: AngularFireAuth, private _firestore: AngularFirestore) { }

  initAuthListener() {

    this._auth.authState.subscribe(fuser => {
      console.log(fuser);
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
