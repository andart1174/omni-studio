/**
 * Video Engine - Handles screen recording and video processing
 */

export async function startScreenCapture(): Promise<{ stream: MediaStream, recorder: MediaRecorder }> {
    const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 30 } },
        audio: true
    });

    const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
    });

    return { stream, recorder };
}

export function stopScreenCapture(stream: MediaStream, recorder: MediaRecorder): Promise<Blob> {
    return new Promise((resolve) => {
        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            stream.getTracks().forEach(track => track.stop());
            resolve(blob);
        };
        recorder.stop();
    });
}
