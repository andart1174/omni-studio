/**
 * Cyber Engine - ASCII Art, Hashing and Password Security
 */

export async function imageToASCII(file: File, width: number = 100): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error("Canvas failure"));
                const height = (img.height / img.width) * width * 0.5; // Adjusted for font aspect ratio
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                const pixels = ctx.getImageData(0, 0, width, height).data;
                const chars = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";
                let ascii = '';

                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const i = (y * width + x) * 4;
                        const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
                        const brightness = (r + g + b) / 3;
                        const charIdx = Math.floor((brightness / 255) * (chars.length - 1));
                        ascii += chars[charIdx];
                    }
                    ascii += '\n';
                }
                resolve(ascii);
            };
            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
}

export async function calculateHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generatePassword(length: number = 20, useSpecial: boolean = true): { pass: string, entropy: number } {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" + (useSpecial ? "!@#$%^&*()_+~`|}{[]:;?><,./-=" : "");
    let retVal = "";
    for (let i = 0; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    const entropy = Math.log2(Math.pow(charset.length, length));
    return { pass: retVal, entropy };
}
