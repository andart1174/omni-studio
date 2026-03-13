// @ts-ignore
import * as opentype from 'opentype.js';

interface PathCmd {
    type: 'M' | 'L' | 'C' | 'Q' | 'Z';
    x?: number; y?: number;
    x1?: number; y1?: number;
    x2?: number; y2?: number;
}

/**
 * Parses SVG path data string and converts it into opentype.js commands.
 * Supports M, L, C, Q, Z and their lowercase relative variants.
 */
function parseSvgPathToCommands(d: string): PathCmd[] {
    const commands: PathCmd[] = [];
    if (!d) return commands;

    const tokenizer = /([MmLlHhVvCcSsQqTtAaZz])|([+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)/g;
    let token: RegExpExecArray | null;
    let type = '';
    const nums: number[] = [];

    const flush = (t: string, ns: number[]) => {
        // Normalize type to uppercase & define arg counts
        const T = t.toUpperCase();
        const rel = t === t.toLowerCase() && t !== 'Z' && t !== 'z';
        // last cursor
        let cx = 0, cy = 0;
        if (commands.length > 0) {
            const last = commands[commands.length - 1];
            cx = (last as any).x ?? (last as any).x2 ?? 0;
            cy = (last as any).y ?? (last as any).y2 ?? 0;
        }
        const dx = rel ? cx : 0;
        const dy = rel ? cy : 0;

        switch (T) {
            case 'M':
                for (let i = 0; i < ns.length; i += 2)
                    commands.push({ type: i === 0 ? 'M' : 'L', x: ns[i] + dx, y: -(ns[i + 1] + dy) });
                break;
            case 'L':
                for (let i = 0; i < ns.length; i += 2)
                    commands.push({ type: 'L', x: ns[i] + dx, y: -(ns[i + 1] + dy) });
                break;
            case 'H':
                for (let i = 0; i < ns.length; i++)
                    commands.push({ type: 'L', x: ns[i] + (rel ? cx : 0), y: cy });
                break;
            case 'V':
                for (let i = 0; i < ns.length; i++)
                    commands.push({ type: 'L', x: cx, y: -(ns[i] + (rel ? cy : 0)) });
                break;
            case 'C':
                for (let i = 0; i < ns.length; i += 6)
                    commands.push({
                        type: 'C',
                        x1: ns[i] + dx, y1: -(ns[i + 1] + dy),
                        x2: ns[i + 2] + dx, y2: -(ns[i + 3] + dy),
                        x: ns[i + 4] + dx, y: -(ns[i + 5] + dy),
                    });
                break;
            case 'Q':
                for (let i = 0; i < ns.length; i += 4)
                    commands.push({
                        type: 'Q',
                        x1: ns[i] + dx, y1: -(ns[i + 1] + dy),
                        x: ns[i + 2] + dx, y: -(ns[i + 3] + dy),
                    });
                break;
            case 'Z':
                commands.push({ type: 'Z' });
                break;
        }
    };

    while ((token = tokenizer.exec(d)) !== null) {
        if (token[1]) {
            if (type) flush(type, [...nums]);
            nums.length = 0;
            type = token[1];
            if (type === 'Z' || type === 'z') { flush(type, []); type = ''; }
        } else if (token[2]) {
            nums.push(parseFloat(token[2]));
        }
    }
    if (type) flush(type, [...nums]);
    return commands;
}

/**
 * Extracts all `d` attribute values from an SVG string.
 */
function extractPathsFromSvg(svgText: string): string[] {
    const paths: string[] = [];
    const pathRegex = /<path[^>]*\sd="([^"]+)"/gi;
    let match: RegExpExecArray | null;
    while ((match = pathRegex.exec(svgText)) !== null) {
        paths.push(match[1]);
    }
    return paths;
}

/**
 * Converts one or more SVG files/path strings into a TTF font blob URL.
 * Each SVG becomes a glyph mapped to characters starting at '!'.
 */
export const svgToFont = async (svgs: { name: string, path: string }[]): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            const fontName = 'OmniFont';
            const unitsPerEm = 1000;
            const ascender = 800;
            const descender = -200;

            const notdefGlyph = new opentype.Glyph({
                name: '.notdef',
                unicode: 0,
                advanceWidth: 500,
                path: new opentype.Path()
            });

            const glyphs = [notdefGlyph, ...svgs.map((svg, i) => {
                const opPath = new opentype.Path();
                const commands = parseSvgPathToCommands(svg.path);
                for (const cmd of commands) {
                    switch (cmd.type) {
                        case 'M': opPath.moveTo(cmd.x, cmd.y); break;
                        case 'L': opPath.lineTo(cmd.x, cmd.y); break;
                        case 'C': opPath.curveTo(cmd.x1!, cmd.y1!, cmd.x2!, cmd.y2!, cmd.x, cmd.y); break;
                        case 'Q': opPath.quadraticCurveTo(cmd.x1!, cmd.y1!, cmd.x, cmd.y); break;
                        case 'Z': opPath.closePath(); break;
                    }
                }

                return new opentype.Glyph({
                    name: svg.name.replace(/[^a-zA-Z0-9_]/g, '_') || `glyph${i}`,
                    unicode: 0x21 + i, // '!' onwards
                    advanceWidth: 600,
                    path: opPath
                });
            })];

            const font = new opentype.Font({
                familyName: fontName,
                styleName: 'Regular',
                unitsPerEm,
                ascender,
                descender,
                glyphs
            });

            const buffer = font.toBuffer();
            resolve(URL.createObjectURL(new Blob([buffer], { type: 'font/opentype' })));
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Converts an SVG File to a font. Extracts all <path d="..."> from the SVG,
 * one glyph per path element.
 */
export const svgFileToFont = async (file: File): Promise<string> => {
    const svgText = await file.text();
    const paths = extractPathsFromSvg(svgText);

    if (paths.length === 0) {
        // Fallback: use a simple box glyph so the font is valid
        paths.push('M 50 0 L 550 0 L 550 700 L 50 700 Z');
    }

    const svgInputs = paths.map((path, i) => ({
        name: `${file.name.replace(/\.svg$/i, '')}_${i}`,
        path
    }));

    return svgToFont(svgInputs);
};
