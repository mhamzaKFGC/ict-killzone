const zones = [
    { name: "Asia Session", start: "20:00", end: "23:00", description: "Start of the trading day, useful for early setups." },
    { name: "London Open", start: "02:00", end: "05:00", description: "Highest liquidity in European markets." },
    { name: "New York Open", start: "07:00", end: "10:00", description: "Highest volatility, overlaps with London." },
    { name: "London Close", start: "10:00", end: "12:00", description: "Closing of EU markets, volume fades." },
    { name: "Overlap Periods", start: "07:00", end: "08:00", description: "London + NY open = high volatility." },
];

let showLocal = false;

function toggleTimeView() {
    showLocal = !showLocal;
    document.querySelector('.toggle-view button').textContent = showLocal ? 'Switch to EST Time' : 'Switch to Local Time';
    updateTime();
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function updateTime() {
    const now = new Date();
    const estNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    document.getElementById('est-time').textContent = formatTime(estNow);
    document.getElementById('local-time').textContent = formatTime(now);

    const container = document.getElementById('zones');
    container.innerHTML = '';

    zones.forEach(zone => {
        const start = new Date(estNow);
        const [startHour, startMinute] = zone.start.split(":").map(Number);
        start.setHours(startHour, startMinute, 0);

        const end = new Date(estNow);
        const [endHour, endMinute] = zone.end.split(":").map(Number);
        end.setHours(endHour, endMinute, 0);

        let status, progress = 0;

        if (estNow >= start && estNow <= end) {
            status = 'active';
            progress = ((estNow - start) / (end - start)) * 100;
        } else if (estNow < start) {
            status = 'upcoming';
        } else {
            status = 'ended';
        }

        const div = document.createElement('div');
        div.className = `zone ${status}`;
        div.innerHTML = `
          <strong>${zone.name}</strong> (${zone.start} - ${zone.end})<br>
          <em>${zone.description}</em><br>
          Status: ${status.charAt(0).toUpperCase() + status.slice(1)}<br>
          ${status === 'active' ? `Time Remaining: ${(Math.round((end - estNow) / 60000))} min` :
                status === 'upcoming' ? `Starts in: ${(Math.round((start - estNow) / 60000))} min` :
                    `Ended`}<br>
          <div class="progress">
            <div class="progress-bar" style="width: ${progress}%;"></div>
          </div>
        `;
        container.appendChild(div);
    });
}

updateTime();
setInterval(updateTime, 1000);
