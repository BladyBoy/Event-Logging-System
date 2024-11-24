let currentPage = 1;
let totalPages = 1;

function formatTimestamp(timestamp) {
const date = new Date(timestamp);
const formattedDate = date.toISOString().split('T')[0]; 
const formattedTime = date.toISOString().split('T')[1].split('.')[0]; 
return `Date: ${formattedDate} and Time: ${formattedTime}`;
}

async function fetchEvents(page = 1) {
try {
    const timestampStart = document.getElementById('timestampStart').value;
    const timestampEnd = document.getElementById('timestampEnd').value;
    const eventType = document.getElementById('filterEventType').value;
    const sourceAppId = document.getElementById('filterSourceApp').value;

    const queryParams = new URLSearchParams({
    page,
    timestampStart,
    timestampEnd,
    eventType,
    sourceAppId,
    limit: 5,
    }).toString();

    const response = await fetch(`/api/events?${queryParams}`);
    const data = await response.json();

    if (response.ok) {
    const events = data.events;
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = events
        .map(event => `
        <div class="event-item">
            <h3>${event.eventType}</h3>
            <p><strong>Source App:</strong> ${event.sourceAppId}</p>
            <p><strong>Data:</strong> ${JSON.stringify(event.dataPayload)}</p>
            <p><strong>Hash:</strong> ${event.hash}</p>
            <p><strong>Timestamp:</strong> ${formatTimestamp(event.timestamp)}</p>
        </div>
        `)
        .join('');

    currentPage = data.currentPage;
    totalPages = data.totalPages;
    document.getElementById("current-page").textContent = currentPage;
    document.getElementById("total-pages").textContent = totalPages;

    document.getElementById("prev-page").disabled = currentPage === 1;
    document.getElementById("next-page").disabled = currentPage === totalPages;
    } else {
    alert(data.error || "Error fetching events");
    }
} catch (error) {
    console.error(error);
    alert("Failed to fetch events");
}
}

document.getElementById('event-form').addEventListener('submit', async (event) => {
event.preventDefault();
const eventData = {
    eventType: document.getElementById('eventType').value,
    sourceAppId: document.getElementById('sourceApp').value,
    dataPayload: document.getElementById('dataPayload').value,
};

const response = await fetch('/api/events/log-event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
});

const data = await response.json();
if (response.ok) {
    alert('Event logged successfully! \nPlease click OK to redirecting to the Dashboard..');
    window.location.href = '/dashboard.html';
} else {
    alert(data.error || "Error logging event");
}
});

document.getElementById('apply-filters').addEventListener('click', () => {
fetchEvents(1); 
});

document.getElementById("prev-page").addEventListener("click", () => {
if (currentPage > 1) {
    fetchEvents(currentPage - 1);
}
});

document.getElementById("next-page").addEventListener("click", () => {
if (currentPage < totalPages) {
    fetchEvents(currentPage + 1);
}
});

fetchEvents(currentPage); 

document.getElementById('show-sections').addEventListener('click', () => {
document.getElementById('filters-section').classList.remove('hidden');
document.getElementById('event-collections-section').classList.remove('hidden');
document.querySelector('.pagination').classList.remove('hidden');
});