/**
 * Motion Engine - Audiogram & Reactive Waveform Video Generation
 */

export async function generateAudiogram(audioFile: File): Promise<string> {
    const audioContext = new AudioContext();
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const canvas = document.createElement('canvas');
    const width = 1200, height = 1200;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    const stream = canvas.captureStream(30); // 30 FPS
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: Blob[] = [];

    return new Promise((resolve) => {
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            resolve(URL.createObjectURL(blob));
        };

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const duration = audioBuffer.duration;
        let startTime: number;

        function draw(time: number) {
            if (!startTime) startTime = time;
            const elapsed = (time - startTime) / 1000;

            if (elapsed >= duration) {
                source.stop();
                recorder.stop();
                return;
            }

            analyser.getByteFrequencyData(dataArray);

            // Background
            const grad = ctx.createLinearGradient(0, 0, width, height);
            grad.addColorStop(0, '#0a0a0a');
            grad.addColorStop(1, '#1a1a1a');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);

            // Pulse Effect
            const avg = dataArray.reduce((p, c) => p + c, 0) / dataArray.length;
            const pulse = (avg / 255) * 50;

            ctx.strokeStyle = 'rgba(0, 122, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, 200 + pulse, 0, Math.PI * 2);
            ctx.stroke();

            // Waveform
            ctx.beginPath();
            ctx.strokeStyle = '#007aff';
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';

            const barWidth = (width / dataArray.length) * 2.5;
            let x = 0;

            for (let i = 0; i < dataArray.length; i++) {
                const barHeight = (dataArray[i] / 255) * 400;
                ctx.moveTo(x, height / 2 - barHeight / 2);
                ctx.lineTo(x, height / 2 + barHeight / 2);
                x += barWidth + 1;
            }
            ctx.stroke();

            // Progress Ring
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 10;
            ctx.arc(width / 2, height / 2, 300, 0, Math.PI * 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 10;
            ctx.arc(width / 2, height / 2, 300, -Math.PI / 2, (-Math.PI / 2) + (elapsed / duration) * (Math.PI * 2));
            ctx.stroke();

            requestAnimationFrame(draw);
        }

        recorder.start();
        source.start();
        requestAnimationFrame(draw);
    });
}

export async function captureMicStream(): Promise<{ stream: MediaStream, analyser: AnalyserNode, audioContext: AudioContext }> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    return { stream, analyser, audioContext };
}

export function drawWaveform(ctx: CanvasRenderingContext2D, dataArray: Uint8Array, width: number, height: number, color: string = '#007aff') {
    // Pulse Effect
    const avg = dataArray.reduce((p, c) => p + c, 0) / dataArray.length;
    const pulse = (avg / 255) * 50;

    ctx.strokeStyle = 'rgba(0, 122, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 200 + pulse, 0, Math.PI * 2);
    ctx.stroke();

    // Waveform
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    const barWidth = (width / dataArray.length) * 2.5;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * 400;
        ctx.moveTo(x, height / 2 - barHeight / 2);
        ctx.lineTo(x, height / 2 + barHeight / 2);
        x += barWidth + 1;
    }
    ctx.stroke();
}
