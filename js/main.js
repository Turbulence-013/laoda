// main.js
// 全局变量
let currentImage = null;
const canvasContexts = {};

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有Canvas上下文
    initCanvasContexts();

    // 设置事件监听
    initEvents();

});

// 初始化所有Canvas上下文
function initCanvasContexts() {
    // 黑白抖动相关Canvas
    canvasContexts.original = document.getElementById('originalCanvas').getContext('2d');
    canvasContexts.bw = document.getElementById('bwCanvas').getContext('2d');

    // HSL海报化相关Canvas
    canvasContexts.originalHSL = document.getElementById('originalCanvasHSL').getContext('2d');
    canvasContexts.hsl = document.getElementById('hslCanvas').getContext('2d');
}

// 初始化事件监听
function initEvents() {
    // 文件上传事件
    document.getElementById('imageUpload').addEventListener('change', handleFileUpload);

    // 黑白抖动处理按钮
    document.getElementById('processBW').addEventListener('click', processBW);

    // HSL海报化处理按钮
    document.getElementById('processHSL').addEventListener('click', processHSL);
}



// 文件上传处理
function handleFileUpload(e) {
    if (!e.target.files.length) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            currentImage = img;

            // 设置所有Canvas尺寸
            Object.values(canvasContexts).forEach(ctx => {
                ctx.canvas.width = img.width;
                ctx.canvas.height = img.height;
            });

            // 在所有原始canvas上绘制图像
            canvasContexts.original.drawImage(img, 0, 0);
            canvasContexts.originalHSL.drawImage(img, 0, 0);

            // 启用所有处理按钮
            document.getElementById('processBW').disabled = false;
            document.getElementById('processHSL').disabled = false;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}