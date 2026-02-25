export const jsonToTypeScript = (json: string, interfaceName: string = "RootObject"): string => {
    try {
        const obj = JSON.parse(json);
        let result = `interface ${interfaceName} {\n`;

        const processObject = (o: any, indent: string = "  "): string => {
            let str = "";
            for (const key in o) {
                const value = o[key];
                const type = typeof value;
                if (value === null) {
                    str += `${indent}${key}: null;\n`;
                } else if (Array.isArray(value)) {
                    const itemType = value.length > 0 ? typeof value[0] : "any";
                    str += `${indent}${key}: ${itemType}[];\n`;
                } else if (type === "object") {
                    str += `${indent}${key}: {\n${processObject(value, indent + "  ")}${indent}};\n`;
                } else {
                    str += `${indent}${key}: ${type};\n`;
                }
            }
            return str;
        };

        result += processObject(obj);
        result += "}\n";
        return result;
    } catch (e) {
        return "// Invalid JSON";
    }
};

export const cssToTailwindHeuristic = (css: string): string => {
    // A simple heuristic for common properties
    const rules = css.match(/[^{}]+\{[^{}]+\}/g) || [];
    let result = "";

    rules.forEach(rule => {
        const selector = rule.split('{')[0].trim();
        const body = rule.split('{')[1].split('}')[0].trim();
        const declarations = body.split(';');

        let tailwindClasses = "";
        declarations.forEach(decl => {
            const [prop, val] = decl.split(':').map(s => s.trim().replace(';', ''));
            if (!prop || !val) return;

            if (prop === 'display' && val === 'flex') tailwindClasses += "flex ";
            if (prop === 'background-color' && val === 'white') tailwindClasses += "bg-white ";
            if (prop === 'padding') tailwindClasses += `p-[${val}] `;
            if (prop === 'border-radius') tailwindClasses += `rounded-[${val}] `;
            // Add more common mappings...
        });

        result += `${selector} -> class="${tailwindClasses.trim()}"\n`;
    });

    return result || "// No CSS rules found";
};

export const transformCode = async (content: string, type: 'json-ts' | 'css-tw'): Promise<string> => {
    if (type === 'json-ts') return jsonToTypeScript(content);
    if (type === 'css-tw') return cssToTailwindHeuristic(content);
    return content;
};
