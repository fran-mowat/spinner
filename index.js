let yValues = [1, 1, 1, 1, 1];
let xValues = ["1", "2", "3", "4", "5"];
let barColors = ["#3369e8", "#d50f25", "#eeb211", "#009925", "#d50f25"];
let chart;

const spinWheel = () => {
    let value = Math.ceil(Math.random() * 3600);
    rotation += value;
    const wheel = document.getElementById("wheel");
    wheel.style.transform = "rotate(" + rotation + "deg)";
    input.disabled = "true";
    setTimeout(() => {
        input.removeAttribute("disabled");

        let currentAngle = ((rotation - 90) % 360);
        let segmentAngle = 360 / xValues.length;
        let currentSegment = Math.floor(currentAngle / segmentAngle);
        let correctIndex = xValues.length - currentSegment;
        let segmentLabel = xValues[correctIndex - 1];

        console.log("Selected segment: " + segmentLabel);  
        const modal = document.getElementById("modal");
        modal.style.display = "block";   
        document.addEventListener("click", hideRulesHandler);
    }, 5000);
}

const handleInput = (e) => {
    let inputValues = e.target.value.split("\n");
    inputValues = inputValues.filter(item => item !== "");

    xValues = inputValues;
    yValues = Array(inputValues.length).fill(1);

    barColors = [];

    for (let i = 0; i < Math.floor(inputValues.length / 4); i++){
        barColors.push("#3369e8", "#d50f25", "#eeb211", "#009925");
    }

    let remainder = inputValues.length % 4; 
    switch (remainder){
        case 1: 
            barColors.push("#d50f25");
            break;
        case 2: 
            barColors.push("#3369e8", "#d50f25");
            break;
        case 3: 
            barColors.push("#3369e8", "#d50f25", "#eeb211");
            break;
    }

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

const hideRulesHandler = (e) => {
    const modal = document.getElementById("selected-segment"); 
    const closeButton = document.getElementById("close");
    if (!modal.contains(e.target) || e.target === closeButton) { 
        hideRules(); 
    }
}

const hideRules = () => {
    const modal = document.getElementById("modal");
    modal.style.display = "none";

    document.removeEventListener("click", hideRules);
}

generateChart();
