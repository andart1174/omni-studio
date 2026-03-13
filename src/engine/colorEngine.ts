/**
 * colorEngine.ts
 * LCH-based palette generation, WCAG contrast checking, and palette image rendering.
 */

// ─── Conversions ─────────────────────────────────────────────────────────────

export function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return [r, g, b];
}

export function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
}

function hexToHslValues(hex: string): [number, number, number] {
    let [r, g, b] = hexToRgb(hex).map(v => v / 255) as [number, number, number];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
    s /= 100; l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return rgbToHex(Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255));
}

export const hexToHsl = (hex: string): string => {
    const [h, s, l] = hexToHslValues(hex);
    return `hsl(${h}, ${s}%, ${l}%)`;
};

// ─── Contrast (WCAG 2.1) ─────────────────────────────────────────────────────

function getLuminance(hex: string): number {
    const rgb = hexToRgb(hex).map(v => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

export const checkContrast = (color1: string, color2: string): number => {
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

function wcagLevel(ratio: number): string {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    if (ratio >= 3) return 'AA Large';
    return 'Fail';
}

// ─── Palette Generation ───────────────────────────────────────────────────────

export type PaletteMode = 'analogous' | 'complementary' | 'triadic' | 'split' | 'tetradic' | 'monochromatic';

export interface PaletteColor {
    hex: string;
    hsl: string;
    name: string;
    contrast: number;
    wcag: string;
}

export function generatePalette(baseHex: string, mode: PaletteMode): PaletteColor[] {
    const [h, s, l] = hexToHslValues(baseHex);

    let hues: number[] = [h];
    switch (mode) {
        case 'analogous':
            hues = [h - 30, h, h + 30];
            break;
        case 'complementary':
            hues = [h, h + 180];
            break;
        case 'triadic':
            hues = [h, h + 120, h + 240];
            break;
        case 'split':
            hues = [h, h + 150, h + 210];
            break;
        case 'tetradic':
            hues = [h, h + 90, h + 180, h + 270];
            break;
        case 'monochromatic':
            return [20, 35, 50, 65, 80].map((lv, i) => {
                const hex = hslToHex(h, s, lv);
                const contrast = checkContrast(hex, '#ffffff');
                return {
                    hex,
                    hsl: `hsl(${h}, ${s}%, ${lv}%)`,
                    name: ['Dark', 'Medium-Dark', 'Base', 'Medium-Light', 'Light'][i],
                    contrast: parseFloat(contrast.toFixed(2)),
                    wcag: wcagLevel(contrast),
                };
            });
    }

    return hues.map((hv, i) => {
        const normH = ((hv % 360) + 360) % 360;
        const hex = hslToHex(normH, s, l);
        const contrast = checkContrast(hex, '#ffffff');
        return {
            hex,
            hsl: `hsl(${normH}, ${s}%, ${l}%)`,
            name: ['Primary', 'Secondary', 'Tertiary', 'Quaternary'][i] || `Color ${i + 1}`,
            contrast: parseFloat(contrast.toFixed(2)),
            wcag: wcagLevel(contrast),
        };
    });
}

// ─── Canvas Render ────────────────────────────────────────────────────────────

export async function renderPaletteImage(
    colors: PaletteColor[],
    baseColor: string,
    mode: PaletteMode
): Promise<string> {
    const W = 1200, H = 600;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // Dark background
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(0, 0, W, H);

    const swatchW = Math.floor(W / colors.length);
    const swatchH = 320;
    const startY = 100;

    colors.forEach((c, i) => {
        const x = i * swatchW;

        // Swatch block
        ctx.fillStyle = c.hex;
        ctx.beginPath();
        ctx.roundRect(x + 12, startY, swatchW - 24, swatchH, 20);
        ctx.fill();

        // Subtle glow border
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Color info
        const textX = x + swatchW / 2;
        ctx.textAlign = 'center';

        // Name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(c.name, textX, startY + swatchH + 36);

        // HEX
        ctx.fillStyle = c.hex;
        ctx.font = 'bold 22px monospace';
        ctx.fillText(c.hex.toUpperCase(), textX, startY + swatchH + 62);

        // HSL
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '12px monospace';
        ctx.fillText(c.hsl, textX, startY + swatchH + 82);

        // WCAG badge
        const badgeColor = c.wcag === 'AAA' ? '#30d158' : c.wcag === 'AA' ? '#007aff' : c.wcag === 'AA Large' ? '#ff9f0a' : '#ff453a';
        ctx.fillStyle = badgeColor;
        ctx.beginPath();
        ctx.roundRect(textX - 30, startY + swatchH + 96, 60, 20, 6);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(c.wcag, textX, startY + swatchH + 110);

        // Contrast ratio
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '11px monospace';
        ctx.fillText(`${c.contrast}:1`, textX, startY + swatchH + 130);
    });

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(`${mode.charAt(0).toUpperCase() + mode.slice(1)} Palette`, W / 2, 60);

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '14px sans-serif';
    ctx.fillText(`Base: ${baseColor.toUpperCase()}  •  ${colors.length} colors  •  WCAG 2.1`, W / 2, 85);

    return canvas.toDataURL('image/png');
}
