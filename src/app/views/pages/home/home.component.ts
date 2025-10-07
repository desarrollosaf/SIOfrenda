import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

   formularioOfrenda: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formularioOfrenda = this.fb.group({
      nombreEdificio: ['', Validators.required],
      direccion: ['', Validators.required],
      nombreResponsable: ['', Validators.required],
      cargo: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      descripcionLugar: ['', Validators.required],
      pisoArea: ['', Validators.required],
      aceptoCondiciones: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.formularioOfrenda.valid) {
      console.log('Formulario enviado:', this.formularioOfrenda.value);
      // Aquí puedes hacer POST a tu backend o mostrar confirmación
    }
  }

}
