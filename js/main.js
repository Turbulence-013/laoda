
// 当DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化Canvas上下文
    initCanvasContexts(
        'originalCanvas',
        'bwCanvas',
        'rgbCanvas',
        'hslCanvas'
    );

    // 设置事件监听
    initEvents();
});