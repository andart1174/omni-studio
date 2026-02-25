export const codeToMermaid = (code: string): string => {
    // Simple heuristic to create a flowchart from code structure
    const lines = code.split('\n');
    let diagram = "graph TD\n";
    let lastNode = "Start";

    diagram += `  Start["Start"]\n`;

    lines.forEach((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        const nodeName = `node${i}`;
        let label = trimmed.substring(0, 30);
        if (trimmed.length > 30) label += "...";
        label = label.replace(/"/g, "'");

        if (trimmed.includes('if') || trimmed.includes('?')) {
            diagram += `  ${nodeName}{{"${label}"}}\n`;
        } else {
            diagram += `  ${nodeName}["${label}"]\n`;
        }

        diagram += `  ${lastNode} --> ${nodeName}\n`;
        lastNode = nodeName;
    });

    diagram += `  ${lastNode} --> End["End"]\n`;
    return diagram;
};

export const generateArchitectureDiagram = async (code: string): Promise<string> => {
    return codeToMermaid(code);
};
