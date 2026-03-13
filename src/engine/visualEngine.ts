/**
 * Visual Engine - Provides artistic filters and image transformations
 */

export type FilterType = 'pencil' | 'anime' | 'pixel' | 'vintage' | 'blueprint' | 'remove-bg' | 'upscale' | 'eraser';

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
                        canvas.toBlob(blob => resolve(URL.createObjectURL(blob!)), 'image/png');
                        return;
                    case 'vintage':
                        applyVintageFilter(imageData);
                        break;
                    case 'blueprint':
                        applyBlueprintFilter(imageData);
                        break;
                    case 'remove-bg':
                        applyRemoveBackground(imageData);
                        break;
                    case 'upscale':
                        const upscaledCanvas = applyUpscale(img);
                        upscaledCanvas.toBlob(blob => resolve(URL.createObjectURL(blob!)), 'image/png');
                        return;
                    case 'eraser':
                        applyMagicEraser(imageData);
                        break;
                }

                ctx.putImageData(imageData, 0, 0);
                canvas.toBlob(blob => resolve(URL.createObjectURL(blob!)), 'image/png');
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
function applyRemoveBackground(data: ImageData) {
    const pixels = data.data;
    // Simple corner-pixel based background removal
    // We sample the corners to get the "background" color
    const corners = [
        [pixels[0], pixels[1], pixels[2]],
        [pixels[(data.width - 1) * 4], pixels[(data.width - 1) * 4 + 1], pixels[(data.width - 1) * 4 + 2]],
        [pixels[(data.height - 1) * data.width * 4], pixels[(data.height - 1) * data.width * 4 + 1], pixels[(data.height - 1) * data.width * 4 + 2]],
        [pixels[(data.width * data.height - 1) * 4], pixels[(data.width * data.height - 1) * 4 + 1], pixels[(data.width * data.height - 1) * 4 + 2]]
    ];

    // Average corner color
    const bgR = corners.reduce((acc, c) => acc + c[0], 0) / 4;
    const bgG = corners.reduce((acc, c) => acc + c[1], 0) / 4;
    const bgB = corners.reduce((acc, c) => acc + c[2], 0) / 4;

    const threshold = 40;

    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        const diff = Math.sqrt(
            Math.pow(r - bgR, 2) +
            Math.pow(g - bgG, 2) +
            Math.pow(b - bgB, 2)
        );

        if (diff < threshold) {
            pixels[i + 3] = 0; // Transparent
        }
    }
}

function applyUpscale(img: HTMLImageElement): HTMLCanvasElement {
    const scale = 2; // 2x Upscale
    const canvas = document.createElement('canvas');
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    const ctx = canvas.getContext('2d')!;

    // Simple Lanczos-like simulation using smooth scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return canvas;
}

export function applyMagicEraser(data: ImageData) {
    const pixels = data.data;
    const width = data.width;
    const height = data.height;

    // Multi-pass simulation for smoother transition - increased to 50 passes
    for (let pass = 0; pass < 50; pass++) {
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const i = (y * width + x) * 4;

                // Check if mask (very bright)
                if (pixels[i] > 240 && pixels[i + 1] > 240 && pixels[i + 2] > 240) {
                    // Average neighbors (simple blur/patch simulation)
                    let totalR = 0, totalG = 0, totalB = 0, count = 0;

                    const neighbors = [
                        ((y - 1) * width + x) * 4,
                        ((y + 1) * width + x) * 4,
                        (y * width + (x - 1)) * 4,
                        (y * width + (x + 1)) * 4
                    ];

                    for (const n of neighbors) {
                        // Only average with non-mask pixels (or previously healed pixels)
                        if (pixels[n] <= 240 || pixels[n + 1] <= 240 || pixels[n + 2] <= 240) {
                            totalR += pixels[n];
                            totalG += pixels[n + 1];
                            totalB += pixels[n + 2];
                            count++;
                        }
                    }

                    if (count > 0) {
                        pixels[i] = totalR / count;
                        pixels[i + 1] = totalG / count;
                        pixels[i + 2] = totalB / count;
                        // Keep alpha as is or set to opaque
                        pixels[i + 3] = 255;
                    }
                }
            }
        }
    }
}
