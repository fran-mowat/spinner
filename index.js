let yValues = [1, 1, 1, 1, 1];
let xValues = ["1", "2", "3", "4", "5"];
const barColors = ["#d50f25", "#eeb211", "#009925", "#3369e8", "#eeb211"];
let chart;

const spinWheel = () => {
    let value = Math.ceil(Math.random() * 3600);
    rotation += value;
    const wheel = document.getElementById("wheel");
    wheel.style.transform = "rotate(" + rotation + "deg)";
    input.disabled = "true";
    setTimeout(() => {
        input.removeAttribute("disabled");
    }, 5000);
}

const handleInput = (e) => {
    let inputValues = e.target.value.split("\n");
    inputValues = inputValues.filter(item => item !== "");

    xValues = inputValues;
    yValues = Array(inputValues.length).fill(1);
    generateChart();
}

const generateChart = () => {
    if (chart){
        chart.destroy();
    }

    chart = new Chart("wheel", {
        type: "pie",
        data: {
            datasets: [{
            backgroundColor: barColors,
            data: yValues, 
            hoverBackgroundColor: barColors
            }],
            labels: xValues
        }, 
        options: {
            plugins: {
                datalabels: {
                    color: "#ffffff",
                    formatter: function(value, context) { 
                        return context.chart.data.labels[context.dataIndex]; 
                    }, 
                    font: {
                        size: 20
                    }
                }
            },
            legend: {
            display: false
            },
            tooltips: {
            enabled: false
            }, 
            animation: {
            duration: 0  
            },
            maintainAspectRatio: false,
        }, 
        plugins: [ChartDataLabels]
    });
}

const button = document.getElementById("spin-button");
let rotation = 0; 
button.addEventListener("click", spinWheel);

const input = document.getElementsByTagName("textarea")[0];
input.addEventListener("input", (e) => handleInput(e));

generateChart();
