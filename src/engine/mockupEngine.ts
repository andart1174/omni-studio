/**
 * Mockup Engine - Procedural Device Visualization
 */

export interface MockupResult {
    url: string;
    width: number;
    height: number;
}

export type MockupTemplate = 'iphone' | 'macbook' | 'billboard' | 'shirt' | 'mug' | 'bag';

export async function generateMockup(file: File, template: MockupTemplate): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject('Canvas context error');

                // Set canvas size based on template (tight bounds)
                let w = 500, h = 900;
                if (template === 'macbook') { w = 1000; h = 700; }
                if (template === 'billboard') { w = 1400; h = 800; }
                if (template === 'shirt' || template === 'bag') { w = 800; h = 800; }
                if (template === 'mug') { w = 600; h = 600; }

                canvas.width = w;
                canvas.height = h;

                // Set background to transparent for better integration
                ctx.clearRect(0, 0, w, h);

                // Draw Procedural Device / Product
                if (template === 'iphone') {
                    drawIPhone(ctx, w / 2, h / 2, 400, 800, img);
                } else if (template === 'macbook') {
                    drawMacBook(ctx, w / 2, h / 2, 850, 550, img);
                } else if (template === 'billboard') {
                    drawBillboard(ctx, w / 2, h / 2, 1200, 650, img);
                } else if (template === 'shirt') {
                    drawShirt(ctx, w / 2, h / 2, 600, 700, img);
                } else if (template === 'mug') {
                    drawMug(ctx, w / 2, h / 2, 400, 450, img);
                } else if (template === 'bag') {
                    drawBag(ctx, w / 2, h / 2, 600, 700, img);
                }

                resolve(canvas.toDataURL('image/png'));
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
}

function drawIPhone(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, content: HTMLImageElement) {
    ctx.save();
    ctx.translate(x - w / 2, y - h / 2);

    // Outer Frame
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 60);
    ctx.fill();

    // Inner Bezel
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.roundRect(10, 10, w - 20, h - 20, 50);
    ctx.fill();

    // Screen Area
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(15, 15, w - 30, h - 30, 45);
    ctx.clip();

    // Background of screen
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(15, 15, w - 30, h - 30);

    // Contain logic with 10% padding
    const padding = (w - 30) * 0.15;
    const targetW = w - 30 - (padding * 2);
    const targetH = h - 30 - (padding * 2);

    const ratio = content.width / content.height;
    const targetRatio = targetW / targetH;

    let dw, dh;
    if (ratio > targetRatio) {
        dw = targetW;
        dh = targetW / ratio;
    } else {
        dh = targetH;
        dw = dh * ratio;
    }

    const dx = 15 + padding + (targetW - dw) / 2;
    const dy = 15 + padding + (targetH - dh) / 2;

    // Glow effect for the asset
    ctx.shadowColor = 'rgba(255,255,255,0.1)';
    ctx.shadowBlur = 30;
    ctx.drawImage(content, dx, dy, dw, dh);
    ctx.restore();

    // Dynamic Island
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.roundRect(w / 2 - 60, 30, 120, 35, 20);
    ctx.fill();

    ctx.restore();
}

function drawMacBook(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, content: HTMLImageElement) {
    ctx.save();
    ctx.translate(x - w / 2, y - h / 2);

    // Screen Frame
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h * 0.9, 20);
    ctx.fill();

    // Screen
    ctx.save();
    const screenX = 25, screenY = 25, screenW = w - 50, screenH = h * 0.9 - 50;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.roundRect(screenX, screenY, screenW, screenH, 5);
    ctx.fill();
    ctx.clip();

    // Contain logic
    const ratio = content.width / content.height;
    const targetRatio = screenW / screenH;
    let dw, dh;
    if (ratio > targetRatio) {
        dw = screenW * 0.7; // 70% of screen
        dh = dw / ratio;
    } else {
        dh = screenH * 0.7;
        dw = dh * ratio;
    }

    // Shadow for content
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 20;
    ctx.drawImage(content, screenX + (screenW - dw) / 2, screenY + (screenH - dh) / 2, dw, dh);
    ctx.restore();

    // Base
    const baseGrad = ctx.createLinearGradient(0, h * 0.9, 0, h);
    baseGrad.addColorStop(0, '#555');
    baseGrad.addColorStop(1, '#111');
    ctx.fillStyle = baseGrad;
    ctx.beginPath();
    ctx.moveTo(-40, h * 0.9);
    ctx.lineTo(w + 40, h * 0.9);
    ctx.lineTo(w + 20, h);
    ctx.lineTo(-20, h);
    ctx.closePath();
    ctx.fill();

    // Front Notch
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.roundRect(w / 2 - 50, h * 0.9, 100, 10, 5);
    ctx.fill();

    ctx.restore();
}

function drawBillboard(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, content: HTMLImageElement) {
    ctx.save();
    ctx.translate(x - w / 2, y - h / 2);

    // Support Poles
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(w * 0.3, h, 30, 400);
    ctx.fillRect(w * 0.7, h, 30, 400);

    // Frame
    ctx.fillStyle = '#000';
    ctx.fillRect(-20, -20, w + 40, h + 40);

    // Night Glow
    ctx.shadowColor = 'rgba(255,255,255,0.05)';
    ctx.shadowBlur = 50;

    // Canvas Background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, w, h);

    // Contain logic with 5% padding for billboard
    const pad = w * 0.05;
    const targetW = w - pad * 2;
    const targetH = h - pad * 2;
    const ratio = content.width / content.height;
    const targetRatio = targetW / targetH;

    let dw, dh;
    if (ratio > targetRatio) {
        dw = targetW;
        dh = targetW / ratio;
    } else {
        dh = targetH;
        dw = dh * ratio;
    }

    ctx.drawImage(content, pad + (targetW - dw) / 2, pad + (targetH - dh) / 2, dw, dh);

    // Spotlights
    ctx.shadowBlur = 0;
    for (let i = 1; i <= 4; i++) {
        const lx = (w / 5) * i;
        ctx.fillStyle = '#333';
        ctx.fillRect(lx - 10, -40, 20, 20);
        ctx.fillStyle = '#fff2';
        ctx.beginPath();
        ctx.moveTo(lx, -30);
        ctx.lineTo(lx - 100, h * 0.5);
        ctx.lineTo(lx + 100, h * 0.5);
        ctx.closePath();
        ctx.fill();
    }

    ctx.restore();
}

function drawShirt(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, content: HTMLImageElement) {
    ctx.save();
    ctx.translate(x - w / 2, y - h / 2);

    // Shirt Shape (Simplified)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.1);
    ctx.lineTo(w * 0.3, 0);
    ctx.lineTo(w * 0.7, 0);
    ctx.lineTo(w * 0.8, h * 0.1);
    ctx.lineTo(w, h * 0.3);
    ctx.lineTo(w * 0.85, h * 0.4);
    ctx.lineTo(w * 0.8, h * 0.35);
    ctx.lineTo(w * 0.8, h);
    ctx.lineTo(w * 0.2, h);
    ctx.lineTo(w * 0.2, h * 0.35);
    ctx.lineTo(w * 0.15, h * 0.4);
    ctx.lineTo(0, h * 0.3);
    ctx.closePath();
    ctx.fill();

    // Body Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.beginPath();
    ctx.moveTo(w * 0.5, 0);
    ctx.lineTo(w * 0.5, h);
    ctx.lineTo(w * 0.8, h);
    ctx.lineTo(w * 0.8, h * 0.35);
    ctx.closePath();
    ctx.fill();

    // Logo Area
    const logoW = w * 0.4;
    const logoH = h * 0.4;
    const lx = (w - logoW) / 2;
    const ly = h * 0.2;

    const ratio = content.width / content.height;
    let dw, dh;
    if (ratio > 1) {
        dw = logoW;
        dh = logoW / ratio;
    } else {
        dh = logoH;
        dw = logoH * ratio;
    }
    ctx.globalAlpha = 0.8;
    ctx.drawImage(content, lx + (logoW - dw) / 2, ly + (logoH - dh) / 2, dw, dh);

    ctx.restore();
}

function drawMug(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, content: HTMLImageElement) {
    ctx.save();
    ctx.translate(x - w / 2, y - h / 2);

    // Handle
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 40;
    ctx.beginPath();
    ctx.arc(w * 0.8, h * 0.5, 80, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    // Body
    const grad = ctx.createLinearGradient(0, 0, w * 0.8, 0);
    grad.addColorStop(0, '#fff');
    grad.addColorStop(1, '#ddd');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, w * 0.8, h, 20);
    ctx.fill();

    // Logo
    const logoW = w * 0.4;
    const lx = (w * 0.8 - logoW) / 2;
    const ly = (h - logoW) / 2;
    ctx.globalAlpha = 0.7;
    ctx.drawImage(content, lx, ly, logoW, logoW / (content.width / content.height));

    ctx.restore();
}

function drawBag(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, content: HTMLImageElement) {
    ctx.save();
    ctx.translate(x - w / 2, y - h / 2);

    // Handles
    ctx.strokeStyle = '#543';
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.2);
    ctx.quadraticCurveTo(w * 0.3, 0, w * 0.5, 0);
    ctx.quadraticCurveTo(w * 0.7, 0, w * 0.7, h * 0.2);
    ctx.stroke();

    // Body
    ctx.fillStyle = '#eadecd'; // Canvas color
    ctx.beginPath();
    ctx.roundRect(0, h * 0.2, w, h * 0.8, 5);
    ctx.fill();

    // Logo
    const logoSize = w * 0.5;
    ctx.globalAlpha = 0.6;
    ctx.drawImage(content, (w - logoSize) / 2, h * 0.4, logoSize, logoSize / (content.width / content.height));

    ctx.restore();
}
