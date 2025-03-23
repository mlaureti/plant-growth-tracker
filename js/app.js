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

// Initialize
renderPlants();
updatePhasePlantSelect();

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// Make functions globally accessible
window.openEditPlantModal = openEditPlantModal;
window.openEditPhaseModal = openEditPhaseModal;
window.openDeleteModal = openDeleteModal;
