import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  exportDataToExcel(data: any[], fileName: string): void {
    try {
      // Verifica se há dados para exportar
      if (!data || data.length === 0) {
        console.error('Nenhum dado fornecido para exportação.');
        return;
      }

      // Cria uma planilha a partir dos dados
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

      // Cria um novo workbook e adiciona a planilha
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Dados');

      // Define opções de escrita (opcional, pode ser omitido se não for necessário)
      const writeOptions: XLSX.WritingOptions = {
        bookType: 'xlsx',
        type: 'array',
        compression: true,  // Se o arquivo for grande, isso pode ajudar a compactar
      };

      // Gera e baixa o arquivo Excel
      XLSX.writeFile(wb, `${fileName}.xlsx`, writeOptions);

      console.log(`Arquivo ${fileName}.xlsx gerado com sucesso.`);
    } catch (error) {
      console.error('Erro ao exportar dados para Excel:', error);
    }
  }

}
