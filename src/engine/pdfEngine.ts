/**
 * PDF Engine - Merge & Split Utilities
 */
import { jsPDF } from 'jspdf';

export async function mergeImagesToPDF(files: File[]): Promise<string> {
    const doc = new jsPDF();

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageData = await fileToDataURL(file);

        if (i > 0) doc.addPage();

        // Add image centered and fit to page
        const imgProps = doc.getImageProperties(imageData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const width = pdfWidth - 20;
        const height = (imgProps.height * width) / imgProps.width;

        doc.addImage(imageData, 'PNG', 10, 10, width, height);
    }

    const blob = doc.output('blob');
    return URL.createObjectURL(blob);
}

function fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error(`Failed to read file ${file.name}`));
        reader.readAsDataURL(file);
    });
}
