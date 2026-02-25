import katex from 'katex';
import 'katex/dist/katex.min.css';

export const texToSvg = async (tex: string): Promise<string> => {
    return new Promise((resolve) => {
        const html = katex.renderToString(tex, {
            throwOnError: false,
            displayMode: true
        });

        // Wrap KaTeX HTML in an SVG foreignObject for better conversion if needed,
        // or just return the HTML as a string. For this app, we'll return a blob of the HTML
        // and display it in a div.
        const blob = new Blob([html], { type: 'text/html' });
        resolve(URL.createObjectURL(blob));
    });
};
