// Camera functionality for Add Plant
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');
const startCameraBtn = document.getElementById('start-camera');
const capturePhotoBtn = document.getElementById('capture-photo');
const retakePhotoBtn = document.getElementById('retake-photo');
let plantPhotoData = null;

startCameraBtn.addEventListener('click', async () => {
    try {
        // Specify we want the environment-facing (back) camera
        const constraints = {
            video: {
                facingMode: { exact: "environment" }
            }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        video.style.display = 'block';
        photo.style.display = 'none';
        startCameraBtn.disabled = true;
        capturePhotoBtn.disabled = false;
        retakePhotoBtn.disabled = true;
    } catch (err) {
        console.error('Error accessing back camera:', err);
        // Fallback to any available camera if back camera isn't available
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.style.display = 'block';
            photo.style.display = 'none';
            startCameraBtn.disabled = true;
            capturePhotoBtn.disabled = false;
            retakePhotoBtn.disabled = true;
        } catch (fallbackErr) {
            console.error('Error accessing any camera:', fallbackErr);
            alert('Could not access the camera. Please check permissions.');
        }
    }
});

// Rest of the code for this camera section remains the same
capturePhotoBtn.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    plantPhotoData = canvas.toDataURL('image/jpeg');
    photo.src = plantPhotoData;
    
    video.style.display = 'none';
    photo.style.display = 'block';
    
    capturePhotoBtn.disabled = true;
    retakePhotoBtn.disabled = false;
    
    // Stop camera stream
    const tracks = video.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
});

retakePhotoBtn.addEventListener('click', async () => {
    startCameraBtn.click();
});

// Camera functionality for Add Phase - apply the same changes here
const phaseVideo = document.getElementById('phase-video');
const phaseCanvas = document.getElementById('phase-canvas');
const phasePhoto = document.getElementById('phase-photo');
const phaseStartCameraBtn = document.getElementById('phase-start-camera');
const phaseCapturePhotoBtn = document.getElementById('phase-capture-photo');
const phaseRetakePhotoBtn = document.getElementById('phase-retake-photo');
let phasePhotoData = null;

phaseStartCameraBtn.addEventListener('click', async () => {
    try {
        // Specify we want the environment-facing (back) camera
        const constraints = {
            video: {
                facingMode: { exact: "environment" }
            }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        phaseVideo.srcObject = stream;
        phaseVideo.style.display = 'block';
        phasePhoto.style.display = 'none';
        phaseStartCameraBtn.disabled = true;
        phaseCapturePhotoBtn.disabled = false;
        phaseRetakePhotoBtn.disabled = true;
    } catch (err) {
        console.error('Error accessing back camera:', err);
        // Fallback to any available camera if back camera isn't available
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            phaseVideo.srcObject = stream;
            phaseVideo.style.display = 'block';
            phasePhoto.style.display = 'none';
            phaseStartCameraBtn.disabled = true;
            phaseCapturePhotoBtn.disabled = false;
            phaseRetakePhotoBtn.disabled = true;
        } catch (fallbackErr) {
            console.error('Error accessing any camera:', fallbackErr);
            alert('Could not access the camera. Please check permissions.');
        }
    }
});

// Rest of the phase camera code remains the same
phaseCapturePhotoBtn.addEventListener('click', () => {
    const context = phaseCanvas.getContext('2d');
    phaseCanvas.width = phaseVideo.videoWidth;
    phaseCanvas.height = phaseVideo.videoHeight;
    context.drawImage(phaseVideo, 0, 0, phaseCanvas.width, phaseCanvas.height);
    
    phasePhotoData = phaseCanvas.toDataURL('image/jpeg');
    phasePhoto.src = phasePhotoData;
    
    phaseVideo.style.display = 'none';
    phasePhoto.style.display = 'block';
    
    phaseCapturePhotoBtn.disabled = true;
    phaseRetakePhotoBtn.disabled = false;
    
    // Stop camera stream
    const tracks = phaseVideo.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    phaseVideo.srcObject = null;
});

phaseRetakePhotoBtn.addEventListener('click', async () => {
    phaseStartCameraBtn.click();
});

// Camera functionality for Edit Plant - apply the same changes here too
const editVideo = document.getElementById('edit-video');
const editCanvas = document.getElementById('edit-canvas');
const editPhoto = document.getElementById('edit-photo');
const editStartCameraBtn = document.getElementById('edit-start-camera');
const editCapturePhotoBtn = document.getElementById('edit-capture-photo');
const editRetakePhotoBtn = document.getElementById('edit-retake-photo');

editStartCameraBtn.addEventListener('click', async () => {
    try {
        // Specify we want the environment-facing (back) camera
        const constraints = {
            video: {
                facingMode: { exact: "environment" }
            }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        editVideo.srcObject = stream;
        editVideo.style.display = 'block';
        editPhoto.style.display = 'none';
        editStartCameraBtn.disabled = true;
        editCapturePhotoBtn.disabled = false;
        editRetakePhotoBtn.disabled = true;
    } catch (err) {
        console.error('Error accessing back camera:', err);
        // Fallback to any available camera if back camera isn't available
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            editVideo.srcObject = stream;
            editVideo.style.display = 'block';
            editPhoto.style.display = 'none';
            editStartCameraBtn.disabled = true;
            editCapturePhotoBtn.disabled = false;
            editRetakePhotoBtn.disabled = true;
        } catch (fallbackErr) {
            console.error('Error accessing any camera:', fallbackErr);
            alert('Could not access the camera. Please check permissions.');
        }
    }
});

// Rest of edit camera code remains the same
editCapturePhotoBtn.addEventListener('click', () => {
    const context = editCanvas.getContext('2d');
    editCanvas.width = editVideo.videoWidth;
    editCanvas.height = editVideo.videoHeight;
    context.drawImage(editVideo, 0, 0, editCanvas.width, editCanvas.height);
    
    const editPhotoData = editCanvas.toDataURL('image/jpeg');
    editPhoto.src = editPhotoData;
    
    editVideo.style.display = 'none';
    editPhoto.style.display = 'block';
    
    editCapturePhotoBtn.disabled = true;
    editRetakePhotoBtn.disabled = false;
    
    // Stop camera stream
    const tracks = editVideo.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    editVideo.srcObject = null;
});

editRetakePhotoBtn.addEventListener('click', async () => {
    editStartCameraBtn.click();
});

// Camera functionality for Edit Phase - apply the same changes here too
const editPhaseVideo = document.getElementById('edit-phase-video');
const editPhaseCanvas = document.getElementById('edit-phase-canvas');
const editPhasePhoto = document.getElementById('edit-phase-photo');
const editPhaseStartCameraBtn = document.getElementById('edit-phase-start-camera');
const editPhaseCapturePhotoBtn = document.getElementById('edit-phase-capture-photo');
const editPhaseRetakePhotoBtn = document.getElementById('edit-phase-retake-photo');

editPhaseStartCameraBtn.addEventListener('click', async () => {
    try {
        // Specify we want the environment-facing (back) camera
        const constraints = {
            video: {
                facingMode: { exact: "environment" }
            }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        editPhaseVideo.srcObject = stream;
        editPhaseVideo.style.display = 'block';
        editPhasePhoto.style.display = 'none';
        editPhaseStartCameraBtn.disabled = true;
        editPhaseCapturePhotoBtn.disabled = false;
        editPhaseRetakePhotoBtn.disabled = true;
    } catch (err) {
        console.error('Error accessing back camera:', err);
        // Fallback to any available camera if back camera isn't available
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            editPhaseVideo.srcObject = stream;
            editPhaseVideo.style.display = 'block';
            editPhasePhoto.style.display = 'none';
            editPhaseStartCameraBtn.disabled = true;
            editPhaseCapturePhotoBtn.disabled = false;
            editPhaseRetakePhotoBtn.disabled = true;
        } catch (fallbackErr) {
            console.error('Error accessing any camera:', fallbackErr);
            alert('Could not access the camera. Please check permissions.');
        }
    }
});

// Rest of edit phase camera code remains the same
editPhaseCapturePhotoBtn.addEventListener('click', () => {
    const context = editPhaseCanvas.getContext('2d');
    editPhaseCanvas.width = editPhaseVideo.videoWidth;
    editPhaseCanvas.height = editPhaseVideo.videoHeight;
    context.drawImage(editPhaseVideo, 0, 0, editPhaseCanvas.width, editPhaseCanvas.height);
    
    const editPhasePhotoData = editPhaseCanvas.toDataURL('image/jpeg');
    editPhasePhoto.src = editPhasePhotoData;
    
    editPhaseVideo.style.display = 'none';
    editPhasePhoto.style.display = 'block';
    
    editPhaseCapturePhotoBtn.disabled = true;
    editPhaseRetakePhotoBtn.disabled = false;
    
    // Stop camera stream
    const tracks = editPhaseVideo.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    editPhaseVideo.srcObject = null;
});

editPhaseRetakePhotoBtn.addEventListener('click', async () => {
    editPhaseStartCameraBtn.click();
});
