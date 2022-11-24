import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;

  constructor(private _formBuilder: FormBuilder) {

    this.registroForm = this._formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

  }

  ngOnInit(): void {


  }

  crearUsuario() {

    console.log(this.registroForm);
    console.log(this.registroForm.valid);
    console.log(this.registroForm.value);

    console.log(this.registroForm.get('nombre')?.valid);

  }

}
