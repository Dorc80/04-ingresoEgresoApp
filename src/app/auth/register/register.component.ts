import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) {

    this.registroForm = this._formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

  }

  ngOnInit(): void {


  }

  crearUsuario() {

    if (this.registroForm.invalid) { return; }

    const { nombre, correo, password } = this.registroForm.value;

    this._authService.crearUsuario(nombre, correo, password)
      .then(credenciales => this._router.navigate(['/login']))
      .catch(error => console.error(error));


  }

}
