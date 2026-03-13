export const createSpriteAtlas = async (files: File[]): Promise<string> => {
    return new Promise((resolve, reject) => {
        const validFiles = files.filter(f => f.type.startsWith('image/'));
        if (validFiles.length === 0) return reject(new Error("No valid images provided"));

        const images: HTMLImageElement[] = [];
        let loadedCount = 0;
        let hasRejected = false;

        validFiles.forEach((file) => {
            const img = new Image();
            img.onload = () => {
                if (hasRejected) return;
                images.push(img);
                loadedCount++;
                if (loadedCount === validFiles.length) {
                    const canvas = document.createElement('canvas');
                    const size = Math.ceil(Math.sqrt(validFiles.length));
                    const maxW = Math.max(...images.map(i => i.width));
                    const maxH = Math.max(...images.map(i => i.height));
                    
                    // Limit canvas size to avoid browser limits
                    const MAX_DIM = 4096;
                    let targetW = maxW;
                    let targetH = maxH;
                    if (size * maxW > MAX_DIM || size * maxH > MAX_DIM) {
                        const scale = Math.min(MAX_DIM / (size * maxW), MAX_DIM / (size * maxH));
                        targetW = Math.max(1, Math.floor(maxW * scale));
                        targetH = Math.max(1, Math.floor(maxH * scale));
                    }

                    canvas.width = size * targetW;
                    canvas.height = size * targetH;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return reject(new Error("Canvas failure"));

                    images.forEach((img, i) => {
                        const x = (i % size) * targetW;
                        const y = Math.floor(i / size) * targetH;
                        ctx.drawImage(img, x, y, targetW, targetH);
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
