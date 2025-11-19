document.addEventListener('DOMContentLoaded', () => {
    // 橫向滾動效果
    const horizontalSection = document.getElementById('horizontal-scroll-section');
    const horizontalImage = document.querySelector('.horizontal-scroll-image');

    if (horizontalSection && horizontalImage) {
        const handleHorizontalScroll = () => {
            // 獲取section的位置信息
            const sectionRect = horizontalSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // 計算滾動進度，只有當圖片頂部觸及視窗頂部時才開始
            const startTriggerPosition = sectionRect.top;
            const scrollableDistance = horizontalSection.offsetHeight - windowHeight;
            
            // 如果還沒碰到頂部，保持在原位
            if (startTriggerPosition > 0) {
                horizontalImage.style.transform = 'translateX(0)';
                return;
            }
            
            // 如果已經滾動完畢，保持在最終位置
            if (startTriggerPosition < -scrollableDistance) {
                const imageWidth = horizontalImage.offsetWidth;
                const containerWidth = horizontalSection.offsetWidth;
                const maxScroll = imageWidth - containerWidth;
                horizontalImage.style.transform = `translateX(-${maxScroll}px)`;
                return;
            }
            
            // 計算滾動進度（0 到 1），使用 easeInOutQuad 緩動函數
            let scrollProgress = Math.abs(startTriggerPosition) / scrollableDistance;
            
            // 緩動函數：讓滾動在開始和結束時更慢，中間更快
            const easeInOutQuad = t => {
                return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            };
            
            // 應用緩動函數
            const normalizedProgress = Math.max(0, Math.min(1, easeInOutQuad(scrollProgress)));
            
            // 計算並應用水平位移
            const imageWidth = horizontalImage.offsetWidth;
            const containerWidth = horizontalSection.offsetWidth;
            const maxScroll = imageWidth - containerWidth;
            const translateX = maxScroll * normalizedProgress;
            
            requestAnimationFrame(() => {
                horizontalImage.style.transform = `translateX(-${translateX}px)`;
            });
        };

        // 使用 Intersection Observer 來監測 section 的可見性
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    window.addEventListener('scroll', handleHorizontalScroll, { passive: true });
                } else {
                    window.removeEventListener('scroll', handleHorizontalScroll);
                }
            });
        }, {
            threshold: 0.1 // 當 10% 的內容可見時觸發
        });

        observer.observe(horizontalSection);
        
        // 初始化時執行一次
        handleHorizontalScroll();
    }
    // ----------------------------------------------------
    // 【變數定義】
    // ----------------------------------------------------

    // --- 1. 原有的 H-Scroll 變數 (保持不變) ---
    const HScrollContainer = document.getElementById('h-scroll-container');
    const stackedImages = document.querySelectorAll('#h-scroll-container .stacked-image');

    // --- 反向滾動區域變數 ---
    const reverseScrollSection = document.getElementById('reverse-scroll-section');
    const reverseScrollImage = document.querySelector('.reverse-scroll-image');

    // 反向滾動處理函數
    function handleReverseScroll() {
        if (!reverseScrollSection || !reverseScrollImage) return;

        const sectionRect = reverseScrollSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // 只有當區域進入視窗時才開始計算
        if (sectionRect.top <= viewportHeight && sectionRect.bottom >= 0) {
            // 計算進度：從圖片完全進入視窗開始，到完全離開視窗結束
            let progress = (viewportHeight - sectionRect.top) / (sectionRect.height - viewportHeight);
            progress = Math.max(0, Math.min(1, progress));

            // 使用 easeInOutQuad 緩動函數使動畫更流暢
            const easeInOutQuad = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            const easedProgress = easeInOutQuad(progress);

            // 從右側滑入，最終停在左側
            reverseScrollImage.style.transform = `translateX(${(1 - easedProgress) * 100}%)`;
        }
    }

    // 使用 Intersection Observer 監聽區域可見性
    const reverseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                window.addEventListener('scroll', handleReverseScroll, { passive: true });
                // 初始化時執行一次以設置正確的起始位置
                handleReverseScroll();
            } else {
                window.removeEventListener('scroll', handleReverseScroll);
            }
        });
    }, {
        // 增加 rootMargin 使觀察區域更大，提前開始準備動畫
        rootMargin: '50px 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    });

    if (reverseScrollSection) {
        reverseObserver.observe(reverseScrollSection);
        // 初始化時執行一次
        handleReverseScroll();
    }

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