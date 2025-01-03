let yValues = [1, 1, 1, 1, 1];
let xValues = ["1", "2", "3", "4", "5"];
let barColors = ["#3369e8", "#d50f25", "#eeb211", "#009925", "#d50f25"];
let chart;
let selectedSegment = "";

const spinWheel = () => {
    let inputValues = textarea.value.split("\n");
    inputValues = inputValues.filter(item => (item !== ""));
    if (inputValues.length > 0){
        let value = Math.ceil((Math.random() + 100) * 15);
        rotation += value;
        const wheel = document.getElementById("wheel");
        wheel.style.transform = "rotate(" + rotation + "deg)";
        textarea.disabled = "true";

        button.removeEventListener("click", spinWheel);
        button.classList.remove("active");

        const spinText = document.getElementsByTagName("span")[0];
        spinText.style.display = "none";

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
            selectedText.innerHTML = "Selected value: " + selectedSegment;

            spinText.style.display = "inline";
            
            document.addEventListener("click", hideModalHandler);
            button.addEventListener("click", spinWheel);
            button.classList.add("active");
        }, 5000);
    }
}

const handleInput = () => {
    let inputValues = textarea.value.split("\n");
    inputValues = inputValues.filter(item => (item !== ""));

    if (inputValues.length > 0){
        button.classList.add("active");
    } else {
        button.classList.remove("active");
        const spinText = document.getElementsByTagName("span")[0];
        spinText.style.display = "none";
    }
    refreshChart(inputValues);
}

const handleRemove = () => {
    let inputValues = textarea.value.split("\n");
    inputValues = inputValues.filter(item => (item !== ""));

    let index = inputValues.indexOf(selectedSegment);
    inputValues.splice(index, 1);

    textarea.value = inputValues.join("\n");
    refreshChart(inputValues);  
}

const refreshChart = (inputValues) => {
    xValues = inputValues;

    xValues.forEach((value, index) => {
        if (value.length > 15){
            xValues[index] = value.slice(0, 12) + "...";
        }
    })
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

    let fontSize = 20; 
    if (xValues.length > 40){
        fontSize = 5;
    } else if (xValues.length > 30){
        fontSize = 10;
    } else if (xValues.length > 20){
        fontSize = 15;
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
                        size: fontSize
                    }, 
                    rotation: function(context) { 
                        let index = context.dataIndex;
                        let chart = context.chart;
                        let data = chart.data.datasets[0];
                        let meta = chart.getDatasetMeta(0);
                        let total = data.data.reduce((acc, val) => acc + val, 0);
                        let currentAngle = (meta.data[index]._model.startAngle + meta.data[index]._model.endAngle) / 2;
                        let percentage = data.data[index] / total;
                        return (currentAngle + percentage) * (180 / Math.PI);          
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
    const keepButton = document.getElementsByTagName("input")[1];

    if (!modal.contains(e.target) || e.target === closeButton || e.target === removeButton || e.target === keepButton) { 
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
