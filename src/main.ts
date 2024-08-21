import { AfterViewInit, Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // Importe o RouterModule
import { PdfService } from './app/pdf.service';
import { ExcelService } from './app/exel.service'; // Corrigido o nome do serviço para ExcelService

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app/app.component.html',
  imports: [RouterModule], // Adicione RouterModule aqui
})
export class App implements OnInit, AfterViewInit {
  teste: any;
  constructor(
    private excelService: ExcelService,
    private pdfService: PdfService
  ) { }

  ngOnInit() {
    console.log(this.teste);
  }

  ngAfterViewInit() {
    console.log(this.teste);
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file && file.type === 'application/pdf') {
      const extractedText = await this.pdfService.extractTextFromPdf(file);

      // Remove espaços extras no texto extraído
      const cleanedText = this.removeExtraSpaces(extractedText);

      // Supondo que você converta o texto extraído em um array de objetos para Excel
      const dataForExcel = this.processExtractedData(cleanedText);

      this.excelService.exportDataToExcel(dataForExcel, 'dados_extraidos');
    }
  }

  // Função para remover espaços entre partes de um e-mail
  removeExtraSpaces(text: string): string {
    return text.replace(/(\S+@\S+)\s+(\S+)\s+(\S+)/g, '$1$2$3');
  }

  processExtractedData(extractedText: string): any[] {
    // Regular expression to capture prices
    const pricePattern = /R\$ ?(\d{1,3}(?:\.\d{3})*,\d{2})/g;

    // Regular expression to capture the text after each price
    const followingTextPattern = /R\$ ?(\d{1,3}(?:\.\d{3})*,\d{2})\s+(.*?)(?=(?:R\$|\s*$))/g;

    // Normalize prices by removing spaces within them
    const normalizedText = extractedText.replace(/R\$ ?(\d{1,3})(?:\s*\.\s*(\d{3}))*,(\d{2})/g, (match, p1, p2, p3) => {
      let formattedPrice = `R$ ${p1}`;
      if (p2) {
        formattedPrice += `.${p2}`;
      }
      formattedPrice += `,${p3}`;
      return formattedPrice;
    });

    // Extract all prices
    const prices = normalizedText.match(pricePattern) || [];

    // Extract following text for each price
    const followingTexts: string[] = [];
    let match;
    while ((match = followingTextPattern.exec(normalizedText)) !== null) {
      followingTexts.push(match[2].trim()); // Capture the text after the price
    }

    // Map extracted prices and following texts into a data array
    const data = prices.map((price, index) => {
      return {
        'Preço': price,
        'MCR': followingTexts[index] || 'Não especificado', // Use 'Não especificado' if no text is found
        'Índice': index + 1, // Just for identification purposes
      };
    });

    return data;
  }



}

bootstrapApplication(App);
