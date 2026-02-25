import Tesseract from 'tesseract.js';

/**
 * OCR Engine - Extract text from images
 */

export async function extractText(file: File): Promise<string> {
    const result = await Tesseract.recognize(
        file,
        'ron', // Romanian language support
        { logger: m => console.log(m) }
    );
    return result.data.text;
}
