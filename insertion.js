let isRunning = false;
let currentSpeed = 4;
let delay = 1000; // Khởi tạo delay mặc định

async function checkPause() {
    while (paused) {
        await new Promise(resolve => setTimeout(resolve, 100));  // Chờ 100ms mỗi lần nếu tạm dừng
    }
}

async function Insertion() {
    if (isRunning) return; // Nếu đang chạy thì không cho chạy tiếp
    console.log("Insertion function started");
    isRunning = true;

    try {
        for (var j = 1; j < array_size; j++) {
            if (!isRunning) {
                console.log("Sorting stopped");
                return; // Thoát khỏi hàm nếu isRunning = false
            }
            await checkPause();
            await highlightCode(1);
            document.getElementById("explanation").innerText = `Đang xử lý phần tử thứ ${j + 1} (giá trị ${div_sizes[j]}) để sắp xếp vào vị trí thích hợp.`;

            var key = div_sizes[j];
            var keyDiv = divs[j];
            await div_update(keyDiv, key, "yellow");

            var i = j - 1;

            await highlightCode(4);
            document.getElementById("explanation").innerText = `So sánh giá trị ${key} với các phần tử đã sắp xếp trước đó.`;

            while (i >= 0 && div_sizes[i] > key) {
                if (!isRunning) return; // Kiểm tra trong vòng lặp while
                await checkPause();
                await highlightCode(5);
                document.getElementById("explanation").innerText = `Phần tử ${div_sizes[i]} lớn hơn ${key}, di chuyển sang phải.`;

                div_sizes[i + 1] = div_sizes[i];
                await div_update(divs[i + 1], div_sizes[i + 1], "red");

                i = i - 1;
            }

            if (!isRunning) return;
            div_sizes[i + 1] = key;
            await highlightCode(8);
            document.getElementById("explanation").innerText = `Chèn giá trị ${key} vào vị trí thích hợp.`;
            await div_update(divs[i + 1], key, "#2ecc71");

            for (var k = 0; k <= j; k++) {
                if (!isRunning) return;
                await div_update(divs[k], div_sizes[k], "#2ecc71");
            }
        }

        if (isRunning) {
            await highlightCode(10);
            document.getElementById("explanation").innerText = "Mảng đã được sắp xếp.";
            for (var t = 0; t < array_size; t++) {
                await div_update(divs[t], div_sizes[t], "#2ecc71");
            }
        }
    } finally {
        isRunning = false;
        enable_buttons();
    }
}

function highlightCode(lineNumber) {
    return new Promise(resolve => {
        setTimeout(() => {
            document.querySelectorAll("#insertion_code span").forEach(line => line.classList.remove("highlight"));
            document.querySelector(`#insertion_code #line${lineNumber}`).classList.add("highlight");
            resolve();
        }, delay_time);
    });
}

function resetContent() {
    isRunning = false; // Dừng thuật toán
    paused = false;
    
    // Đặt lại các nút về trạng thái ban đầu
    enable_buttons();

    // Đặt lại giá trị input về mặc định
    document.getElementById('a_size').value = "15";
    document.getElementById('a_speed').value = "4";
    document.getElementById('a_input').value = "";
    array_size = 15;

    // Xóa highlight code ngay lập tức
    document.querySelectorAll("#insertion_code span").forEach(line => 
        line.classList.remove("highlight")
    );

    // Đặt lại giải thích
    document.getElementById("explanation").innerText = "Giải thích từng bước sẽ được hiển thị ở đây.";

    // Tạo mảng mới ngay lập tức
    generate_array();
}

// Thêm hàm div_update với delay ngắn hơn
async function div_update(div, height, color) {
    await new Promise(resolve => {
        setTimeout(() => {
            div.style.height = height + "%";
            div.style.backgroundColor = color;
            
            // Cập nhật label
            let value_label = div.querySelector(".bar-value");
            if (value_label) {
                value_label.textContent = height;
            }
            
            resolve();
        }, 1); // Giảm delay xuống tối thiểu
    });
}

// Thêm xử lý sự kiện cho nút reset
document.getElementById("a_reset").addEventListener("click", function() {
    // Dừng tất cả các animation và quá trình sắp xếp
    if (typeof sorting !== 'undefined') {
        clearTimeout(sorting);
    }
    
    // Reset các biến điều khiển
    isSorting = false;
    isPaused = false;
    
    // Xóa hoàn toàn mảng và tạo lại container
    const arrayContainer = document.getElementById("array_container");
    arrayContainer.innerHTML = "";
    
    // Reset các input về mặc định
    document.getElementById("a_size").value = "15";
    document.getElementById("a_speed").value = "4";
    document.getElementById("a_input").value = "";
    
    // Reset text giải thích
    document.getElementById("explanation").textContent = "Giải thích từng bước sẽ được hiển thị ở đây.";
    
    // Reset highlighting trong code
    const codeLines = document.querySelectorAll("#insertion_code span");
    codeLines.forEach(line => {
        line.classList.remove("active");
        line.style.backgroundColor = "";
        line.style.color = ""; // Reset màu chữ
    });
    
    // Reset trạng thái các nút
    enableSortingBtn();
    document.getElementById("a_pause").disabled = true;
    document.getElementById("a_continue").disabled = true;

    // Force stop animation
    if (typeof animationId !== 'undefined') {
        window.cancelAnimationFrame(animationId);
    }
    
    // Clear tất cả các timeout
    var highestTimeoutId = setTimeout(";");
    for (var i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
    }

    // Reset tất cả các thanh về màu mặc định
    const bars = document.getElementsByClassName("array-bar");
    Array.from(bars).forEach(bar => {
        bar.style.backgroundColor = "";
        bar.classList.remove("comparing", "swapping", "sorted");
    });

    // Reset các biến theo dõi trạng thái
    if (typeof currentIdx !== 'undefined') currentIdx = -1;
    if (typeof comparingIdx !== 'undefined') comparingIdx = -1;

    // Reset tốc độ về mặc định
    document.getElementById("a_speed").value = "4";
    updateSpeed(); // Cập nhật delay dựa trên tốc độ mặc định

    updateExplanation('default');
});

// Hàm cập nhật delay dựa trên giá trị của thanh trượt tốc độ
function updateSpeed() {
    const speed = parseInt(document.getElementById("a_speed").value);
    delay = 1100 - speed * 200; // speed 1 -> 900ms, speed 5 -> 100ms
}

// Thêm event listener cho thanh trượt tốc độ
document.getElementById("a_speed").addEventListener("input", updateSpeed);

// Sửa lại hàm sleep để sử dụng delay hiện tại
function sleep() {
    return new Promise(resolve => setTimeout(resolve, delay));
}

// Đảm bảo cập nhật tốc độ ban đầu khi trang được tải
document.addEventListener("DOMContentLoaded", updateSpeed);

// Sửa lại phần disable controls trong quá trình sắp xếp
function disableSortingBtn() {
    document.getElementById("a_generate").disabled = true;
    document.getElementById("a_create").disabled = true;
    document.getElementById("a_sort").disabled = true;
    // Không disable thanh tốc độ
    // document.getElementById("a_speed").disabled = true; // Bỏ dòng này
}

function enableSortingBtn() {
    document.getElementById("a_generate").disabled = false;
    document.getElementById("a_create").disabled = false;
    document.getElementById("a_sort").disabled = false;
    // Không cần enable thanh tốc độ vì nó không bị disable
    // document.getElementById("a_speed").disabled = false; // Bỏ dòng này
}

// Hàm cập nhật giải thích cho từng bước
function updateExplanation(step, key, j) {
    const explanation = document.getElementById("explanation");
    switch(step) {
        case 'start':
            explanation.textContent = `Bắt đầu xét phần tử có giá trị ${key} tại vị trí ${j + 1}`;
            break;
        case 'compare':
            explanation.textContent = `So sánh ${key} với phần tử ${arr[j]} tại vị trí ${j}`;
            break;
        case 'shift':
            explanation.textContent = `Di chuyển phần tử ${arr[j]} sang phải một vị trí vì ${arr[j]} > ${key}`;
            break;
        case 'insert':
            explanation.textContent = `Chèn giá trị ${key} vào vị trí ${j + 1} vì đã tìm được vị trí thích hợp`;
            break;
        case 'sorted':
            explanation.textContent = `Phần mảng bên trái đã được sắp xếp tăng dần`;
            break;
        case 'complete':
            explanation.textContent = `Hoàn thành sắp xếp! Mảng đã được sắp xếp theo thứ tự tăng dần.`;
            break;
        default:
            explanation.textContent = "Giải thích từng bước sẽ được hiển thị ở đây.";
    }
}