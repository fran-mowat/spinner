const yValues = [1, 1, 1, 1, 1];
const barColors = ["#d50f25", "#eeb211", "#009925", "#3369e8", "#eeb211"];

const spinWheel = () => {
    let value = Math.ceil(Math.random() * 3600);
    rotation += value;
    wheel.style.transform = "rotate(" + rotation + "deg)";
}

new Chart("wheel", {
    type: "pie",
    data: {
        datasets: [{
        backgroundColor: barColors,
        data: yValues, 
        hoverBackgroundColor: barColors
        }]
    }, 
    options: {
        legend: {
        display: false
        },
        tooltips: {
        enabled: false
        }
    }  
});

const wheel = document.getElementById("wheel");
const button = document.getElementById("spin-button");
let rotation = 0; 
button.addEventListener("click", spinWheel);

