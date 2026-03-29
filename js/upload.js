let selectedFile = null;
let previewData = null;

function handleFileSelect(event) {
    const file = event.target.files?.[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            showError('يرجى اختيار صورة صحيحة');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showError('حجم الصورة كبير جداً (الحد الأقصى 5MB)');
            return;
        }

        selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            previewData = e.target?.result;
            showPreview();
        };
        reader.readAsDataURL(file);
    }
}

function showPreview() {
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('previewSection').classList.remove('hidden');
    document.getElementById('previewImage').src = previewData;
    clearError();
}

function resetUpload() {
    selectedFile = null;
    previewData = null;
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('previewSection').classList.add('hidden');
    document.getElementById('fileInput').value = '';
    clearError();
}

function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(stream => {
            const video = document.getElementById('cameraVideo');
            video.srcObject = stream;
            document.getElementById('uploadSection').classList.add('hidden');
            document.getElementById('cameraSection').classList.remove('hidden');
            clearError();
        })
        .catch(err => {
            showError('لا يمكن الوصول إلى الكاميرا');
        });
}

function stopCamera() {
    const video = document.getElementById('cameraVideo');
    if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
    }
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('cameraSection').classList.add('hidden');
}

function capturePhoto() {
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('cameraCanvas');
    const context = canvas.getContext('2d');

    if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (blob) {
                selectedFile = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
                previewData = canvas.toDataURL();
                stopCamera();
                showPreview();
            }
        }, 'image/jpeg');
    }
}

function submitImage() {
    if (!selectedFile || !previewData) {
        showError('يرجى اختيار صورة أولاً');
        return;
    }

    // Simulate processing
    const actor = getRandomActor();
    const similarity = calculateSimilarity();

    const result = {
        comparisonId: Date.now(),
        actorId: actor.id,
        actorName: actor.name,
        actorArabicName: actor.arabicName,
        actorImage: actor.image,
        similarityScore: similarity,
        userImage: previewData
    };

    // Save to history
    saveComparison(result);

    // Save to session and navigate
    sessionStorage.setItem('lastComparisonResult', JSON.stringify(result));
    navigateTo('results');
}

function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
}

function clearError() {
    const errorEl = document.getElementById('errorMessage');
    errorEl.classList.add('hidden');
}

// Setup drag and drop
document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(168, 85, 247, 0.6)';
            uploadArea.style.background = 'rgba(168, 85, 247, 0.15)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'rgba(168, 85, 247, 0.4)';
            uploadArea.style.background = 'rgba(168, 85, 247, 0.05)';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'rgba(168, 85, 247, 0.4)';
            uploadArea.style.background = 'rgba(168, 85, 247, 0.05)';

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const event = { target: { files } };
                handleFileSelect(event);
            }
        });
    }
});
