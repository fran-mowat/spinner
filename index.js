let yValues = [1, 1, 1, 1, 1];
let xValues = ["1", "2", "3", "4", "5"];
let barColors = ["#3369e8", "#d50f25", "#eeb211", "#009925", "#d50f25"];
let chart;
let selectedSegment = "";

const spinWheel = () => {
    let value = Math.ceil(Math.random() * 3600);
    rotation += value;
    const wheel = document.getElementById("wheel");
    wheel.style.transform = "rotate(" + rotation + "deg)";
    textarea.disabled = "true";
    setTimeout(() => {
        textarea.removeAttribute("disabled");

        let currentAngle = ((rotation - 90) % 360);
        let segmentAngle = 360 / xValues.length;
        let currentSegment = Math.floor(currentAngle / segmentAngle);
        let correctIndex = xValues.length - currentSegment;
        selectedSegment = xValues[correctIndex - 1];

        const modal = document.getElementById("modal");
        modal.style.display = "block";

        const selectedText = document.getElementById("selected");
        selectedText.innerHTML = selectedSegment;
        
        document.addEventListener("click", hideModalHandler);
    }, 5000);
}

const handleInput = () => {
    let inputValues = textarea.value.split("\n");
    inputValues = inputValues.filter(item => (item !== ""));
    refreshChart(inputValues);
}

const handleRemove = () => {
    let inputValues = textarea.value.split("\n");
    inputValues = inputValues.filter(item => (item !== "") && (item !== selectedSegment));

    textarea.value = inputValues.join("\n");
    refreshChart(inputValues);
}

const refreshChart = (inputValues) => {
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

const hideModalHandler = (e) => {
    const modal = document.getElementById("selected-segment"); 
    const closeButton = document.getElementById("close");

    const removeButton = document.getElementsByTagName("input")[0];

    if (!modal.contains(e.target) || e.target === closeButton || e.target === removeButton) { 
        hideModal(); 
    }

    if (e.target === removeButton){
        handleRemove();
    }
}

const hideModal = () => {
    const modal = document.getElementById("modal");
    modal.style.display = "none";

    document.removeEventListener("click", hideModal);
}

const button = document.getElementById("spin-button");
let rotation = 0; 
button.addEventListener("click", spinWheel);

const textarea = document.getElementsByTagName("textarea")[0];
textarea.addEventListener("input", (e) => handleInput(e));

generateChart();
