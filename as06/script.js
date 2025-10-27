// --- 節流閥 (Throttle) ---
// 限制一個函式在特定時間內只能執行一次
// 這是使用 onscroll 時保持效能的關鍵
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// --- DOM 元素選取 ---
const flipCard = document.getElementById('flipCard');
const focusSections = document.querySelectorAll('.focusable-section');
const highlightSpans = document.querySelectorAll('.highlight-on-scroll');

// --- 主要的捲動處理函式 ---
function handleScroll() {
    // 取得目前可視範圍的高度
    const viewportHeight = window.innerHeight;

    // --- 效果一：翻卡邏輯 (運作正常) ---
    if (flipCard) {
        const cardRect = flipCard.getBoundingClientRect();
        const viewportCenterY = viewportHeight / 2;

        if (cardRect.top <= viewportCenterY && cardRect.bottom >= viewportCenterY) {
            flipCard.classList.add('is-flipped');
        } else {
            flipCard.classList.remove('is-flipped');
        }
    }

    // --- 效果二：專注模式邏輯 (已修正) ---
    focusSections.forEach(section => {
        const sectionRect = section.getBoundingClientRect();

        // 設定一個 "即將離開" 的觸發邊界 (例如離頂部 50px)
        const exitTriggerMargin = 50; 

        // 修正後的邏輯：
        // 只要章節的底部滾動到觸發線 (50px) 之上，就添加 class
        if (sectionRect.bottom < exitTriggerMargin) {
            section.classList.add('is-fading');
        } else {
            // 否則 (滾回到 50px 之下)，就移除 class
            section.classList.remove('is-fading');
        }
    });

    // --- 效果三：繪製底線邏輯 (可重複觸發) ---
    highlightSpans.forEach(span => {
        const spanRect = span.getBoundingClientRect();

        // 檢查 span 是否在可視範圍內
        // 條件：(span 的底部 > 0) 且 (span 的頂部 < 螢幕高度)
        if (spanRect.bottom > 0 && spanRect.top < viewportHeight) {
            // 在可視範圍內，添加 class
            span.classList.add('is-drawn');
        } else {
            // 完全滾出螢幕 (上方或下方)，移除 class 以便重複觸發
            span.classList.remove('is-drawn');
        }
    });
}

// --- 事件監聽 ---
const throttledScrollHandler = throttle(handleScroll, 100);
window.addEventListener('scroll', throttledScrollHandler);
window.addEventListener('load', handleScroll);
