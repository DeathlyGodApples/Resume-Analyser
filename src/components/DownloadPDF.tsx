import { Download } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ResumeAnalysis } from '../types';

interface DownloadPDFProps {
  analysis: ResumeAnalysis | null;
  isDisabled?: boolean;
}

export function DownloadPDF({ analysis, isDisabled }: DownloadPDFProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadAsPDF = async () => {
    if (!analysis) {
      console.error('No analysis data available');
      return;
    }
    
    setIsGenerating(true);
    try {
      console.log('Starting PDF generation...');
      
      const element = document.querySelector('.analysis-section');
      if (!element) {
        console.error('Could not find analysis-section element');
        return;
      }
      console.log('Found analysis section:', element);

      // Add a small delay to ensure content is rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      // Force a repaint before capturing
      await new Promise(resolve => requestAnimationFrame(resolve));

      console.log('Generating canvas...');
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: true,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });
      console.log('Canvas generated:', canvas);

      // A4 dimensions in mm
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 65; // Start position after header

      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add header
      pdf.setFontSize(20);
      pdf.setTextColor(44, 62, 80); // Dark blue header
      pdf.text('Resume Analysis Report', 105, 15, { align: 'center' });
      
      // Add metadata
      pdf.setFontSize(12);
      pdf.setTextColor(108, 117, 125); // Gray text
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      pdf.text(`Generated on: ${date}`, 105, 25, { align: 'center' });
      
      // Add scores summary
      pdf.setFontSize(14);
      pdf.setTextColor(44, 62, 80);
      pdf.text('ATS Compatibility Scores:', 20, 35);
      
      pdf.setFontSize(12);
      pdf.setTextColor(108, 117, 125);
      pdf.text(`Original Score: ${analysis.originalScore}%`, 20, 45);
      pdf.text(`Optimized Score: ${analysis.optimizedScore}%`, 20, 52);

      // Add main content
      while (heightLeft > 0) {
        const currentHeight = Math.min(heightLeft, pageHeight - position);
        const canvasPage = document.createElement('canvas');
        canvasPage.width = canvas.width;
        canvasPage.height = (currentHeight * canvas.width) / imgWidth;

        const ctx = canvasPage.getContext('2d');
        if (!ctx) {
          console.error('Could not get canvas context');
          throw new Error('PDF generation failed');
        }

        // Calculate the portion of the original canvas to use
        const sourceHeight = (currentHeight * canvas.width) / imgWidth;
        const sourceY = canvas.height - heightLeft * (canvas.width / imgWidth);

        ctx.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          sourceHeight,
          0,
          0,
          canvasPage.width,
          canvasPage.height
        );

        pdf.addImage(
          canvasPage.toDataURL('image/png'),
          'PNG',
          0,
          position,
          imgWidth,
          currentHeight
        );

        heightLeft -= (pageHeight - position);

        if (heightLeft > 0) {
          pdf.addPage();
          position = 15; // Reset position for new page
        }
      }

      // Add page numbers
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      }

      const fileName = `Resume_Analysis_${new Date().toISOString().split('T')[0]}.pdf`;
      console.log('Saving PDF:', fileName);
      pdf.save(fileName);
      console.log('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={downloadAsPDF}
      disabled={isDisabled || isGenerating || !analysis}
      className="btn-neumorph flex items-center gap-2 px-4 py-2 text-sm"
      title="Download analysis as PDF"
    >
      {isGenerating ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-accent-blue border-t-transparent rounded-full" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </>
      )}
    </button>
  );
}