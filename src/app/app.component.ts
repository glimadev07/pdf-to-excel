import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PdfService } from './pdf.service';
import { ExcelService } from './exel.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private excelService: ExcelService,
    private pdfService: PdfService
  ) { }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file && file.type === 'application/pdf') {
      const extractedText = await this.pdfService.extractTextFromPdf(file);

      const dataForExcel = this.processExtractedData(extractedText);

      this.excelService.exportDataToExcel(dataForExcel, 'dados_extraidos');
    }
  }

  processExtractedData(extractedText: string): any[] {
    const lines = extractedText.split('\n');

    const data = lines.map((line) => {
      const columns = line.split(/\s+/);

      return {
        'Razão Social': columns[0],
        'Endereço': `${columns[1]} ${columns[2]} ${columns[3]} ${columns[4]}`,
        'Cidade': columns[5],
        'CEP': columns[6],
        'UF': columns[7],
        'CNPJ': columns[8],
        'Telefone': columns[9],
      };
    });

    return data;
  }
}

