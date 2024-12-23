async function checkPause() {
    while (paused) {
        await new Promise(resolve => setTimeout(resolve, 100));  // Chờ 100ms mỗi lần nếu tạm dừng
    }
}

async function Insertion() {
    console.log("Insertion function started");

    for (var j = 1; j < array_size; j++) {
        await checkPause();
        await highlightCode(1);
        document.getElementById("explanation").innerText = `Đang xử lý phần tử thứ ${j + 1} (giá trị ${div_sizes[j]}) để sắp xếp vào vị trí thích hợp.`;

        // Lưu giá trị key và giữ lại đối tượng thanh bar
        var key = div_sizes[j];
        var keyDiv = divs[j];
        await div_update(keyDiv, key, "yellow"); // Đánh dấu phần tử key màu vàng

        var i = j - 1;

        await highlightCode(4);
        document.getElementById("explanation").innerText = `So sánh giá trị ${key} với các phần tử đã sắp xếp trước đó.`;

        // So sánh và di chuyển các phần tử lớn hơn key
        while (i >= 0 && div_sizes[i] > key) {
            await checkPause();
            await highlightCode(5);
            document.getElementById("explanation").innerText = `Phần tử ${div_sizes[i]} lớn hơn ${key}, di chuyển sang phải.`;

            // Di chuyển phần tử lớn hơn key sang phải
            div_sizes[i + 1] = div_sizes[i]; // Cập nhật giá trị
            await div_update(divs[i + 1], div_sizes[i + 1], "red"); // Đánh dấu phần tử bị di chuyển bằng màu đỏ

            i = i - 1;
        }

        // Chèn key vào vị trí thích hợp
        div_sizes[i + 1] = key; // Đưa giá trị key vào đúng vị trí
        await highlightCode(8);
        document.getElementById("explanation").innerText = `Chèn giá trị ${key} vào vị trí thích hợp.`;
        await div_update(divs[i + 1], key, "#2ecc71"); // Cập nhật đúng giá trị và màu xanh lá

        // Cập nhật màu xanh lá cây cho tất cả các phần tử đã sắp xếp
        for (var k = 0; k <= j; k++) {
            await div_update(divs[k], div_sizes[k], "#2ecc71"); // Đảm bảo đúng màu xanh lá
        }
    }

    await checkPause();
    await highlightCode(10);
    document.getElementById("explanation").innerText = "Mảng đã được sắp xếp.";
    for (var t = 0; t < array_size; t++) {
        await div_update(divs[t], div_sizes[t], "#2ecc71"); // Đảm bảo toàn bộ mảng chuyển thành màu xanh lá cây
    }

    enable_buttons();
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
    // Đặt lại mảng và thanh bar
    div_sizes = [];
    divs = [];
    document.getElementById("array_container").innerHTML = ""; // Xóa các thanh bar hiện tại

    // Tạo lại mảng ngẫu nhiên
    generate_array();

    // Đặt lại giải thích
    document.getElementById("explanation").innerText = "Giải thích từng bước sẽ được hiển thị ở đây.";

    // Đặt lại trạng thái bước
    steps = [];
    stepIndex = 0;

    // Đặt lại màu sắc và nội dung của các thanh bar
    for (let i = 0; i < div_sizes.length; i++) {
        div_update(divs[i], div_sizes[i], "#3498db"); // Màu xanh cho trạng thái ban đầu
    }
}
