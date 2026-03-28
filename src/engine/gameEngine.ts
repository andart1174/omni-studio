export const createSpriteAtlas = async (files: File[]): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Enforce alphanumeric sorting so frame1, frame2, frame10 stay sequential
        const validFiles = files
            .filter(f => f.type.startsWith('image/'))
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
            
        if (validFiles.length === 0) return reject(new Error("No valid images provided"));

        const images: HTMLImageElement[] = new Array(validFiles.length);
        let loadedCount = 0;
        let hasRejected = false;

        validFiles.forEach((file, index) => {
            const img = new Image();
            img.onload = () => {
                if (hasRejected) return;
                // Place img exactly where it should exist in sequential order
                images[index] = img;
                loadedCount++;
                if (loadedCount === validFiles.length) {
                    const canvas = document.createElement('canvas');
                    // Find a perfect square ceiling for the sprites length
                    const size = Math.ceil(Math.sqrt(validFiles.length));
                    const maxW = Math.max(...images.map(i => i.width));
                    const maxH = Math.max(...images.map(i => i.height));
                    
                    // Limit canvas size to avoid browser limits
                    const MAX_DIM = 4096;
                    const scale = (size * maxW > MAX_DIM || size * maxH > MAX_DIM) 
                        ? Math.min(MAX_DIM / (size * maxW), MAX_DIM / (size * maxH))
                        : 1;

                    const cellW = Math.max(1, Math.floor(maxW * scale));
                    const cellH = Math.max(1, Math.floor(maxH * scale));

                    canvas.width = size * cellW;
                    canvas.height = size * cellH;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return reject(new Error("Canvas failure"));

                    images.forEach((currentImg, i) => {
                        const x = (i % size) * cellW;
                        const y = Math.floor(i / size) * cellH;
                        
                        // Draw at intrinsic aspect ratio instead of brutally stretching the sprite
                        const drawW = currentImg.width * scale;
                        const drawH = currentImg.height * scale;
                        ctx.drawImage(currentImg, x, y, drawW, drawH);
                    });

                    canvas.toBlob((blob) => {
                        if (blob) resolve(URL.createObjectURL(blob));
                        else reject(new Error("Blob failure - canvas might be too large"));
                    }, 'image/png');
                }
            };
            img.onerror = () => {
                if (hasRejected) return;
                hasRejected = true;
                reject(new Error(`Failed to load image: ${file.name}`));
            };
            img.src = URL.createObjectURL(file);
        });
    });
};

export const simplifyTexture = async (file: File, factor: number = 0.5): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) return reject(new Error("Not an image"));
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width * factor;
            canvas.height = img.height * factor;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                if (blob) resolve(URL.createObjectURL(blob));
                else reject(new Error("Blob failure"));
            }, 'image/jpeg', 0.6);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(file);
    });
};
