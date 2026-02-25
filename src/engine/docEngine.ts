import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';

/**
 * Document Engine - Generate PDF and Word files
 */

export async function imagesToPdf(files: File[]): Promise<string> {
    const doc = new jsPDF();

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dataUrl = await fileToDataUrl(file);

        if (i > 0) doc.addPage();

        const img = await loadImage(dataUrl);
        const imgProps = doc.getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        doc.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }

    const blob = doc.output('blob');
    return URL.createObjectURL(blob);
}

export async function textToDocx(text: string): Promise<string> {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun(text),
                    ],
                }),
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    return URL.createObjectURL(blob);
}

// Helpers
function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}
