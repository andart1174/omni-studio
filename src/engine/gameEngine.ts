export const createSpriteAtlas = async (files: File[]): Promise<string> => {
    return new Promise((resolve, reject) => {
        const images: HTMLImageElement[] = [];
        let loadedCount = 0;

        files.forEach((file) => {
            const img = new Image();
            img.onload = () => {
                images.push(img);
                loadedCount++;
                if (loadedCount === files.length) {
                    const canvas = document.createElement('canvas');
                    const size = Math.ceil(Math.sqrt(files.length));
                    const maxW = Math.max(...images.map(i => i.width));
                    const maxH = Math.max(...images.map(i => i.height));

                    canvas.width = size * maxW;
                    canvas.height = size * maxH;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return reject("Canvas failure");

                    images.forEach((img, i) => {
                        const x = (i % size) * maxW;
                        const y = Math.floor(i / size) * maxH;
                        ctx.drawImage(img, x, y);
                    });

                    canvas.toBlob((blob) => {
                        if (blob) resolve(URL.createObjectURL(blob));
                        else reject("Blob failure");
                    }, 'image/png');
                }
            };
            img.src = URL.createObjectURL(file);
        });
    });
};

export const simplifyTexture = async (file: File, factor: number = 0.5): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width * factor;
            canvas.height = img.height * factor;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                if (blob) resolve(URL.createObjectURL(blob));
                else reject("Blob failure");
            }, 'image/jpeg', 0.6);
        };
        img.src = URL.createObjectURL(file);
    });
};
