/*
Variable naming convention: <object>_<action>_<objectname>; Example -> Button_click_b1;
*/

//Variables (BE CAREFUL THESE MIGHT BE USED IN OTHER JS FILES TOO)
var inp_as = document.getElementById('a_size');
var inp_gen = document.getElementById("a_generate");
var inp_arr = document.getElementById('a_input');
var create_btn = document.getElementById('a_create');
var inp_aspeed = document.getElementById("a_speed");

var array_size = inp_as.value;
var div_sizes = [];
var divs = [];
var margin_size = 0.1;
var cont = document.getElementById("array_container");
cont.style="flex-direction:row";

//Hiding the code for all the algorithm once the programs load
$("#bbl").hide();
$("#insert").hide();
$("#select").hide();
$("#merge").hide();
$("#quick").hide();

//Array generation and updation.

var sorting = false;
var paused = false;

document.getElementById("a_pause").addEventListener("click", pauseSort);
document.getElementById("a_continue").addEventListener("click", continueSort);

function pauseSort() {
    paused = true;  // Đặt trạng thái tạm dừng
    document.getElementById("a_pause").disabled = true;  // Vô hiệu hóa nút "Tạm dừng"
    document.getElementById("a_continue").disabled = false;  // Kích hoạt nút "Tiếp tục"
}

function continueSort() {
    paused = false;  // Hủy bỏ trạng thái tạm dừng
    document.getElementById("a_pause").disabled = false;  // Kích hoạt lại nút "Tạm dừng"
    document.getElementById("a_continue").disabled = true;  // Vô hiệu hóa nút "Tiếp tục"
}

inp_gen.addEventListener("click", generate_array);
create_btn.addEventListener("click", create_array);
inp_as.addEventListener("input", update_array_size);

function generate_array() {
    cont.innerHTML = "";
    div_sizes = [];
    divs = [];

    // Tạo một mảng các số từ 10 đến 100 để chọn ngẫu nhiên
    let possibleValues = Array.from({length: 91}, (_, i) => i + 10);
    
    // Fisher-Yates shuffle để chọn ngẫu nhiên không trùng lặp
    for (var i = 0; i < array_size; i++) {
        let randomIndex = Math.floor(Math.random() * possibleValues.length);
        div_sizes[i] = possibleValues[randomIndex];
        // Xóa giá trị đã chọn để tránh trùng lặp
        possibleValues.splice(randomIndex, 1);
        
        divs[i] = create_div(div_sizes[i]);
        cont.appendChild(divs[i]);
    }
}


function create_array() {
    var input_arr = inp_arr.value.split(',').map(Number);
    if (input_arr.length > 0 && !input_arr.some(isNaN)) {
        cont.innerHTML = "";
        div_sizes = input_arr;
        divs = [];
        array_size = input_arr.length;
        inp_as.value = array_size;

        for (var i = 0; i < array_size; i++) {
            divs[i] = create_div(div_sizes[i]);
            cont.appendChild(divs[i]);
        }
    } else {
        alert("Vui lòng nhập một mảng hợp lệ!");
    }
}

function create_div(val) {
    var div = document.createElement("div");
    div.classList.add("array-bar");
    div.style = `margin:0% ${margin_size}%; background-color: #3498db; width:${(100/array_size)-(2*margin_size)}%; height:${val}%;`;
    
    var value_label = document.createElement("span");
    value_label.classList.add("bar-value");
    value_label.textContent = val;
    div.appendChild(value_label);
    
    return div;
}

function update_array_size() {
    array_size = inp_as.value;
    if (array_size > 30) {
        array_size = 30;
        inp_as.value = "30";
    }
    generate_array();
}

async function runInsertionSort() {
    console.log("runInsertionSort called");
    disable_buttons();
    Insertion().then(() => {
        // Re-enable buttons or perform any post-sorting actions here
        enable_buttons();
    }).catch(error => {
        console.error("Error during sorting:", error);
        enable_buttons();
    });
}

function disable_buttons() {
    document.getElementById("a_generate").disabled = true;
    document.getElementById("a_size").disabled = true;
    document.getElementById("a_sort").disabled = true;
    document.getElementById("a_speed").disabled = true;
    document.getElementById("a_pause").disabled = false;
    document.getElementById("a_continue").disabled = true;
}

window.onload = function() {
    inp_gen.addEventListener("click", generate_array);
    create_btn.addEventListener("click", create_array);
    inp_as.addEventListener("input", update_array_size);
    inp_aspeed.addEventListener("input", vis_speed);
    
    var sortButton = document.getElementById("a_sort");
    if (sortButton) {
        sortButton.addEventListener("click", runInsertionSort);
    } else {
        console.error("Sort button not found");
    }
    
    // Thêm xử lý sự kiện cho nút Reset
    var resetButton = document.getElementById("a_reset");
    if (resetButton) {
        resetButton.addEventListener("click", resetContent);
    }

    generate_array();
};