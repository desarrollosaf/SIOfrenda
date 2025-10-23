import { Component, OnInit, inject} from '@angular/core';
import {FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl} from '@angular/forms'
import { CommonModule } from '@angular/common';
import {OfrendaService} from '../../../service/ofrenda.service'
import Swal from 'sweetalert2';


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
  registroActivo = true; 

  public ofrendaService  =  inject( OfrendaService )

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registroActivo = false
     Swal.fire({
      icon: 'info',
      title: 'Registro cerrado',
      html: `
        <p>El periodo de registro finalizó.</p>
        <p>Actualmente estamos en la etapa de <b>montaje</b>.</p>
        <p>¡Gracias por tu interés y mucha suerte a todos los participantes!</p>
      `,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#6A1B9A'
    });

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

  onRfcBlur() {
    const rfc = this.ofrendaForm.get('rfc')?.value;
    console.log(rfc)
    if (rfc && this.ofrendaForm.get('rfc')?.valid) {
      this.ofrendaService.getRFC(rfc).subscribe({
        next: (data) => {
          this.ofrendaForm.patchValue({
            responsable: '',
            cargo: ''
          });
          this.ofrendaForm.patchValue({
            responsable: data.Nombre,
            cargo: data.Puesto+' / '+data.departamento.nombre_completo
          });
        },
        error: (err) => {
          console.error('Error al obtener datos del RFC', err);
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Usuario no existe.",
            showConfirmButton: false,
            timer: 3000
          });

          this.ofrendaForm.patchValue({
            responsable: '',
            cargo: ''
          });
        }
      });
    }
  }

  

  
  onSubmit(): void {
    Swal.fire({
      icon: 'info',
      title: 'Registro cerrado',
      html: `
        <p>El periodo de registro finalizó.</p>
        <p>Actualmente estamos en la etapa de <b>montaje</b>.</p>
        <p>¡Gracias por tu interés y mucha suerte a todos los participantes!</p>
      `,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#6A1B9A'
    });
      return;

    this.enviado = true;
    if (this.ofrendaForm.invalid) {
      const telefonoControl = this.f['telefono'];
      const telefonoValue = telefonoControl.value;

      const emailControl = this.f['email'];
      const emailValue = emailControl.value;

      if (telefonoValue && telefonoControl.invalid) {
        Swal.fire({
          icon: 'error',
          title: 'Número de teléfono inválido',
          text: 'Ingresa solo 10 dígitos sin espacios ni guiones (por ejemplo: 5512345678).',
        });
        return;
      }

      if (emailValue && emailControl.invalid) {
        Swal.fire({
          icon: 'error',
          title: 'Correo electrónico inválido',
          text: 'Por favor ingresa un correo válido (ej. usuario@dominio.com).',
        });
        return;
      }

      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Por favor llena todos los campos.',
      });

      return;
    }

    const datos = this.ofrendaForm.value;

    console.log(datos)

    
    this.ofrendaService.saveRegistro(datos).subscribe({
      next: (res) => {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Envio exitoso.",
            showConfirmButton: false,
            timer: 3000
          });
        this.ofrendaForm.reset();
      },
      error: (err) => {
        console.error(err);
        alert('Ocurrió un error al enviar el registro.');
      },
    });
  }
}
