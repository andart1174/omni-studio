export const encryptFile = async (file: File, password: string): Promise<string> => {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt"]
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const fileData = await file.arrayBuffer();
    const encryptedContent = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        fileData
    );

    const result = new Uint8Array(salt.length + iv.length + encryptedContent.byteLength);
    result.set(salt, 0);
    result.set(iv, salt.length);
    result.set(new Uint8Array(encryptedContent), salt.length + iv.length);

    return URL.createObjectURL(new Blob([result], { type: 'application/octet-stream' }));
};

export const decryptFile = async (file: File, password: string): Promise<string> => {
    const enc = new TextEncoder();
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    const salt = data.slice(0, 16);
    const iv = data.slice(16, 28);
    const encryptedContent = data.slice(28);

    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
    );

    try {
        const decryptedContent = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            encryptedContent
        );
        return URL.createObjectURL(new Blob([decryptedContent]));
    } catch (e) {
        throw new Error("Wrong password or corrupted file.");
    }
};

export const shredFileMetadata = async (file: File): Promise<string> => {
    // Basic implementation: strip EXIF by re-drawing on canvas
    if (!file.type.startsWith('image/')) return URL.createObjectURL(file);

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
             const canvas = document.createElement('canvas');
             canvas.width = img.width;
             canvas.height = img.height;
             const ctx = canvas.getContext('2d');
             ctx?.drawImage(img, 0, 0);
             canvas.toBlob((blob) => {
                 if (blob) resolve(URL.createObjectURL(blob));
                 else resolve(URL.createObjectURL(file));
             }, 'image/jpeg');
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(file);
    });
};
