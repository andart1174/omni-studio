/**
 * Branding Engine - Logo generation and brand asset management
 */

export async function photoToLogo(file: File, invert: boolean = false): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject('Canvas context error');

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;

                for (let i = 0; i < pixels.length; i += 4) {
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];
                    const avg = (r * 0.299 + g * 0.587 + b * 0.114);

                    // Logic: Normally we want a WHITE logo on dark background (from dark parts of img)
                    // If invert is true, we want a BLACK logo.
                    const isSubject = invert ? avg > 127 : avg <= 127;

                    pixels[i] = 255;
                    pixels[i + 1] = 255;
                    pixels[i + 2] = 255;

                    if (isSubject) {
                        // Subject - make it white (or black if we changed fillStyle)
                        // Actually let's just use white for visibility on dark theme
                        pixels[i + 3] = 255;
                    } else {
                        // Background - transparent
                        pixels[i + 3] = 0;
                    }
                }

                ctx.putImageData(imageData, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
}

export async function extractPalette(file: File): Promise<string[]> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;
                canvas.width = 100;
                canvas.height = 100;
                ctx.drawImage(img, 0, 0, 100, 100);

                const data = ctx.getImageData(0, 0, 100, 100).data;
                const colorMap: Record<string, number> = {};

                for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
                    const r = Math.round(data[i] / 10) * 10;
                    const g = Math.round(data[i + 1] / 10) * 10;
                    const b = Math.round(data[i + 2] / 10) * 10;
                    if (data[i + 3] < 128) continue; // Skip trans
                    const rgb = `rgb(${r},${g},${b})`;
                    colorMap[rgb] = (colorMap[rgb] || 0) + 1;
                }

                // Sort by frequency
                const sortedColors = Object.entries(colorMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 6)
                    .map(entry => entry[0]);

                resolve(sortedColors.length > 0 ? sortedColors : ['rgb(0,0,0)']);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
}

export async function addWatermark(file: File, text: string): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const fontSize = Math.floor(canvas.width / 25);
                ctx.font = `bold ${fontSize}px Inter, sans-serif`;

                // Shadow for visibility
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 10;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.textAlign = 'right';
                ctx.fillText(text, canvas.width - (fontSize), canvas.height - (fontSize));

                resolve(canvas.toDataURL('image/png'));
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
}

export async function generateAppIconSet(file: File): Promise<{ size: number, url: string }[]> {
    const sizes = [16, 32, 64, 128, 512, 1024];
    const results: { size: number, url: string }[] = [];

    const reader = new FileReader();
    const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
    });

    const img = await new Promise<HTMLImageElement>((resolve) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.src = dataUrl;
    });

    for (const size of sizes) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, size, size);
        results.push({ size, url: canvas.toDataURL('image/png') });
    }

    return results;
}

export async function socialKit(file: File): Promise<{ type: string, url: string }[]> {
    const assets = [
        { type: 'Profile', ratio: 1 },
        { type: 'Banner', ratio: 16 / 9 },
        { type: 'Story', ratio: 9 / 16 }
    ];
    const results: { type: string, url: string }[] = [];

    const img = await new Promise<HTMLImageElement>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const i = new Image();
            i.onload = () => resolve(i);
            i.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });

    for (const asset of assets) {
        const canvas = document.createElement('canvas');
        // Optimized dimensions to reduce file size while keeping high quality for social
        let w = asset.type === 'Banner' ? 1200 : (asset.type === 'Story' ? 1080 : 800);
        let h = w / asset.ratio;

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, w, h);

        const imgRatio = img.width / img.height;
        let drawW, drawH, drawX, drawY;

        if (imgRatio > asset.ratio) {
            drawH = h;
            drawW = h * imgRatio;
            drawY = 0;
            drawX = (w - drawW) / 2;
        } else {
            drawW = w;
            drawH = w / imgRatio;
            drawX = 0;
            drawY = (h - drawH) / 2;
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(0, 0, w, h);

        // Use JPEG for story/banner to significantly reduce size
        const mime = asset.type === 'Profile' ? 'image/png' : 'image/jpeg';
        const quality = 0.85;
        results.push({ type: asset.type, url: canvas.toDataURL(mime, quality) });
    }

    return results;
}
