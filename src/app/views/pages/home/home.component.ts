import { Component, OnInit, inject} from '@angular/core';
import {FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl} from '@angular/forms'
import { CommonModule } from '@angular/common';
import {OfrendaService} from '../../../service/ofrenda.service'


@Component({
  selector: 'app-home',
  imports: [CommonModule,FormsModule,ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent  implements OnInit {
  ofrendaForm!: FormGroup;
  enviado = false;

  public ofrendaService  =  inject( OfrendaService )

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.ofrendaForm = this.fb.group({
      rfc: ['', Validators.required],
      edificio: ['', Validators.required],
      direccion: ['', Validators.required],
      responsable: ['', Validators.required],
      cargo: ['', Validators.required],
      telefono: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      descripcion: ['', Validators.required],
      piso: ['', Validators.required],
      acepta: [false, Validators.requiredTrue],
    });
  }

  get f() {
    return this.ofrendaForm.controls;
  }

  onSubmit(): void {
    console.log('enviado')
    this.enviado = true;
    if (this.ofrendaForm.invalid)  return;

    const datos = this.ofrendaForm.value;

    console.log(datos)

    
    this.ofrendaService.saveRegistro(datos).subscribe({
      next: (res) => {
        alert('Registro enviado con éxito ');
        this.ofrendaForm.reset();
      },
      error: (err) => {
        console.error(err);
        alert('Ocurrió un error al enviar el registro.');
      },
    });
  }
}
