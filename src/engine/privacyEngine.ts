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
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g // Emails
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
                 const result = await Tesseract.recognize(img, 'eng');
                 const words = (result as any).data.words;
                 
                 let sensitiveCount = 0;
                 words.forEach((word: any) => {
                     const isSensitive = patterns.some(pattern => pattern.test(word.text));
                     if (isSensitive) {
                         sensitiveCount++;
                         const { x0, y0, x1, y1 } = word.bbox;
                         blurArea(ctx, x0, y0, x1 - x0, y1 - y0);
                     }
                 });
                 
                 canvas.toBlob((blob) => {
                     URL.revokeObjectURL(objectUrl);
                     if (blob) {
                         resolve(URL.createObjectURL(blob));
                     } else {
                         reject(new Error("Blob failed"));
                     }
                 }, 'image/jpeg', 0.9);
             } catch (err) {
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
