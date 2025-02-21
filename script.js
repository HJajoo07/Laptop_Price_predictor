// Load dropdown options from API
document.addEventListener("DOMContentLoaded", async function() {
    const response = await fetch("http://127.0.0.1:5000/dropdown-options");
    const data = await response.json();

    populateDropdown("brand", data.company);
    populateDropdown("type", data.type);
    populateDropdown("cpu", data.cpu);
    populateDropdown("gpu", data.gpu);
    populateDropdown("os", data.os);

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
    let resolution = document.getElementById("resolution").value.split("x");
    let ppi = Math.sqrt(Math.pow(parseInt(resolution[0]), 2) + Math.pow(parseInt(resolution[1]), 2)) / parseFloat(document.getElementById("screen_size").value);

    let query = {
        company: document.getElementById("brand").value,  // ✅ Corrected key
        laptop_type: document.getElementById("type").value,
        screen_size: parseFloat(document.getElementById("screen_size").value),  // ✅ Add screen size
        ram: parseInt(document.getElementById("ram").value),
        weight: parseFloat(document.getElementById("weight").value),
        touchscreen: parseInt(document.getElementById("touchscreen").value),
        ips: parseInt(document.getElementById("ips").value),
        resolution: document.getElementById("resolution").value, // ✅ Ensure it's included
        cpu: document.getElementById("cpu").value,
        hdd: parseInt(document.getElementById("hdd").value),
        ssd: parseInt(document.getElementById("ssd").value),
        gpu: document.getElementById("gpu").value,
        os: document.getElementById("os").value
    };

    const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query)
    });

    const result = await response.json();
    document.getElementById("result").innerText = "Predicted Price: ₹" + result.predicted_price;;
}
