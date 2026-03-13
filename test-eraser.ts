import { applyMagicEraser } from './src/engine/visualEngine';

// Mock ImageData
const width = 100;
const height = 100;
const data = new Uint8ClampedArray(width * height * 4);

// Fill with red
for (let i = 0; i < data.length; i += 4) {
    data[i] = 255; data[i + 1] = 0; data[i + 2] = 0; data[i + 3] = 255;
}

// Draw a white 10x10 square (mask) in the middle
for (let y = 45; y < 55; y++) {
    for (let x = 45; x < 55; x++) {
        const i = (y * width + x) * 4;
        data[i] = 255; data[i + 1] = 255; data[i + 2] = 255;
    }
}

const imageData = { data, width, height };

console.log('Before Eraser (middle pixel):', data[(50 * width + 50) * 4], data[(50 * width + 50) * 4 + 1], data[(50 * width + 50) * 4 + 2]);

applyMagicEraser(imageData);

console.log('After Eraser (middle pixel):', data[(50 * width + 50) * 4], data[(50 * width + 50) * 4 + 1], data[(50 * width + 50) * 4 + 2]);

let maskPixelCount = 0;
for (let i = 0; i < data.length; i += 4) {
    if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) maskPixelCount++;
}
console.log('Remaining mask pixels:', maskPixelCount);
if (maskPixelCount === 0) {
    console.log('SUCCESS: All mask pixels removed.');
} else {
    console.log('FAILURE: Some mask pixels remain.');
}
