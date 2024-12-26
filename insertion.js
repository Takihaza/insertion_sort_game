let isRunning = false;

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