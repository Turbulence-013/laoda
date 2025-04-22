
// 当前处理状态
var currentImage = null;
var canvasContexts = {};



// Floyd-Steinberg抖动算法
function floydSteinbergDithering(data, width, height) {
    // 转换为灰度
    for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
        data[i] = data[i+1] = data[i+2] = gray;
    }

    // 应用误差扩散
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const oldPixel = data[idx];
            const newPixel = oldPixel < 128 ? 0 : 255;
            data[idx] = data[idx+1] = data[idx+2] = newPixel;

            const error = oldPixel - newPixel;

            // 扩散误差到邻近像素
            if (x + 1 < width) {
                const rightIdx = idx + 4;
                data[rightIdx] += error * 7 / 16;
            }
            if (x > 0 && y + 1 < height) {
                const bottomLeftIdx = idx + width * 4 - 4;
                data[bottomLeftIdx] += error * 3 / 16;
            }
            if (y + 1 < height) {
                const bottomIdx = idx + width * 4;
                data[bottomIdx] += error * 5 / 16;
            }
            if (x + 1 < width && y + 1 < height) {
                const bottomRightIdx = idx + width * 4 + 4;
                data[bottomRightIdx] += error * 1 / 16;
            }
        }
    }
}

// 处理黑白抖动
function processBW() {
    if (!currentImage) return;

    const imageData = canvasContexts.original.getImageData(0, 0, currentImage.width, currentImage.height);
    const data = new Uint8ClampedArray(imageData.data);

    floydSteinbergDithering(data, currentImage.width, currentImage.height);

    const result = new ImageData(data, currentImage.width, currentImage.height);
    canvasContexts.bw.putImageData(result, 0, 0);
}