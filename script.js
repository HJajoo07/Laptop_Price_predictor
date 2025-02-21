// Load dropdown options from API
document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch("https://laptop-price-predictor-yvwc.onrender.com/dropdown-options");
        if (!response.ok) throw new Error("Failed to fetch dropdown options");
        const data = await response.json();

        populateDropdown("brand", data.company);
        populateDropdown("type", data.type);
        populateDropdown("cpu", data.cpu);
        populateDropdown("gpu", data.gpu);
        populateDropdown("os", data.os);
    } catch (error) {
        console.error("Error loading dropdowns:", error);
        alert("Failed to load options. Please try again later.");
    }
});

// Function to populate dropdowns dynamically
function populateDropdown(id, options) {
    const select = document.getElementById(id);
    options.forEach(option => {
        let opt = document.createElement("option");
        opt.value = option;
        opt.innerText = option;
        select.appendChild(opt);
    });
}

// Function to send data to API and get the predicted price
async function predictPrice() {
    let resolutionInput = document.getElementById("resolution").value;
    if (!resolutionInput.includes("x")) {
        alert("Please enter a valid resolution (e.g., 1920x1080)");
        return;
    }

    let resolution = resolutionInput.split("x");
    let ppi = Math.sqrt(Math.pow(parseInt(resolution[0]), 2) + Math.pow(parseInt(resolution[1]), 2)) / parseFloat(document.getElementById("screen_size").value);

    let query = {
        company: document.getElementById("brand").value,
        laptop_type: document.getElementById("type").value,
        screen_size: parseFloat(document.getElementById("screen_size").value),
        ram: parseInt(document.getElementById("ram").value),
        weight: parseFloat(document.getElementById("weight").value),
        touchscreen: parseInt(document.getElementById("touchscreen").value),
        ips: parseInt(document.getElementById("ips").value),
        resolution: resolutionInput, // Use cleaned resolution input
        cpu: document.getElementById("cpu").value,
        hdd: parseInt(document.getElementById("hdd").value),
        ssd: parseInt(document.getElementById("ssd").value),
        gpu: document.getElementById("gpu").value,
        os: document.getElementById("os").value
    };

    try {
        const response = await fetch("https://laptop-price-predictor-yvwc.onrender.com/predict", { // ✅ Fixed API URL
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(query)
        });

        if (!response.ok) throw new Error("Prediction request failed");

        const result = await response.json();
        document.getElementById("result").innerText = "Predicted Price: ₹" + result.predicted_price;
    } catch (error) {
        console.error("Error predicting price:", error);
        alert("Failed to get prediction. Please try again later.");
    }
}
