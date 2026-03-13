
const fs = require('fs');

function applyMagicEraser(pixels, width, height) {
    for (let pass = 0; pass < 50; pass++) {
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const i = (y * width + x) * 4;

                if (pixels[i] > 240 && pixels[i + 1] > 240 && pixels[i + 2] > 240) {
                    let totalR = 0, totalG = 0, totalB = 0, count = 0;

                    const neighbors = [
                        ((y - 1) * width + x) * 4,
                        ((y + 1) * width + x) * 4,
                        (y * width + (x - 1)) * 4,
                        (y * width + (x + 1)) * 4
                    ];

                    for (const n of neighbors) {
                        if (pixels[n] <= 240 || pixels[n + 1] <= 240 || pixels[n + 2] <= 240) {
                            totalR += pixels[n];
                            totalG += pixels[n + 1];
                            totalB += pixels[n + 2];
                            count++;
                        }
                    }

                    if (count > 0) {
                        pixels[i] = totalR / count;
                        pixels[i + 1] = totalG / count;
                        pixels[i + 2] = totalB / count;
                        pixels[i + 3] = 255;
                    }
                }
            }
        }
    }
}

// simulate a 5x5 image with center white pixel
let data = new Uint8Array(5 * 5 * 4);
data.fill(0); // black
// draw a white line
data[12 * 4] = 255; data[12 * 4 + 1] = 255; data[12 * 4 + 2] = 255; 

console.log('before:', data[12*4], data[12*4+1]);
applyMagicEraser(data, 5, 5);
console.log('after:', data[12*4], data[12*4+1]);

