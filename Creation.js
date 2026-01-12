const canvas = document.getElementById("canvas");
const bgOptions = document.getElementById("bgOptions");
const addTextBtn = document.getElementById("addText");
const textInput = document.getElementById("textInput");
const textColor = document.getElementById("textColor");
const fontSelect = document.getElementById("fontSelect");
const imgUpload = document.getElementById("imgUpload");
const dateInput = document.getElementById("dateInput");

let selectedBg = null;

// Выбор фона по клику
bgOptions.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
        // Снимаем выделение у всех
        [...bgOptions.children].forEach(img => img.classList.remove("selected"));
        // Выделяем выбранный
        e.target.classList.add("selected");
        selectedBg = e.target.src;
        // Устанавливаем фон холста
        canvas.style.backgroundImage = `url(${selectedBg})`;
        canvas.style.backgroundSize = "cover";
        canvas.style.backgroundPosition = "center";
    }
});

// Добавление текста
addTextBtn.addEventListener("click", () => {
    if (!textInput.value.trim()) return;

    const div = document.createElement("div");
    div.className = "draggable";
    div.textContent = textInput.value;
    div.style.color = textColor.value;
    div.style.fontFamily = fontSelect.value;
    div.style.fontSize = "26px";
    div.style.left = "20px";
    div.style.top = "20px";

    canvas.appendChild(div);
    makeDraggable(div);

    textInput.value = "";
});
dateInput.addEventListener("change", () => {
    if (!dateInput.value) return;

    const dateDiv = document.createElement("div");
    dateDiv.className = "draggable";
    const dateObj = new Date(dateInput.value);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateDiv.textContent = dateObj.toLocaleDateString("ru-RU", options);
    dateDiv.style.color = textColor.value;
    dateDiv.style.fontFamily = fontSelect.value;
    dateDiv.style.fontSize = "20px";
    dateDiv.style.left = "20px";
    dateDiv.style.top = "60px";

    canvas.appendChild(dateDiv);
    makeDraggable(dateDiv);

    dateInput.value = "";
});
imgUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = document.createElement("img");
    img.className = "draggable";
    img.src = URL.createObjectURL(file);
    img.style.width = "200px";
    img.style.borderRadius = "10px";
    img.style.left = "20px";
    img.style.top = "100px";

    img.onload = () => URL.revokeObjectURL(img.src);

    canvas.appendChild(img);
    makeDraggable(img);
});
function makeDraggable(el) {
    let offsetX, offsetY;

    el.style.position = "absolute";

    el.addEventListener("mousedown", (e) => {
        e.preventDefault();
        offsetX = e.offsetX;
        offsetY = e.offsetY;

        function move(ev) {
            let x = ev.pageX - canvas.offsetLeft - offsetX;
            let y = ev.pageY - canvas.offsetTop - offsetY;
            x = Math.max(0, Math.min(x, canvas.clientWidth - el.offsetWidth));
            y = Math.max(0, Math.min(y, canvas.clientHeight - el.offsetHeight));

            el.style.left = x + "px";
            el.style.top = y + "px";
        }

        document.addEventListener("mousemove", move);

        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", move);
        }, { once: true });
    });
}
document.getElementById("download").addEventListener("click", () => {
    if (!selectedBg) {
        alert("Пожалуйста, выберите фон приглашения.");
        return;
    }
    html2canvas(canvas).then(canvasEl => {
        const link = document.createElement("a");
        link.download = "приглашение.png";
        link.href = canvasEl.toDataURL();
        link.click();
    });
});
