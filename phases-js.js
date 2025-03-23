// Update Plant Select in Add Phase Form
function updatePhasePlantSelect() {
    const phasePlantSelect = document.getElementById('phase-plant');
    phasePlantSelect.innerHTML = '<option value="">-- Select a plant --</option>';
    
    plants.forEach(plant => {
        const option = document.createElement('option');
        option.value = plant.id;
        option.textContent = plant.name;
        phasePlantSelect.appendChild(option);
    });
}

// Add Phase Form Handler
const addPhaseForm = document.getElementById('add-phase-form');

addPhaseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const plantId = document.getElementById('phase-plant').value;
    const phaseName = document.getElementById('phase-name').value;
    const phaseNotes = document.getElementById('phase-notes').value;
    
    // Create new phase object
    const newPhase = {
        id: Date.now().toString(),
        name: phaseName,
        notes: phaseNotes,
        photo: phasePhotoData,
        date: new Date().toISOString()
    };
    
    // Find plant and add phase
    const plantIndex = plants.findIndex(plant => plant.id === plantId);
    if (plantIndex !== -1) {
        plants[plantIndex].phases.push(newPhase);
        localStorage.setItem('plants', JSON.stringify(plants));
        
        // Update UI
        renderPlants();
        
        // Reset form
        addPhaseForm.reset();
        document.getElementById('phase-photo').style.display = 'none';
        phasePhotoData = null;
        
        // Switch to plants tab
        tabButtons[0].click();
        
        alert('Growth phase added successfully!');
    }
});

// Edit Phase Functionality
const editPhaseForm = document.getElementById('edit-phase-form');
const closeEditPhase = document.getElementById('close-edit-phase');

// Edit Phase Form Handler
editPhaseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const plantId = document.getElementById('edit-phase-plant-id').value;
    const phaseId = document.getElementById('edit-phase-id').value;
    const phaseName = document.getElementById('edit-phase-name').value;
    const phaseNotes = document.getElementById('edit-phase-notes').value;
    
    // Find plant and phase to update
    const plantIndex = plants.findIndex(plant => plant.id === plantId);
    if (plantIndex !== -1) {
        const phaseIndex = plants[plantIndex].phases.findIndex(phase => phase.id === phaseId);
        if (phaseIndex !== -1) {
            plants[plantIndex].phases[phaseIndex].name = phaseName;
            plants[plantIndex].phases[phaseIndex].notes = phaseNotes;
            
            // Update photo only if a new one was taken
            if (document.getElementById('edit-phase-photo').style.display === 'block') {
                plants[plantIndex].phases[phaseIndex].photo = document.getElementById('edit-phase-photo').src;
            }
            
            localStorage.setItem('plants', JSON.stringify(plants));
            
            // Update UI
            renderPlants();
            
            // Close modal
            document.getElementById('edit-phase-modal').style.display = 'none';
            
            alert('Growth phase updated successfully!');
        }
    }
});

closeEditPhase.addEventListener('click', () => {
    document.getElementById('edit-phase-modal').style.display = 'none';
});

// Open Edit Phase Modal
function openEditPhaseModal(plantId, phaseId) {
    const plantIndex = plants.findIndex(plant => plant.id === plantId);
    if (plantIndex !== -1) {
        const phaseIndex = plants[plantIndex].phases.findIndex(phase => phase.id === phaseId);
        if (phaseIndex !== -1) {
            const phase = plants[plantIndex].phases[phaseIndex];
            
            // Fill form fields
            document.getElementById('edit-phase-plant-id').value = plantId;
            document.getElementById('edit-phase-id').value = phase.id;
            document.getElementById('edit-phase-name').value = phase.name;
            document.getElementById('edit-phase-notes').value = phase.notes || '';
            
            // Display existing photo if available
            if (phase.photo) {
                document.getElementById('edit-phase-photo').src = phase.photo;
                document.getElementById('edit-phase-photo').style.display = 'block';
            } else {
                document.getElementById('edit-phase-photo').style.display = 'none';
            }
            
            // Show modal
            document.getElementById('edit-phase-modal').style.display = 'block';
        }
    }
}