import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private _firestore: AngularFirestore, private _authService: AuthService) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {

    const uid = this._authService.user.uid

    console.log('ingresoEgreso2', ingresoEgreso);

    const { uid: _uid, ...resto } = ingresoEgreso

    return this._firestore.doc(`${uid}/ingresos-egresos`)
      .collection('items').add({ ...resto });
  }

  initIngresosEgresosListener(uid: string) {
    // return this._firestore.collection(`${uid}/ingresos-egresos/items/`).valueChanges();
    return this._firestore.collection(`${uid}/ingresos-egresos/items/`).snapshotChanges()
      .pipe(
        map(snapshot => snapshot.map(doc => ({
          uid: doc.payload.doc.id,
          ...doc.payload.doc.data() as any
        })
        )
        )
      );
  }

  borrarIngresoEgreso(uidItem: string) {
    return this._firestore.doc(`${this._authService.user.uid}/ingresos-egresos/items/${uidItem}`).delete();
  }

}
