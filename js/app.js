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
