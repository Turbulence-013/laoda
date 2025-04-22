document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const fileInput = document.getElementById('imageUpload');
    const originalCanvas = document.getElementById('originalCanvas');
    const bwCanvas = document.getElementById('bwCanvas');
    const processBWBtn = document.getElementById('processBW');
    const originalCtx = originalCanvas.getContext('2d');
    const bwCtx = bwCanvas.getContext('2d');

    // File input handler
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length === 0) return;

        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                // Set canvas dimensions to match image
                originalCanvas.width = img.width;
                originalCanvas.height = img.height;
                bwCanvas.width = img.width;
                bwCanvas.height = img.height;

                // Draw original image
                originalCtx.drawImage(img, 0, 0);

                // Enable the process button
                processBWBtn.disabled = false;
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Process B&W button handler
    processBWBtn.addEventListener('click', function() {
        if (!originalCanvas.width) return;

        // Get image data from original canvas
        const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
        const data = imageData.data;

        // Create a copy for the B&W result
        const bwData = new ImageData(new Uint8ClampedArray(data), originalCanvas.width, originalCanvas.height);

        // Apply Floyd-Steinberg dithering
        floydSteinbergDithering(bwData.data, bwData.width, bwData.height);

        // Put the result on B&W canvas
        bwCtx.putImageData(bwData, 0, 0);
    });

    // Floyd-Steinberg dithering algorithm
    function floydSteinbergDithering(data, width, height) {
        // Convert to grayscale first
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // Luminosity method for grayscale conversion
            const gray = 0.21 * r + 0.72 * g + 0.07 * b;
            data[i] = data[i + 1] = data[i + 2] = gray;
        }

        // Apply error diffusion
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const oldPixel = data[idx];
                const newPixel = oldPixel < 128 ? 0 : 255;
                data[idx] = data[idx + 1] = data[idx + 2] = newPixel;

                const error = oldPixel - newPixel;

                // Distribute error to neighboring pixels
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
});