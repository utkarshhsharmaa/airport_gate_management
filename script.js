let schedules = [
    { flight: "AI-101", airline: "Air India", aircraft: "Medium", type: "Arrival", start: "09:00", end: "10:00", gate: "A1" },
    { flight: "6E-205", airline: "IndiGo", aircraft: "Medium", type: "Departure", start: "10:00", end: "11:00", gate: "A2" }
];

function assign() {
    let flight = document.getElementById("flight").value.trim().toUpperCase();
    let airline = document.getElementById("airline").value.trim();
    let aircraft = document.getElementById("aircraft").value;
    let flightType = document.getElementById("flightType").value;
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    let gate = document.getElementById("gate").value;
    let result = document.getElementById("result");

    if (flight == "" || airline == "" || start == "" || end == "") {
        showMsg("Error: Please fill all flight details!", "#fee2e2", "#991b1b");
        return;
    }

    if (end <= start) {
        showMsg("Error: End time must be after Start time!", "#fee2e2", "#991b1b");
        return;
    }

    for (let i = 0; i < schedules.length; i++) {
        if (schedules[i].flight == flight) {
            showMsg("Conflict: Flight " + flight + " is already scheduled!", "#fee2e2", "#991b1b");
            return;
        }
    }

    if ((gate == "A1" || gate == "A2") && aircraft == "Large") {
        showMsg("Aircraft Conflict: Large aircraft cannot fit in Gate " + gate + "!", "#fee2e2", "#991b1b");
        return;
    }
    if (gate == "B1" && aircraft == "Small") {
        showMsg("Aircraft Conflict: Small aircraft must use Gate A1 or A2!", "#fee2e2", "#991b1b");
        return;
    }
    if (gate == "B2" && aircraft != "Large") {
        showMsg("Aircraft Conflict: Gate B2 is for Large aircraft only!", "#fee2e2", "#991b1b");
        return;
    }

    for (let i = 0; i < schedules.length; i++) {
        if (schedules[i].gate == gate) {
            if (start < schedules[i].end && end > schedules[i].start) {
                showMsg("Schedule Conflict: Gate " + gate + " is occupied by " + schedules[i].flight + " (" + schedules[i].start + " - " + schedules[i].end + ")!", "#fee2e2", "#991b1b");
                return;
            }
        }
    }

    schedules.push({ flight: flight, airline: airline, aircraft: aircraft, type: flightType, start: start, end: end, gate: gate });

    let table = document.getElementById("flightTable");
    table.innerHTML +=
        "<tr>" +
        "<td><strong>" + flight + "</strong></td>" +
        "<td>" + airline + "</td>" +
        "<td>" + aircraft + "</td>" +
        "<td>" + flightType + "</td>" +
        "<td>" + start + " - " + end + "</td>" +
        "<td>" + gate + "</td>" +
        "<td><span class='badge-ok'>Assigned</span></td>" +
        "<td><button class='del-btn' onclick=\"removeFlight(this, '" + flight + "', '" + gate + "')\">Remove</button></td>" +
        "</tr>";

    updateDashboard();
    showMsg("Success: Flight " + flight + " (" + airline + ") assigned to Gate " + gate + "!", "#dcfce7", "#166534");
    document.getElementById("flight").value = "";
    document.getElementById("airline").value = "";
}

function showMsg(text, bg, color) {
    let result = document.getElementById("result");
    result.innerHTML = text;
    result.style.backgroundColor = bg;
    result.style.color = color;
}

function updateDashboard() {
    let allGates = ["A1", "A2", "B1", "B2"];
    let busyCount = 0;

    for (let g = 0; g < allGates.length; g++) {
        let gateName = allGates[g];
        let flightCount = 0;

        for (let i = 0; i < schedules.length; i++) {
            if (schedules[i].gate == gateName) {
                flightCount++;
            }
        }

        let cell = document.getElementById("status-" + gateName);
        if (flightCount > 0) {
            cell.innerHTML = "Occupied (" + flightCount + ")";
            cell.className = "occupied";
            busyCount++;
        } else {
            cell.innerHTML = "Available";
            cell.className = "available";
        }
    }

    document.getElementById("free-gates").innerHTML = 4 - busyCount;
    document.getElementById("busy-gates").innerHTML = busyCount;
}

function removeFlight(btn, flightNo, gate) {
    let row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);

    for (let i = 0; i < schedules.length; i++) {
        if (schedules[i].flight == flightNo) {
            schedules.splice(i, 1);
            break;
        }
    }

    updateDashboard();
    showMsg("Flight " + flightNo + " removed. Gate " + gate + " updated.", "#e0f2fe", "#1e40af");
}
