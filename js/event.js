

// 文件上传处理
function handleFileUpload(e) {
    if (!e.target.files.length) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            currentImage = img;

            // 设置Canvas尺寸
            Object.values(canvasContexts).forEach(ctx => {
                ctx.canvas.width = img.width;
                ctx.canvas.height = img.height;
            });

            // 绘制原始图像
            canvasContexts.original.drawImage(img, 0, 0);

            // 启用处理按钮
            document.getElementById('processBW').disabled = false;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// 初始化事件
function initEvents() {
    document.getElementById('imageUpload').addEventListener('change', handleFileUpload);
    document.getElementById('processBW').addEventListener('click', processBW);
}