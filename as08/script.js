document.addEventListener('DOMContentLoaded', () => {

            // --- 1. 影片自動播放觀察器 ---
            // 當影片進入畫面 50% 時播放，移出時暫停
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const video = entry.target;
                    if (entry.isIntersecting) {
                        // 進入畫面，嘗試播放
                        // 檢查影片是否已暫停
                        if (video.paused) {
                            const playPromise = video.play();
                            if (playPromise !== undefined) {
                                playPromise.catch(error => {
                                    // 捕捉潛在的自動播放失敗（例如瀏覽器限制）
                                    // NotSupportedError: The operation is not supported.
                                    // AbortError: The play request was interrupted.
                                    // 我們會記錄錯誤名稱和訊息，以便更清楚地了解問題
                                    console.warn("影片自動播放被瀏覽器阻止:", error.name, error.message);
                                });
                            }
                        }
                    } else {
                        // 移出畫面，暫停
                        if (!video.paused) {
                            video.pause();
                        }
                    }
                });
            }, { 
                threshold: 0.5 // 影片可見度達到 50% 時觸發
            });

            // 選取所有 .chapter-video 並開始觀察
            const videos = document.querySelectorAll('.chapter-video');
            videos.forEach(video => {
                videoObserver.observe(video);
            });

            // --- 2. 文字淡入觀察器 ---
            // 當文字區塊進入畫面 50% 時，添加 .is-visible class
            const textObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    } else {
                        // 可選：當文字滾出畫面時移除 class，使其再次滾入時能重複淡入
                        entry.target.classList.remove('is-visible');
                    }
                });
            }, { 
                threshold: 0.5, // 區塊可見度 50%
                rootMargin: "0px 0px -50px 0px" // 稍微延遲觸發，使其更靠近中心
            });

            // 選取所有 .text-content-block 並開始觀察
            const textBlocks = document.querySelectorAll('.text-content-block');
            textBlocks.forEach(block => {
                textObserver.observe(block);
            });

            console.log("滾動敘事腳本已載入");
        });