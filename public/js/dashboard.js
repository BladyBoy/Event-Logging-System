let currentPage = 1;
const limit = 5;
const apiUrl = '/api/events'; 

// Fetching events and rendering table
async function fetchAndRenderEvents(page = 1) {
  try {
    const response = await fetch(`${apiUrl}?page=${page}&limit=${limit}`);
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Failed to fetch events');

    const tableBody = document.getElementById('event-table-body');
    tableBody.innerHTML = data.events.map(event => {
      const inconsistency = checkInconsistency(event);
      return `
        <tr class="${inconsistency.startsWith('Yes') ? 'inconsistent' : ''}">
          <td>${event.eventType || '-'}</td>
          <td>${event.sourceAppId || '-'}</td>
          <td>${JSON.stringify(event.dataPayload)}</td>
          <td>${new Date(event.timestamp).toLocaleString()}</td>
          <td>${inconsistency}</td>
        </tr>
      `;
    }).join('');

    currentPage = data.currentPage;
    updatePaginationControls(data.totalPages);
    renderChart(data.events); 
  } catch (error) {
    console.error('Error fetching events:', error);
  }
}

// pagination buttons
function updatePaginationControls(totalPages) {
  document.getElementById('prev-page').disabled = currentPage === 1;
  document.getElementById('next-page').disabled = currentPage === totalPages;
  document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
}

// Inconsistencies in an event
function checkInconsistency(event) {
  const reasons = [];

  if (!event.eventType) reasons.push('Missing event type');
  if (!event.sourceAppId) reasons.push('Missing source application ID');
  if (!event.dataPayload || Object.keys(event.dataPayload).length === 0) {
    reasons.push('Empty data payload or invalid JSON object');
  }
  if (new Date(event.timestamp) > new Date()) {
    reasons.push('Timestamp is in the future');
  }

  return reasons.length > 0 ? `Yes: ${reasons.join(', ')}` : 'No';
}

// Rendering Chart using Chart.js
function renderChart(events) {
  const eventTypes = {};
  events.forEach(event => {
    eventTypes[event.eventType] = (eventTypes[event.eventType] || 0) + 1;
  });

  const ctx = document.getElementById('eventChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(eventTypes),
      datasets: [{
        label: 'Event Count',
        data: Object.values(eventTypes),
        backgroundColor: '#4A90E2',
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Event Type Distribution',
        },
      },
    },
  });
}

// Event listeners for pagination
document.getElementById('prev-page').addEventListener('click', () => {
  if (currentPage > 1) fetchAndRenderEvents(currentPage - 1);
});

document.getElementById('next-page').addEventListener('click', () => {
  fetchAndRenderEvents(currentPage + 1);
});

fetchAndRenderEvents(currentPage);