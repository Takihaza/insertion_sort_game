// Biến để theo dõi thoại hiện tại
let currentThoai = 0;

// Hàm để thay đổi background với fade effect
function changeBackgroundWithFade(imageUrl) {
    const tempImage = new Image();
    tempImage.src = imageUrl;
    tempImage.onload = function() {
        document.body.style.backgroundImage = `url('${imageUrl}')`;
        document.body.classList.add('fade-in');
        setTimeout(() => {
            document.body.classList.remove('fade-in');
        }, 500);
    };
}

// Xử lý nút bắt đầu
document.getElementById("start-button").addEventListener("click", function() {
    const startButton = document.getElementById("start-button");
    startButton.classList.add("morph");
    
    // Hiển thị nút skip
    document.getElementById("skip-button-container").style.display = "block";

    setTimeout(function() {
        currentThoai = 1;
        changeBackgroundWithFade('assets/thoai1.png');
        startButton.style.display = "none";
    }, 1000);
});

// Thêm xử lý cho nút skip
document.getElementById("skip-button").addEventListener("click", function() {
    currentThoai = 7;
    changeBackgroundWithFade('assets/thoai7.png');
    
    // Hiển thị nút play và guide
    document.getElementById("play-button").style.display = "block";
    document.getElementById("guide-button-container").style.display = "block";
    
    // Ẩn nút skip
    document.getElementById("skip-button-container").style.display = "none";
});

// Xử lý click chuột để chuyển thoại
document.addEventListener("click", function(event) {
    // Bỏ qua nếu click vào nút start, play, guide hoặc close button hoặc chưa bắt đầu
    if (event.target.id === "start-button" || 
        event.target.id === "play-button" || 
        event.target.id === "guide-button" ||
        event.target.id === "close-button" ||
        event.target.id === "guide-image" ||
        currentThoai === 0) {
        return;
    }
    
    // Chỉ chuyển thoại nếu modal guide không hiển thị
    const guideModal = document.getElementById("guide-modal");
    if (guideModal.classList.contains("show")) {
        return;
    }

    // Chỉ chuyển thoại nếu chưa đến thoại cuối
    if (currentThoai < 7) {
        currentThoai++;
        changeBackgroundWithFade(`assets/thoai${currentThoai}.png`);
        
        // Hiển thị nút play khi đến thoại 7
        if (currentThoai === 7) {
            const playButton = document.getElementById("play-button");
            playButton.style.display = "block";
            // Ẩn nút skip khi đến thoại cuối
            document.getElementById("skip-button-container").style.display = "none";
        }
    }
});
