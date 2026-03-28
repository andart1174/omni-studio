import * as Tesseract from 'tesseract.js';

export interface BlurRegion {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const detectAndBlurSensitiveData = async (
    file: File,
    patterns: RegExp[] = [
        /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, // Credit Cards
        /\b\d{3}-\d{2}-\d{4}\b/g, // SSN (US style, example)
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g // Emails
    ]
): Promise<string> => {
    console.log("[PrivacyEngine] Starting detection for:", file.name);
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = async () => {
             console.log("[PrivacyEngine] Image loaded, dimensions:", img.width, "x", img.height);
             const canvas = document.createElement('canvas');
             canvas.width = img.width;
             canvas.height = img.height;
             const ctx = canvas.getContext('2d');
             if (!ctx) {
                 URL.revokeObjectURL(objectUrl);
                 return reject(new Error("Canvas context failed"));
             }
             ctx.drawImage(img, 0, 0);

             try {
                 console.log("[PrivacyEngine] Running OCR (this may take a few seconds)...");
                 const result = await Tesseract.recognize(img, 'eng');
                 const words = (result as any).data.words;
                 console.log(`[PrivacyEngine] OCR complete. Analyzing ${words.length} words...`);
                 
                 // Reconstruct full text and track word character spans to handle matches across spaces
                 let fullText = "";
                 const wordSpans: { word: any; start: number; end: number }[] = [];
                 words.forEach((word: any) => {
                     const start = fullText.length;
                     fullText += word.text + " ";
                     const end = fullText.length - 1; // index before space
                     wordSpans.push({ word, start, end });
                 });
                 
                 let sensitiveCount = 0;
                 patterns.forEach(pattern => {
                     // Ensure pattern search starts from beginning
                     pattern.lastIndex = 0;
                     let match;
                     while ((match = pattern.exec(fullText)) !== null) {
                         sensitiveCount++;
                         const matchStart = match.index;
                         const matchEnd = matchStart + match[0].length;
                         
                         // Find all word bounding boxes that overlap with this regex match
                         wordSpans.forEach(span => {
                             if (span.end > matchStart && span.start < matchEnd) {
                                 const { x0, y0, x1, y1 } = span.word.bbox;
                                 blurArea(ctx, x0 - 2, y0 - 2, (x1 - x0) + 4, (y1 - y0) + 4);
                             }
                         });
                     }
                 });
                 
                 console.log(`[PrivacyEngine] Found and blurred ${sensitiveCount} sensitive sequences.`);

                 canvas.toBlob((blob) => {
                     URL.revokeObjectURL(objectUrl);
                     if (blob) {
                         resolve(URL.createObjectURL(blob));
                     } else {
                         reject(new Error("Blob failed"));
                     }
                 }, 'image/jpeg', 0.9);
             } catch (err) {
                 console.error("[PrivacyEngine] Error during OCR/Processing:", err);
                 URL.revokeObjectURL(objectUrl);
                 reject(err);
             }
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error("Failed to load image"));
        };
        img.src = objectUrl;
    });
};

export const blurArea = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number = 20
) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.filter = `blur(${radius}px)`;
    ctx.drawImage(ctx.canvas, 0, 0);
    ctx.restore();

    // Optional: add a semi-transparent overlay to make it look "processed"
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(x, y, w, h);
};

export const manualBlur = async (file: File, regions: BlurRegion[]): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject("Canvas failure");

            ctx.drawImage(img, 0, 0);
            regions.forEach(r => blurArea(ctx, r.x, r.y, r.width, r.height));

            canvas.toBlob((blob) => {
                if (blob) resolve(URL.createObjectURL(blob));
                else reject("Blob failure");
            }, 'image/jpeg', 0.9);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
};
