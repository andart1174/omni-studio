// @ts-ignore
import * as opentype from 'opentype.js';

export const svgToFont = async (svgs: { name: string, path: string }[]): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            // Basic font settings
            const fontName = 'OmniIcon';
            const unitsPerEm = 1000;
            const ascender = 800;
            const descender = -200;

            const glyphs = svgs.map((svg, i) => {
                // Create a glyph from the SVG path
                // i+0x21 to avoid control characters
                const unicode = 0x21 + i;
                const glyph = new opentype.Glyph({
                    name: svg.name,
                    unicode: unicode,
                    advanceWidth: 600,
                    path: new opentype.Path() // In a real app, parse svg.path into opentype commands
                });
                return glyph;
            });

            // Add required .notdef glyph
            const notdefGlyph = new opentype.Glyph({
                name: '.notdef',
                unicode: 0,
                advanceWidth: 600,
                path: new opentype.Path()
            });

            const font = new opentype.Font({
                familyName: fontName,
                styleName: 'Medium',
                unitsPerEm: unitsPerEm,
                ascender: ascender,
                descender: descender,
                glyphs: [notdefGlyph, ...glyphs]
            });

            const buffer = font.toBuffer();
            resolve(URL.createObjectURL(new Blob([buffer], { type: 'font/opentype' })));
        } catch (e) {
            reject(e);
        }
    });
};
