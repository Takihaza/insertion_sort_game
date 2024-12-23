//We only have to change background-color and height of the sorting element.

var speed=1000;
var delay_time = 1000; // Đặt delay mặc định là 2 giây

inp_aspeed.addEventListener("input",vis_speed);

function vis_speed()
{
    var array_speed=inp_aspeed.value;
    switch(parseInt(array_speed))
    {
        case 1: delay_time = 1000; break; // Rất chậm
        case 2: delay_time = 700; break; // Chậm
        case 3: delay_time = 600; break; // Trung bình
        case 4: delay_time = 500; break; // Nhanh
        case 5: delay_time = 400; break;  // Rất nhanh
    }
}

var c_delay=0;//This is updated ov every div change so that visualization is visible.

async function div_update(cont, height, color) {
    await checkPause(); // Kiểm tra ngay trước khi cập nhật
    return new Promise(resolve => {
        setTimeout(async function() {
            await checkPause(); // Kiểm tra trạng thái dừng khi setTimeout được gọi
            cont.style.backgroundColor = color;
            cont.style.height = height + "%";
            cont.querySelector(".bar-value").textContent = Math.round(height);
            resolve();
        }, delay_time);
    });
}
function enable_buttons()
{
    window.setTimeout(function(){
        document.getElementById("a_generate").disabled = false;
        document.getElementById("a_size").disabled = false;
        document.getElementById("a_sort").disabled = false;
        document.getElementById("a_speed").disabled = false;
        document.getElementById("a_pause").disabled = true;
        document.getElementById("a_continue").disabled = true;
    },c_delay+=delay_time);
}
