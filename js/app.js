// Store data in local storage
let plants = JSON.parse(localStorage.getItem('plants')) || [];

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Tab Navigation
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.dataset.tab;
        
        // Hide all tabs and remove active class
        tabContents.forEach(content => content.classList.remove('active'));
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Show selected tab and add active class
        document.getElementById(`${tab}-tab`).classList.add('active');
        button.classList.add('active');
    });
});

// Close modals when clicking outside the content
window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('edit-plant-modal')) {
        document.getElementById('edit-plant-modal').style.display = 'none';
    }
    if (e.target === document.getElementById('edit-phase-modal')) {
        document.getElementById('edit-phase-modal').style.display = 'none';
    }
    if (e.target === document.getElementById('delete-modal')) {
        document.getElementById('delete-modal').style.display = 'none';
    }
});

// Helper function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// These functions are defined in other JS files but need to be accessed globally
// Make sure these are actually defined before referencing them
// Just defining empty placeholders to prevent errors if loaded out of order
if (typeof openEditPlantModal === 'undefined') {
    window.openEditPlantModal = function(plantId) {
        console.log('openEditPlantModal should be defined in plants-js.js');
    };
}

if (typeof openEditPhaseModal === 'undefined') {
    window.openEditPhaseModal = function(plantId, phaseId) {
        console.log('openEditPhaseModal should be defined in phases-js.js');
    };
}

if (typeof openDeleteModal === 'undefined') {
    window.openDeleteModal = function(type, id, parentId) {
        console.log('openDeleteModal should be defined in ui-js.js');
    };
}

// Initialize
// Make sure these functions are defined in respective files

// Function to export all plant data
function exportAllData() {
    const plantsData = localStorage.getItem('plants');

    if (!plantsData) {
        console.log('No plant data found to export.');
        // Optionally, show an alert to the user
        // alert('No plant data available to export.');
        return;
    }

    try {
        const jsonData = JSON.stringify(JSON.parse(plantsData), null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plant_data.json';
        document.body.appendChild(a); // Append anchor to body to ensure it's clickable
        a.click();
        
        document.body.removeChild(a); // Clean up by removing the anchor
        URL.revokeObjectURL(url); // Free up the object URL

        console.log('Plant data exported successfully.');

    } catch (error) {
        console.error('Error exporting plant data:', error);
        // Optionally, show an alert to the user
        // alert('An error occurred while exporting data.');
    }
}

// Event listener for the export button
document.addEventListener('DOMContentLoaded', () => {
    const exportButton = document.getElementById('export-all-btn');
    if (exportButton) {
        exportButton.addEventListener('click', exportAllData);
    } else {
        console.error('Export button not found.');
    }
});

if (typeof renderPlants === 'function') {
    renderPlants();
}

if (typeof updatePhasePlantSelect === 'function') {
    updatePhasePlantSelect();
}

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}
