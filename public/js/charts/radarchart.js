var ctx = document.getElementById("radarChart");

var data = {
    labels: ["Readability", "Reusability", "Documentation", "Coding", "Delivery", "Sleep"],
    datasets: [
        {
            label: "First Assessment",
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            borderColor: "rgba(255, 159, 64, 1)",
            pointBackgroundColor: "rgba(255, 159, 64, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255, 159, 64, 1)",
            data: [6, 5, 9, 8, 5, 5]
        },
        {
            label: "Second Assessment",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
            data: [2, 4, 4, 1, 9, 2]
        }
    ]
};

var options = {
    responsive: true,
    scale: {
        reverse: false,
        ticks: {
            beginAtZero: true
        }
    }
};

var radarChart = new Chart(ctx, {
    type: 'radar',
    data: data,
    options: options
});
