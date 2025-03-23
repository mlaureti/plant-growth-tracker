// Delete Functionality
const deleteModal = document.getElementById('delete-modal');
const deleteMessage = document.getElementById('delete-message');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const closeDeleteModal = document.getElementById('close-delete-modal');

let deleteItemType = '';
let deleteItemId = '';
let deleteParentId = '';

cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.style.display = 'none';
});

closeDeleteModal.addEventListener('click', () => {
    deleteModal.style.display = 'none';
});

confirmDeleteBtn.addEventListener('click', () => {
    if (deleteItemType === 'plant') {
        // Delete plant
        plants = plants.filter(plant => plant.id !== deleteItemId);
        localStorage.setItem('plants', JSON.stringify(plants));
        
        // Update UI
        renderPlants();
        updatePhasePlantSelect();
        
        alert('Plant deleted successfully!');
    } else if (deleteItemType === 'phase') {
        // Delete phase
        const plantIndex = plants.findIndex(plant => plant.id === deleteParentId);
        if (plantIndex !== -1) {
            plants[plantIndex].phases = plants[plantIndex].phases.filter(phase => phase.id !== deleteItemId);
            localStorage.setItem('plants', JSON.stringify(plants));
            
            // Update UI
            renderPlants();
            
            alert('Growth phase deleted successfully!');
        }
    }
    
    // Close modal
    deleteModal.style.display = 'none';
});

// Open Delete Confirmation Modal
function openDeleteModal(type, id, parentId = null) {
    deleteItemType = type;
    deleteItemId = id;
    deleteParentId = parentId;
    
    if (type === 'plant') {
        deleteMessage.textContent = 'Are you sure you want to delete this plant? This will also delete all associated growth phases.';
    } else if (type === 'phase') {
        deleteMessage.textContent = 'Are you sure you want to delete this growth phase?';
    }
    
    deleteModal.style.display = 'block';
}

// Render Plants List
// Render Plants List - Updated to fix UI overlap
function renderPlants() {
    const plantsList = document.getElementById('plants-list');
    plantsList.innerHTML = '';
    
    if (plants.length === 0) {
        plantsList.innerHTML = '<p>No plants added yet. Add your first plant to get started!</p>';
        return;
    }
    
    plants.forEach(plant => {
        const plantItem = document.createElement('div');
        plantItem.className = 'plant-item';
        
        const currentPhase = plant.phases.length > 0 ? 
            plant.phases[plant.phases.length - 1].name : 'Initial';
        
        // Modified structure to prevent overlap
        plantItem.innerHTML = `
            <div class="plant-header">
                <h3 class="plant-name">${plant.name}</h3>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span class="phase-badge">Phase: ${currentPhase}</span>
                <div class="edit-buttons">
                    <button class="btn btn-small" onclick="openEditPlantModal('${plant.id}')">Edit</button>
                    <button class="btn btn-small btn-warning" onclick="openDeleteModal('plant', '${plant.id}')">Delete</button>
                </div>
            </div>
            
            <p>${plant.species ? plant.species : ''}</p>
            <p>Started: ${formatDate(plant.startDate)}</p>
            <p>${plant.description ? plant.description : ''}</p>
        `;
        
        if (plant.photo) {
            const initialPhoto = document.createElement('div');
            initialPhoto.className = 'phase-entry';
            initialPhoto.innerHTML = `
                <img src="${plant.photo}" class="phase-image" alt="Initial photo">
                <div class="phase-details">
                    <h4>Initial State</h4>
                    <p class="phase-date">${formatDate(plant.startDate)}</p>
                </div>
            `;
            plantItem.appendChild(initialPhoto);
        }
        
        // Display phases
        if (plant.phases.length > 0) {
            const phasesTitle = document.createElement('h4');
            phasesTitle.textContent = 'Growth Phases';
            phasesTitle.style.marginTop = '1rem';
            plantItem.appendChild(phasesTitle);
            
            plant.phases.forEach(phase => {
                const phaseEntry = document.createElement('div');
                phaseEntry.className = 'phase-entry';
                
                phaseEntry.innerHTML = `
                    ${phase.photo ? `<img src="${phase.photo}" class="phase-image" alt="${phase.name}">` : ''}
                    <div class="phase-details">
                        <h4>${phase.name}</h4>
                        <p class="phase-date">${formatDate(phase.date)}</p>
                        <p>${phase.notes}</p>
                    </div>
                    <div class="phase-buttons">
                        <button class="btn btn-small" onclick="openEditPhaseModal('${plant.id}', '${phase.id}')">Edit</button>
                        <button class="btn btn-small btn-warning" onclick="openDeleteModal('phase', '${phase.id}', '${plant.id}')">Delete</button>
                    </div>
                `;
                
                plantItem.appendChild(phaseEntry);
            });
        }
        
        plantsList.appendChild(plantItem);
    });
}
