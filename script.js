// Starting flight record
let schedules = [
    { flight: "AI-101", aircraft: "Medium", type: "Arrival", start: "09:00", end: "10:00", gate: "A1" }
];

function assign() {
    let flight = document.getElementById("flight").value.trim().toUpperCase();
    let aircraft = document.getElementById("aircraft").value;
    let flightType = document.getElementById("flightType").value;
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    let gate = document.getElementById("gate").value;
    let result = document.getElementById("result");

    // 1. Check empty fields
    if (flight == "" || start == "" || end == "") {
        result.style.color = "red";
        result.innerHTML = "Error: Please fill all flight details!";
        return;
    }

    // 2. Check valid timing
    if (end <= start) {
        result.style.color = "red";
        result.innerHTML = "Error: End time must be after Start time!";
        return;
    }

    // 3. Check duplicate flight number
    for (let i = 0; i < schedules.length; i++) {
        if (schedules[i].flight == flight) {
            result.style.color = "red";
            result.innerHTML = "Conflict: Flight " + flight + " is already scheduled!";
            return;
        }
    }

    // 4. Check Aircraft vs Gate Size Compatibility
    if ((gate == "A1" || gate == "A2") && aircraft == "Large") {
        result.style.color = "red";
        result.innerHTML = "Size Error: Large aircraft cannot use Gate " + gate + "!";
        return;
    }
    if (gate == "B1" && aircraft == "Small") {
        result.style.color = "red";
        result.innerHTML = "Size Error: Small aircraft should use Gate A1 or A2!";
        return;
    }
    if (gate == "B2" && aircraft != "Large") {
        result.style.color = "red";
        result.innerHTML = "Size Error: Gate B2 is reserved for Large aircraft only!";
        return;
    }

    // 5. Check Overlapping Time Schedule on the same gate
    for (let i = 0; i < schedules.length; i++) {
        if (schedules[i].gate == gate) {
            if (start < schedules[i].end && end > schedules[i].start) {
                result.style.color = "red";
                result.innerHTML = "Schedule Conflict: Gate " + gate + " is busy from " + schedules[i].start + " to " + schedules[i].end + "!";
                return;
            }
        }
    }

    // 6. All checks passed -> Save and Update UI
    schedules.push({ flight: flight, aircraft: aircraft, type: flightType, start: start, end: end, gate: gate });

    let table = document.getElementById("flightTable");
    table.innerHTML +=
        "<tr>" +
        "<td>" + flight + "</td>" +
        "<td>" + aircraft + "</td>" +
        "<td>" + flightType + "</td>" +
        "<td>" + start + " - " + end + "</td>" +
        "<td>" + gate + "</td>" +
        "<td><button class='del-btn' onclick=\"removeFlight(this, '" + flight + "', '" + gate + "')\">Remove</button></td>" +
        "</tr>";

    updateGateStatus(gate);

    result.style.color = "green";
    result.innerHTML = "Success: Flight " + flight + " assigned to Gate " + gate + "!";
    document.getElementById("flight").value = "";
}

// Update Gate Status table automatically
function updateGateStatus(gate) {
    let count = 0;
    for (let i = 0; i < schedules.length; i++) {
        if (schedules[i].gate == gate) {
            count++;
        }
    }

    let statusCell = document.getElementById("status-" + gate);
    if (count > 0) {
        statusCell.innerHTML = "Occupied (" + count + " Flight)";
        statusCell.className = "occupied";
    } else {
        statusCell.innerHTML = "Available";
        statusCell.className = "available";
    }
}

// Remove flight and free up the gate
function removeFlight(btn, flightNo, gate) {
    let row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);

    for (let i = 0; i < schedules.length; i++) {
        if (schedules[i].flight == flightNo) {
            schedules.splice(i, 1);
            break;
        }
    }

    updateGateStatus(gate);
    document.getElementById("result").style.color = "blue";
    document.getElementById("result").innerHTML = "Flight " + flightNo + " removed from Gate " + gate + ".";
}
