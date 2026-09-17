import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OfrendaService } from '../../../service/ofrenda.service';
import Swal from 'sweetalert2';

interface Decor {
  left: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

interface Picado {
  delay: number;
  color: string;
}

interface Candle {
  x: number;
  y: number;
  height: number;
}

interface Marigold {
  cx: number;
  cy: number;
  scale: number;
}

interface Leaf {
  cx: number;
  cy: number;
  rotate: number;
}

interface CalendarCard {
  num: string;
  tag: string;
  month: string;
  title: string;
  desc: string;
}

interface EvalCard {
  num: string;
  title: string;
  desc: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  ofrendaForm!: FormGroup;
  enviado = false;
  enviadoExitoso = false;
  registroActivo = true;
  ultimoRegistro: { edificio: string; responsable: string; email: string } | null = null;

  public ofrendaService = inject(OfrendaService);

  // ---- Materiales: tabs ----
  materialesPermitidos = true;

  // ---- Cuenta regresiva ----
  private readonly registroAbre = new Date(2026, 9, 21, 0, 0, 0).getTime();
  private readonly registroCierra = new Date(2026, 9, 26, 0, 0, 0).getTime();
  private countdownTimer: ReturnType<typeof setInterval> | undefined;
  countdownKicker = 'Faltan para abrir el registro';
  countdownTitle = 'La cuenta regresiva ya empezó';
  countdownVisible = true;
  cd = { d: '00', h: '00', m: '00', s: '00' };

  // ---- Contenido decorativo (papel picado, pétalos, velas, flores, hojas) ----
  picadoBanners: Picado[] = [];
  petals: Decor[] = [];
  candles: Candle[] = [];
  marigolds: Marigold[] = [];
  leaves: Leaf[] = [];

  readonly calendario: CalendarCard[] = [
    { num: '21–25', tag: 'Registro', month: 'Octubre de 2026', title: 'Inscripción en línea', desc: 'Registro del equipo en este portal. Al concluir, el representante recibe el cráneo base.' },
    { num: '26', tag: 'Montaje', month: 'Octubre de 2026', title: 'Instalación de cráneos', desc: 'Único día de montaje en el Salón Benito Juárez. No se otorgará prórroga.' },
    { num: '29', tag: 'Evaluación', month: 'Octubre de 2026', title: 'Revisión del comité', desc: 'Cada equipo presenta brevemente el sentido de su obra ante el comité evaluador.' },
    { num: '30', tag: 'Premiación', month: 'Octubre de 2026', title: 'Ceremonia de premiación', desc: 'Se dan a conocer los resultados y se entregan reconocimientos.' },
  ];

  readonly evaluacion: EvalCard[] = [
    { num: '01', title: 'Simbología', desc: 'Elementos que conforman el cráneo y su apego a la tradición del Día de Muertos.' },
    { num: '02', title: 'Interpretación', desc: 'Sentido de la obra y conocimiento del tema, con una explicación breve a cargo del equipo.' },
    { num: '03', title: 'Presentación visual', desc: 'Creatividad, técnica en el uso de materiales, escala monumental y calidad del acabado.' },
  ];

  readonly materialesPermitidosLista = [
    'Cartonería', 'Papel maché', 'Madera', 'Materiales reciclados', 'Flores naturales',
    'Flores artificiales', 'Lentejuela', 'Cristal', 'Chaquira', 'Telas', 'Semillas', 'Pintura base agua'
  ];

  readonly materialesProhibidosLista = [
    'Thinner', 'Gasolina', 'Alcohol', 'Aguarrás', 'Solventes', 'Aerosoles',
    'Lacas y pinturas a base de solvente', 'Pegamentos de contacto', 'Velas encendidas', 'Fuego'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registroActivo = true;

    this.ofrendaForm = this.fb.group({
      rfc: ['', Validators.required],
      responsable: ['', Validators.required],
      cargo: ['', Validators.required],
      edificio: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      descripcion: ['', Validators.required],
      piso: ['', Validators.required],
      acepta: [false, Validators.requiredTrue],
    });

    this.buildDecor();
    this.tickCountdown();
    this.countdownTimer = setInterval(() => this.tickCountdown(), 1000);
  }

  ngOnDestroy(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }

  get f() {
    return this.ofrendaForm.controls;
  }

  // ---- RFC: mayúsculas mientras escribe ----
  onRfcInput(): void {
    const ctrl = this.ofrendaForm.get('rfc');
    const value = (ctrl?.value || '').toUpperCase().replace(/\s/g, '');
    ctrl?.setValue(value, { emitEvent: false });
  }

  onRfcBlur() {
    const rfc = this.ofrendaForm.get('rfc')?.value;
    if (rfc && this.ofrendaForm.get('rfc')?.valid) {
      this.ofrendaService.getRFC(rfc).subscribe({
        next: (data) => {
          this.ofrendaForm.patchValue({
            responsable: '',
            cargo: ''
          });
          this.ofrendaForm.patchValue({
            responsable: data.Nombre,
            cargo: data.Puesto + ' / ' + data.departamento.nombre_completo
          });
        },
        error: (err) => {
          console.error('Error al obtener datos del RFC', err);
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Usuario no existe.',
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

    this.ofrendaService.saveRegistro(datos).subscribe({
      next: () => {
        this.ultimoRegistro = {
          edificio: datos.edificio,
          responsable: datos.responsable,
          email: datos.email,
        };
        this.enviadoExitoso = true;
        this.enviado = false;
        window.scrollTo({ top: document.getElementById('formulario')?.offsetTop ?? 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Ocurrió un error',
          text: 'No fue posible enviar el registro. Intenta de nuevo.',
        });
      },
    });
  }

  registrarOtro(): void {
    this.ofrendaForm.reset({ acepta: false });
    this.enviado = false;
    this.enviadoExitoso = false;
    this.ultimoRegistro = null;
  }

  toggleMateriales(permitidos: boolean): void {
    this.materialesPermitidos = permitidos;
  }

  private tickCountdown(): void {
    const now = Date.now();
    let target = this.registroAbre;

    if (now >= this.registroAbre && now < this.registroCierra) {
      target = this.registroCierra;
      this.countdownKicker = 'Registro abierto';
      this.countdownTitle = 'Inscribe a tu edificio antes del cierre';
    } else if (now >= this.registroCierra) {
      this.countdownVisible = false;
      this.countdownKicker = 'Registro concluido';
      this.countdownTitle = 'Gracias a todos los edificios participantes';
      return;
    } else {
      this.countdownKicker = 'Faltan para abrir el registro';
      this.countdownTitle = 'La cuenta regresiva ya empezó';
    }

    const diff = Math.max(0, target - now);
    const pad = (n: number) => String(n).padStart(2, '0');
    this.cd = {
      d: pad(Math.floor(diff / 86400000)),
      h: pad(Math.floor(diff / 3600000) % 24),
      m: pad(Math.floor(diff / 60000) % 60),
      s: pad(Math.floor(diff / 1000) % 60),
    };
  }

  private buildDecor(): void {
    const picadoColors = ['#96134b', '#bb945c', '#ffffff'];
    this.picadoBanners = Array.from({ length: 12 }, (_, i) => ({
      delay: i * 0.37,
      color: picadoColors[i % picadoColors.length],
    }));

    const petalColors = ['#96134b', '#bb945c'];
    this.petals = Array.from({ length: 21 }, (_, i) => ({
      left: (i * 47) % 100,
      size: 10 + (i % 6) * 2,
      color: petalColors[i % petalColors.length],
      duration: [9, 12, 15][i % 3],
      delay: -(i * 1.3) % 12,
    }));

    this.candles = [
      { x: 70, y: 150, height: 120 },
      { x: 108, y: 110, height: 150 },
      { x: 146, y: 185, height: 95 },
      { x: 392, y: 185, height: 95 },
      { x: 430, y: 110, height: 150 },
      { x: 468, y: 150, height: 120 },
    ];

    const marigoldPositions: Array<[number, number, number]> = [
      [80, 360, 1.2], [140, 330, 1.32], [120, 410, 1.26], [190, 400, 1.14],
      [60, 420, 0.9], [200, 350, 0.9], [480, 360, 1.2], [420, 330, 1.32],
      [440, 410, 1.26], [370, 400, 1.14], [500, 420, 0.9], [360, 350, 0.9],
    ];
    this.marigolds = marigoldPositions.map(([cx, cy, scale]) => ({ cx, cy, scale }));

    const leafPositions: Array<[number, number, number]> = [
      [30, 340, -30], [40, 390, 20], [230, 430, 30], [530, 340, 30],
      [520, 390, -20], [330, 430, -30], [100, 300, -50], [460, 300, 50],
    ];
    this.leaves = leafPositions.map(([cx, cy, rotate]) => ({ cx, cy, rotate }));
  }
}
