/**
 * Analytics Engine - CSV/JSON Data Visualization
 */

export type ChartType = 'bar' | 'line' | 'pie';

export interface DataPoint {
    label: string;
    value: number;
}

export async function parseFileData(file: File): Promise<DataPoint[]> {
    const text = await file.text();
    try {
        if (file.name.endsWith('.json')) {
            const json = JSON.parse(text);
            return Object.entries(json).map(([label, value]) => ({ label, value: Number(value) }));
        } else {
            // Simple CSV parsing
            const lines = text.split('\n').filter(l => l.trim());
            return lines.map(line => {
                const [label, value] = line.split(',');
                return { label: label.trim(), value: Number(value) || 0 };
            });
        }
    } catch (e) {
        throw new Error('Failed to parse data');
    }
}

export async function renderChart(data: DataPoint[], type: ChartType, colors: string[] = ['#007aff', '#30d158', '#ff9f0a', '#ff453a', '#bf5af2']): Promise<string> {
    const canvas = document.createElement('canvas');
    const width = 1200, height = 800;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    const padding = 100;
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;
    const maxVal = Math.max(...data.map(d => d.value)) * 1.1;

    if (type === 'bar') {
        const barW = chartW / data.length * 0.8;
        const gap = chartW / data.length * 0.2;
        data.forEach((d, i) => {
            const h = (d.value / maxVal) * chartH;
            const x = padding + i * (barW + gap) + gap / 2;
            const y = height - padding - h;

            const grad = ctx.createLinearGradient(x, y, x, y + h);
            grad.addColorStop(0, colors[i % colors.length]);
            grad.addColorStop(1, 'rgba(0,0,0,0.3)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(x, y, barW, h, [10, 10, 0, 0]);
            ctx.fill();

            // Label
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(d.label, x + barW / 2, height - padding + 30);
            ctx.fillText(d.value.toString(), x + barW / 2, y - 10);
        });
    } else if (type === 'line') {
        ctx.strokeStyle = colors[0];
        ctx.lineWidth = 6;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        data.forEach((d, i) => {
            const x = padding + (chartW / (data.length - 1)) * i;
            const y = height - padding - (d.value / maxVal) * chartH;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);

            // Points
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.font = 'bold 12px Inter';
            ctx.fillText(d.label, x, height - padding + 30);
        });
        ctx.stroke();
    } else if (type === 'pie') {
        const total = data.reduce((acc, d) => acc + d.value, 0);
        let startAngle = 0;
        const radius = Math.min(chartW, chartH) / 2;
        const cx = width / 2, cy = height / 2;

        data.forEach((d, i) => {
            const sliceAngle = (d.value / total) * Math.PI * 2;
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();

            // Label callout
            const labelAngle = startAngle + sliceAngle / 2;
            const lx = cx + Math.cos(labelAngle) * (radius + 40);
            const ly = cy + Math.sin(labelAngle) * (radius + 40);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(`${d.label} (${Math.round(d.value / total * 100)}%)`, lx, ly);

            startAngle += sliceAngle;
        });
    }

    return canvas.toDataURL('image/png');
}
