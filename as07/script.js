document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 【變數定義】
    // ----------------------------------------------------

    // --- 1. 原有的 H-Scroll 變數 (保持不變) ---
    const HScrollContainer = document.getElementById('h-scroll-container');
    const stackedImages = document.querySelectorAll('#h-scroll-container .stacked-image');

    // --- 2. 連續今昔對比 變數 ---
    const overHScrollContainer = document.getElementById('overlay-h-scroll-container');
    
    // 選擇需要 "出現" (應用 clip-path 動畫) 的地圖
    // map-1 是底圖，不需要動畫
    const map2 = document.querySelector('#overlay-h-scroll-container .map-2');
    const map3 = document.querySelector('#overlay-h-scroll-container .map-3');
    const map4 = document.querySelector('#overlay-h-scroll-container .map-4');
    
    // 存放需要動畫的地圖陣列 (依序：2, 3, 4)
    const mapsToAnimate = [map2, map3, map4].filter(Boolean); // filter(Boolean) 確保 null 不會被加進去
    
    // 3 次動畫 (2蓋1, 3蓋2, 4蓋3)
    const numTransitions = mapsToAnimate.length; 
    // 每次轉換分配到的進度 (1 / 3 = 0.333...)
    const progressPerSwitch = (numTransitions > 0) ? 1 / numTransitions : 0;


    // ----------------------------------------------------
    // 【滾動監聽】
    // ----------------------------------------------------
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;

        // --- 1. 執行第一個容器 (#h-scroll-container) 的動畫 (保持不變) ---
        if (HScrollContainer && stackedImages.length > 0) {
            const containerTop = HScrollContainer.offsetTop;
            const containerHeight = HScrollContainer.offsetHeight;

            let scrollProgress = 0;
            if (containerHeight > viewportHeight) {
                scrollProgress = (scrollY - containerTop) / (containerHeight - viewportHeight);
                scrollProgress = Math.max(0, Math.min(1, scrollProgress));
            }

            const imageDisplayThreshold = 1 / stackedImages.length;
            stackedImages.forEach((image, index) => {
                if (scrollProgress >= index * imageDisplayThreshold && imageDisplayThreshold > 0) {
                    image.style.opacity = 1;
                    const slideAmount = (scrollProgress - (index * imageDisplayThreshold)) / imageDisplayThreshold;
                    image.style.transform = `translateX(${(1 - slideAmount) * 100}%)`;
                } else {
                    image.style.opacity = 0;
                    image.style.transform = `translateX(100%)`; 
                }
            });
        }

        
        // --- 2. 執行地圖容器 (#overlay-h-scroll-container) 的動畫 (連續 clip-path) ---
        
        if (!overHScrollContainer || numTransitions === 0) {
            return; 
        }

        const OcontainerTop = overHScrollContainer.offsetTop;
        const OcontainerHeight = overHScrollContainer.offsetHeight;
        
        // 計算地圖容器的「總體進度」(OscrollProgress: 0 到 1)
        let OscrollProgress = 0;
        if (OcontainerHeight > viewportHeight) {
            OscrollProgress = (scrollY - OcontainerTop) / (OcontainerHeight - viewportHeight);
            OscrollProgress = Math.max(0, Math.min(1, OscrollProgress));
        }

        
        // ----------------------------------------------------
        // 【連續 "Wipe" 效果核心】
        // ----------------------------------------------------
        
        // 遍歷需要動畫的地圖 (map-2, map-3, map-4)
        mapsToAnimate.forEach((map, index) => {
            
            // 1. 定義當前地圖的「動畫區間」
            // index 0 (map-2): 總進度 0.0 到 0.333
            // index 1 (map-3): 總進度 0.333 到 0.666
            // index 2 (map-4): 總進度 0.666 到 1.0
            const startProgress = index * progressPerSwitch;
            const endProgress = (index + 1) * progressPerSwitch;

            // 2. 計算在當前區間內的「局部進度」(localProgress: 0 到 1)
            let localProgress = 0;
            if (OscrollProgress < startProgress) {
                localProgress = 0; // 動畫尚未開始
            } else if (OscrollProgress >= endProgress) {
                localProgress = 1; // 動畫已完成
            } else {
                // 動畫進行中
                localProgress = (OscrollProgress - startProgress) / progressPerSwitch;
            }

            // 3. 應用 clip-path
            // localProgress = 0 -> clipLeftPercent = 100% (隱藏)
            // localProgress = 1 -> clipLeftPercent = 0% (顯示)
            const clipLeftPercent = 100 - (localProgress * 100);
            
            map.style.clipPath = `inset(0% 0% 0% ${clipLeftPercent}%)`;
        });
    });
});