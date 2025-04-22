// hsl-posterization.js
// RGB转HSL
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

// HSL转RGB
function hslToRgb(h, s, l) {
    h /= 360, s /= 100, l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}

// 存储当前选中的调色板信息
let currentPalette = {
    name: "Earth Tones", // 默认选中第一个
    hues: [20, 40, 60, 90, 120, 150]
};

// 初始化调色板选择功能
function initPaletteSelection() {
    const paletteButtons = document.querySelectorAll('.palette-btn');

    paletteButtons.forEach(button => {
        // 设置第一个为默认选中
        if(button.dataset.name === currentPalette.name) {
            button.classList.add('active');
        }

        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            paletteButtons.forEach(btn => btn.classList.remove('active'));

            // 为当前点击的按钮添加active类
            this.classList.add('active');

            // 更新当前选中的调色板信息
            currentPalette = {
                name: this.dataset.name,
                hues: this.dataset.hue.split(',').map(Number)
            };


            // 调试输出（实际使用时可以删除）
            console.log('Selected palette:', currentPalette.name);
            console.log('Hue values:', currentPalette.hues);
        });
    });
}


function hueDiff(a, b) {
    const diff = Math.abs(a - b);
    return Math.min(diff, 360 - diff);
}
// HSL误差扩散抖动
function hslErrorDiffusion(data, width, height) {
    initPaletteSelection();
    console.log('Applying palette:', currentPalette.name);
    console.log('With hues:', currentPalette.hues);
    let h_lst = new Array(data.length/4).fill(0);

    for (let i = 0; i < data.length; i += 4) {
        let x = i /4 % width ; // 找到它在呃array中的的x,从1开始
        let y = Math.ceil(i / 4 / width); //找到y，从1开始

        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];

        // 转换为HSL
        let [h, s, l] = rgbToHsl(r, g, b);
        h +=  h_lst[i/4];
        h = Math.min(h,360);
        h = Math.max(h,0);

        let new_h;
        let min_dis = 360;
        for(var j=0; j < currentPalette.hues.length; j++)
        {
            if(hueDiff(h,currentPalette.hues[j]) < min_dis)
            {
                min_dis = hueDiff(h,currentPalette.hues[j]);
                new_h = currentPalette.hues[j];
            }
        }

        // 计算误差
        var hError = h - new_h;

        if(Math.abs(hError)>60)
            hError = (hError > 0)?60:-60;

        //扩散
        if(x<width)
            h_lst[i / 4 + 1] = hError * 7 / 16;
        if(y<height) {
            h_lst[i / 4 + width - 1] = hError * 3 / 16;
            h_lst[i / 4 + width] = hError * 3 / 16;
            h_lst[i / 4 + width + 1] = hError / 16;
        }


        //转回rgb
        const [R, G, B] = hslToRgb(new_h, s, l);
        data[i] = R;
        data[i+1] = G;
        data[i+2] = B;

    }
}

// 处理HSL海报化
function processHSL() {
    if (!currentImage) return;

    const imageData = canvasContexts.originalHSL.getImageData(
        0, 0, currentImage.width, currentImage.height
    );
    const data = imageData.data;

    hslErrorDiffusion(data, currentImage.width, currentImage.height);
    const result = new ImageData(data, currentImage.width, currentImage.height);


    canvasContexts.hsl.putImageData(result, 0, 0);
}