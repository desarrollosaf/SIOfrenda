// redirect.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';


@Component({
  selector: 'app-redirect',
  standalone: true,
  template: ''
})
export class RedirectComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);

  ngOnInit(): void {

    const rfc = this.userService.currentUserValue?.rfc ?? '';
    const role = rfc.startsWith('GEN25') ? 'GEN25' : 'usuario';

    if (role == 'GEN25') {
      this.router.navigate(['/reportes']);
    } else {
      this.router.navigate(['/cuestionario']);
    }
  }
}
