/**
 * QR Engine - Branded QR Code Generation
 */

export async function generateBrandedQR(text: string, color: string = '#000000', logoUrl?: string): Promise<string> {
    // We use an API for high-quality QR generation since a full generator is large
    // But we'll implement a fallback/proxy to make it feel integrated
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(text)}&color=${color.replace('#', '')}&bgcolor=ffffff&format=png`;

    if (!logoUrl) return qrUrl;

    return new Promise((resolve) => {
        const qrImg = new Image();
        qrImg.crossOrigin = "anonymous";
        qrImg.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 1000;
            canvas.height = 1000;
            const ctx = canvas.getContext('2d')!;

            // Draw QR
            ctx.drawImage(qrImg, 0, 0);

            // Draw Logo in center
            const logo = new Image();
            logo.crossOrigin = "anonymous";
            logo.onload = () => {
                const logoSize = 250;
                const x = (1000 - logoSize) / 2;
                const y = (1000 - logoSize) / 2;

                // White buffer for logo
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.roundRect(x - 10, y - 10, logoSize + 20, logoSize + 20, 30);
                ctx.fill();

                ctx.drawImage(logo, x, y, logoSize, logoSize);
                resolve(canvas.toDataURL('image/png'));
            };
            logo.src = logoUrl;
        };
        qrImg.src = qrUrl;
    });
}
