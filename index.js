const spinWheel = () => {
    let value = Math.ceil(Math.random() * 3600);
    rotation += value;
    wheel.style.transform = "rotate(" + rotation + "deg)";
}

const wheel = document.getElementById("wheel");
const button = document.getElementById("spin-button");
let rotation = 0; 
button.addEventListener("click", spinWheel);
