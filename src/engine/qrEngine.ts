/**
 * QR Engine - Branded QR Code Generation
 */

import QRCode from 'qrcode';

export async function generateBrandedQR(text: string, color: string = '#000000', logoUrl?: string): Promise<string> {
    try {
        const qrCanvas = document.createElement('canvas');
        await QRCode.toCanvas(qrCanvas, text, {
            width: 1000,
            margin: 1,
            color: {
                dark: color,
                light: '#ffffff'
            }
        });

        if (!logoUrl) return qrCanvas.toDataURL('image/png');

        return new Promise((resolve) => {
            const ctx = qrCanvas.getContext('2d');
            if (!ctx) return resolve(qrCanvas.toDataURL('image/png'));

            const logo = new Image();
            logo.crossOrigin = "anonymous";
            logo.onload = () => {
                const logoSize = 250;
                const x = (1000 - logoSize) / 2;
                const y = (1000 - logoSize) / 2;

                // Create a circular white cutout for the logo
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                // Add a small padding around the logo
                ctx.roundRect(x - 15, y - 15, logoSize + 30, logoSize + 30, 30);
                // Can also use arc if we preferred circle: ctx.arc(500, 500, logoSize / 2 + 15, 0, Math.PI * 2)
                ctx.fill();

                // Draw logo with clipped rounded corners
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x, y, logoSize, logoSize, 20);
                ctx.clip();
                ctx.drawImage(logo, x, y, logoSize, logoSize);
                ctx.restore();

                resolve(qrCanvas.toDataURL('image/png'));
            };
            logo.onerror = () => {
                // If logo fails to load, just return base QR
                resolve(qrCanvas.toDataURL('image/png'));
            };
            logo.src = logoUrl;
        });
    } catch (e: any) {
        throw new Error("Failed to generate QR Code: " + e.message);
    }
}
