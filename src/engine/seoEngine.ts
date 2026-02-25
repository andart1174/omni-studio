export interface SEOOptions {
    quality: number;
    format: 'webp' | 'jpeg';
    title?: string;
    description?: string;
}

export const optimizeForSEO = async (file: File, options: SEOOptions): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject("Canvas failure");

            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                if (!blob) return reject("Blob failure");

                // In a real implementation with Exif injection, we'd use a library.
                // For now, we return the optimized image.
                resolve(URL.createObjectURL(blob));
            }, `image/${options.format}`, options.quality);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
};

export const generateSchemaMarkup = (options: SEOOptions): string => {
    const schema = {
        "@context": "https://schema.org/",
        "@type": "ImageObject",
        "name": options.title || "Image",
        "description": options.description || "Optimized by OmniConvert",
        "contentUrl": "#",
        "format": options.format
    };
    return JSON.stringify(schema, null, 2);
};
