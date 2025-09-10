<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>網頁練習頁面</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        h1 {
            color: #4a5568;
            margin-bottom: 10px;
            font-size: 2.5em;
        }

        .subtitle {
            color: #718096;
            font-size: 1.2em;
        }

        .navbar {
            background: rgba(255, 255, 255, 0.9);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .nav-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            list-style: none;
        }

        .nav-links a {
            text-decoration: none;
            color: #4a5568;
            padding: 10px 20px;
            border-radius: 5px;
            transition: all 0.3s ease;
        }

        .nav-links a:hover {
            background: #667eea;
            color: white;
            transform: translateY(-2px);
        }

        .content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }

        .main-content {
            background: rgba(255, 255, 255, 0.95);
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .sidebar {
            background: rgba(255, 255, 255, 0.95);
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .practice-section {
            margin-bottom: 30px;
        }

        .practice-section h3 {
            color: #4a5568;
            margin-bottom: 15px;
            font-size: 1.5em;
        }

        .btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 5px;
            transition: all 0.3s ease;
        }

        .btn:hover {
            background: #5a67d8;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .btn:active {
            transform: translateY(0);
        }

        .color-box {
            width: 100px;
            height: 100px;
            background: #e2e8f0;
            border-radius: 10px;
            margin: 10px 0;
            transition: all 0.3s ease;
            border: 2px solid #cbd5e0;
        }

        .text-display {
            background: #f7fafc;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #667eea;
            margin: 10px 0;
            min-height: 50px;
        }

        .counter {
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
            text-align: center;
            margin: 20px 0;
        }

        footer {
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .hidden {
            display: none;
        }

        .fade-in {
            animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
            .content {
                grid-template-columns: 1fr;
            }
            
            .nav-links {
                flex-direction: column;
                align-items: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>網頁練習頁面</h1>
            <p class="subtitle">HTML + CSS + jQuery 互動練習</p>
        </header>

        <nav class="navbar">
            <ul class="nav-links">
                <li><a href="#home">首頁</a></li>
                <li><a href="#practice">練習</a></li>
                <li><a href="#about">關於</a></li>
                <li><a href="#contact">聯絡</a></li>
            </ul>
        </nav>

        <div class="content">
            <main class="main-content">
                <div class="practice-section">
                    <h3>按鈕互動練習</h3>
                    <button class="btn" id="changeColor">改變顏色</button>
                    <button class="btn" id="showMessage">顯示訊息</button>
                    <button class="btn" id="toggleContent">切換內容</button>
                    <div class="color-box" id="colorBox"></div>
                </div>

                <div class="practice-section">
                    <h3>計數器練習</h3>
                    <div class="counter" id="counter">0</div>
                    <button class="btn" id="increment">增加</button>
                    <button class="btn" id="decrement">減少</button>
                    <button class="btn" id="reset">重置</button>
                </div>

                <div class="practice-section">
                    <h3>文字顯示區域</h3>
                    <div class="text-display" id="textDisplay">點擊按鈕來顯示訊息...</div>
                </div>

                <div class="practice-section hidden" id="hiddenContent">
                    <h3>隱藏內容</h3>
                    <p>這是一個可以切換顯示/隱藏的內容區域！</p>
                    <p>使用jQuery的toggle功能來控制顯示狀態。</p>
                </div>
            </main>

            <aside class="sidebar">
                <div class="practice-section">
                    <h3>側邊欄功能</h3>
                    <button class="btn" id="changeTheme">切換主題</button>
                    <button class="btn" id="animateBox">動畫效果</button>
                    <p style="margin-top: 20px; color: #718096;">
                        這裡是側邊欄內容，可以放置額外的功能按鈕和資訊。
                    </p>
                </div>

                <div class="practice-section">
                    <h3>快速操作</h3>
                    <button class="btn" id="fadeIn">淡入效果</button>
                    <button class="btn" id="slideToggle">滑動切換</button>
                </div>
            </aside>
        </div>

        <footer>
            <p>&copy; 2024 網頁練習頁面 - 使用 HTML、CSS 和 jQuery 製作</p>
        </footer>
    </div>

    <!-- jQuery CDN -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    
    <script>
        $(document).ready(function() {
            // 變數初始化
            let counter = 0;
            let isDarkTheme = false;
            
            // 改變顏色按鈕
            $('#changeColor').click(function() {
                const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                $('#colorBox').css({
                    'background-color': randomColor,
                    'transform': 'scale(1.1)'
                }).animate({
                    'transform': 'scale(1)'
                }, 300);
            });

            // 顯示訊息按鈕
            $('#showMessage').click(function() {
                const messages = [
                    '你好！歡迎來到練習頁面！',
                    'jQuery 讓網頁互動變得簡單！',
                    '這是一個隨機訊息！',
                    '繼續練習，你會變得更強！',
                    'HTML + CSS + jQuery = 強大的組合！'
                ];
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                $('#textDisplay').html(randomMessage).addClass('fade-in');
                setTimeout(() => $('#textDisplay').removeClass('fade-in'), 500);
            });

            // 切換內容按鈕
            $('#toggleContent').click(function() {
                $('#hiddenContent').slideToggle(500);
            });

            // 計數器功能
            $('#increment').click(function() {
                counter++;
                $('#counter').text(counter).addClass('fade-in');
                setTimeout(() => $('#counter').removeClass('fade-in'), 300);
            });

            $('#decrement').click(function() {
                counter--;
                $('#counter').text(counter).addClass('fade-in');
                setTimeout(() => $('#counter').removeClass('fade-in'), 300);
            });

            $('#reset').click(function() {
                counter = 0;
                $('#counter').text(counter).addClass('fade-in');
                setTimeout(() => $('#counter').removeClass('fade-in'), 300);
            });

            // 切換主題
            $('#changeTheme').click(function() {
                isDarkTheme = !isDarkTheme;
                if (isDarkTheme) {
                    $('body').css({
                        'background': 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
                        'color': '#e2e8f0'
                    });
                    $('.main-content, .sidebar, header, .navbar, footer').css({
                        'background': 'rgba(45, 55, 72, 0.95)',
                        'color': '#e2e8f0'
                    });
                } else {
                    $('body').css({
                        'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        'color': '#333'
                    });
                    $('.main-content, .sidebar, header, .navbar, footer').css({
                        'background': 'rgba(255, 255, 255, 0.95)',
                        'color': '#333'
                    });
                }
            });

            // 動畫效果
            $('#animateBox').click(function() {
                $('#colorBox').animate({
                    'width': '150px',
                    'height': '150px'
                }, 500).animate({
                    'width': '100px',
                    'height': '100px'
                }, 500);
            });

            // 淡入效果
            $('#fadeIn').click(function() {
                $('.main-content').fadeOut(300).fadeIn(300);
            });

            // 滑動切換
            $('#slideToggle').click(function() {
                $('.sidebar').slideToggle(500);
            });

            // 導航連結點擊效果
            $('.nav-links a').click(function(e) {
                e.preventDefault();
                $(this).addClass('active');
                setTimeout(() => $(this).removeClass('active'), 200);
            });

            // 頁面載入動畫
            $('.container').hide().fadeIn(1000);
            
            // 按鈕點擊音效模擬（視覺反饋）
            $('.btn').click(function() {
                $(this).addClass('btn-clicked');
                setTimeout(() => $(this).removeClass('btn-clicked'), 150);
            });
        });
    </script>

    <style>
        .btn-clicked {
            transform: scale(0.95) !important;
        }
        
        .active {
            background: #5a67d8 !important;
            color: white !important;
        }
    </style>
</body>
</html>
