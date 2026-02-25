/**
 * Visual Engine - Provides artistic filters and image transformations
 */

export type FilterType = 'pencil' | 'anime' | 'pixel' | 'vintage' | 'blueprint';

export async function applyFilter(file: File, filterType: FilterType): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject('Could not get canvas context');

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                switch (filterType) {
                    case 'pencil':
                        applyPencilFilter(imageData);
                        break;
                    case 'anime':
                        applyAnimeFilter(imageData);
                        break;
                    case 'pixel':
                        applyPixelFilter(ctx, img, canvas.width, canvas.height);
                        // pixel filter handles its own image data
                        resolve(canvas.toDataURL('image/png'));
                        return;
                    case 'vintage':
                        applyVintageFilter(imageData);
                        break;
                    case 'blueprint':
                        applyBlueprintFilter(imageData);
                        break;
                }

                ctx.putImageData(imageData, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function applyPencilFilter(data: ImageData) {
    const pixels = data.data;
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Grayscale
        const avg = (r + g + b) / 3;

        // High contrast for sketch look
        const val = avg > 128 ? 255 : (avg * 2);

        pixels[i] = val;
        pixels[i + 1] = val;
        pixels[i + 2] = val;
    }
}

function applyAnimeFilter(data: ImageData) {
    const pixels = data.data;
    for (let i = 0; i < pixels.length; i += 4) {
        // Posterization (reduce colors)
        pixels[i] = Math.floor(pixels[i] / 64) * 64;
        pixels[i + 1] = Math.floor(pixels[i + 1] / 64) * 64;
        pixels[i + 2] = Math.floor(pixels[i + 2] / 64) * 64;

        // Saturation boost
        pixels[i] = Math.min(255, pixels[i] * 1.2);
        pixels[i + 1] = Math.min(255, pixels[i + 1] * 1.2);
        pixels[i + 2] = Math.min(255, pixels[i + 2] * 1.3); // extra blue boost
    }
}

function applyPixelFilter(ctx: CanvasRenderingContext2D, img: HTMLImageElement, width: number, height: number) {
    const pixelSize = 10;
    const smallWidth = Math.ceil(width / pixelSize);
    const smallHeight = Math.ceil(height / pixelSize);

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, smallWidth, smallHeight);
    ctx.drawImage(ctx.canvas, 0, 0, smallWidth, smallHeight, 0, 0, width, height);
}

function applyVintageFilter(data: ImageData) {
    const pixels = data.data;
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Sepia
        pixels[i] = (r * 0.393) + (g * 0.769) + (b * 0.189);
        pixels[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
        pixels[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131);

        // Add noise
        const noise = (Math.random() - 0.5) * 30;
        pixels[i] += noise;
        pixels[i + 1] += noise;
        pixels[i + 2] += noise;
    }
}

function applyBlueprintFilter(data: ImageData) {
    const pixels = data.data;
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        const avg = (r + g + b) / 3;

        // Inverse/Edge like
        const val = avg > 160 ? 255 : 0;

        if (val === 255) {
            pixels[i] = 255;
            pixels[i + 1] = 255;
            pixels[i + 2] = 255;
        } else {
            pixels[i] = 10;
            pixels[i + 1] = 50;
            pixels[i + 2] = 150; // Blue background
        }
    }
}
