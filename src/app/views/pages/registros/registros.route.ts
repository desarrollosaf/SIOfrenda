import { Routes } from "@angular/router";

export default [
    {
        path: '',
        loadComponent: () => import('./registros.component').then(c => c.RegistrosComponent)
    }
] as Routes;