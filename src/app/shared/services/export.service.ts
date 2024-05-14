import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor() {}

  exportToExcel(data: any, fileName: string): void {

    const objetsArray = this.getArrayProperties(data);
    
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    
    if (objetsArray.length>0) {
      objetsArray.map((i) => {
        // console.log(data[i]);
        const dataArray = data[i];
        if (dataArray.length>0) {
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataArray);
          XLSX.utils.book_append_sheet(wb, ws, i);
    
          // Ajustar el ancho de las columnas según el contenido más largo
          const range = XLSX.utils.decode_range(ws['!ref']!);
          for (let C = range.s.c; C <= range.e.c; ++C) {
            let maxLength = 0;
            for (let R = range.s.r; R <= range.e.r; ++R) {
              const cellValue = ws[XLSX.utils.encode_cell({ r: R, c: C })];
              if (cellValue && cellValue.v) {
                const len = cellValue.v.toString().length;
                if (len > maxLength) {
                  maxLength = len;
                }
              }
            }
            if (maxLength > 0) {
              ws['!cols'] = ws['!cols'] || [];
              ws['!cols'][C] = { wch: maxLength + 1 };
            }
          }
        }
  
      });
      
    } else {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
          XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
    
          // Ajustar el ancho de las columnas según el contenido más largo
          const range = XLSX.utils.decode_range(ws['!ref']!);
          for (let C = range.s.c; C <= range.e.c; ++C) {
            let maxLength = 0;
            for (let R = range.s.r; R <= range.e.r; ++R) {
              const cellValue = ws[XLSX.utils.encode_cell({ r: R, c: C })];
              if (cellValue && cellValue.v) {
                const len = cellValue.v.toString().length;
                if (len > maxLength) {
                  maxLength = len;
                }
              }
            }
            if (maxLength > 0) {
              ws['!cols'] = ws['!cols'] || [];
              ws['!cols'][C] = { wch: maxLength + 1 };
            }
          }
    }

    // Guardar el archivo en formato blob
    XLSX.writeFile(wb, fileName, { bookType: 'xlsx', type: 'file' });
  }

  getArrayProperties(obj: any): string[] {
    
    const arrayProperties: string[] = [];
    for (const key in obj) {

      if (Array.isArray(obj[key])) {
        arrayProperties.push(key);
      }
    }
    return arrayProperties;
  }
}
