
function initCanvasContexts(originalId, bwId, rgbId, hslId) {
    canvasContexts.original = document.getElementById(originalId).getContext('2d');
    canvasContexts.bw = document.getElementById(bwId).getContext('2d');
    canvasContexts.rgb = document.getElementById(rgbId).getContext('2d');
    canvasContexts.hsl = document.getElementById(hslId).getContext('2d');
}
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