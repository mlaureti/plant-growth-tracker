// Add Plant Form Handler
const addPlantForm = document.getElementById('add-plant-form');

addPlantForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const plantName = document.getElementById('plant-name').value;
    const plantSpecies = document.getElementById('plant-species').value;
    const plantDescription = document.getElementById('plant-description').value;
    
    // Create new plant object
    const newPlant = {
        id: Date.now().toString(),
        name: plantName,
        species: plantSpecies,
        description: plantDescription,
        photo: plantPhotoData,
        startDate: new Date().toISOString(),
        phases: []
    };
    
    // Add to plants array and save to local storage
    plants.push(newPlant);
    localStorage.setItem('plants', JSON.stringify(plants));
    
    // Update UI
    renderPlants();
    updatePhasePlantSelect();
    
    // Reset form
    addPlantForm.reset();
    photo.style.display = 'none';
    plantPhotoData = null;
    
    // Switch to plants tab
    tabButtons[0].click();
    
    alert('Plant added successfully!');
});

// Edit Plant Functionality
const editPlantForm = document.getElementById('edit-plant-form');
const closeEditPlant = document.getElementById('close-edit-plant');

// Edit Plant Form Handler
editPlantForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const plantId = document.getElementById('edit-plant-id').value;
    const plantName = document.getElementById('edit-plant-name').value;
    const plantSpecies = document.getElementById('edit-plant-species').value;
    const plantDescription = document.getElementById('edit-plant-description').value;
    
    // Find plant and update
    const plantIndex = plants.findIndex(plant => plant.id === plantId);
    if (plantIndex !== -1) {
        plants[plantIndex].name = plantName;
        plants[plantIndex].species = plantSpecies;
        plants[plantIndex].description = plantDescription;
        
        // Update photo only if a new one was taken
        if (document.getElementById('edit-photo').style.display === 'block') {
            plants[plantIndex].photo = document.getElementById('edit-photo').src;
        }
        
        localStorage.setItem('plants', JSON.stringify(plants));
        
        // Update UI
        renderPlants();
        updatePhasePlantSelect();
        
        // Close modal
        document.getElementById('edit-plant-modal').style.display = 'none';
        
        alert('Plant updated successfully!');
    }
});

closeEditPlant.addEventListener('click', () => {
    document.getElementById('edit-plant-modal').style.display = 'none';
});

// Open Edit Plant Modal
function openEditPlantModal(plantId) {
    const plantIndex = plants.findIndex(plant => plant.id === plantId);
    if (plantIndex !== -1) {
        const plant = plants[plantIndex];
        
        // Fill form fields
        document.getElementById('edit-plant-id').value = plant.id;
        document.getElementById('edit-plant-name').value = plant.name;
        document.getElementById('edit-plant-species').value = plant.species || '';
        document.getElementById('edit-plant-description').value = plant.description || '';
        
        // Display existing photo if available
        if (plant.photo) {
            document.getElementById('edit-photo').src = plant.photo;
            document.getElementById('edit-photo').style.display = 'block';
        } else {
            document.getElementById('edit-photo').style.display = 'none';
        }
        
        // Show modal
        document.getElementById('edit-plant-modal').style.display = 'block';
    }
}