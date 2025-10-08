import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ColumnMode, DatatableComponent, NgxDatatableModule } from '@siemens/ngx-datatable';
import { RouterModule } from '@angular/router';
import { OfrendaService } from '../../../service/ofrenda.service'


@Component({
  selector: 'app-registros',
  imports: [NgxDatatableModule, CommonModule, RouterModule],
  templateUrl: './registros.component.html',
  styleUrl: './registros.component.scss'
})
export class RegistrosComponent {

  originalData: any[] = [];
  temp: any[] = [];
  rows: any[] = [];
  page: number = 0;
  pageSize: number = 10;
  filteredCount: number = 0;
  loading: boolean = true;
  sorts: any[] = [];
  filtroDependencia: string = '';
  filtroDireccion: string = '';
  filtroDepartamento: string = '';
  constructor(private ofrendaService: OfrendaService) { }

  ngOnInit(): void {
    this.getServidoresP();

  }

  getServidoresP() {
    this.ofrendaService.getRegistro().subscribe({
      next: (response: any) => {
        console.log(response);
        this.originalData = [...response.data];
        this.temp = [...this.originalData];
        this.filteredCount = this.temp.length;
        this.setPage({ offset: 0 });
        this.loading = false;
      },
      error: (e: HttpErrorResponse) => {
        console.error(e);
      },
    });
  }

  setPage(pageInfo: any) {
    this.page = pageInfo.offset;
    const start = this.page * this.pageSize;
    const end = start + this.pageSize;
    this.rows = this.temp.slice(start, end);
  }

  updateFilter(event: any) {
    const val = (event.target?.value || '').toLowerCase();
    this.temp = this.originalData.filter((row: any) => {
      const nombre = row.Nombre?.toLowerCase() || '';
      const dependencia = row.dependencia?.nombre_completo?.toLowerCase() || '';
      const direccion = row.direccion?.nombre_completo?.toLowerCase() || '';
      const departamento = row.departamento?.nombre_completo?.toLowerCase() || '';
      return (
        nombre.includes(val) ||
        dependencia.includes(val) ||
        direccion.includes(val) ||
        departamento.includes(val)
      );
    });
    this.filteredCount = this.temp.length;
    this.setPage({ offset: 0 });
  }

  descargarPDF(row: any) {
    // console.log('Descargando PDF para:', row);
    const url = row.urlPDF;
    window.open(url, '_blank');
  }

}
