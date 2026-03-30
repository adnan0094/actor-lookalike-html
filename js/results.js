function displayResults() {
    const result = JSON.parse(sessionStorage.getItem('lastComparisonResult') || '{}');

    if (!result.comparisonId) {
        // Show a default result if no comparison found
        const defaultActor = getRandomActor();
        const defaultScore = calculateSimilarity();
        
        document.getElementById('actorNameDisplay').textContent = defaultActor.arabicName;
        document.getElementById('scoreDisplay').textContent = defaultScore;
        document.getElementById('actorDisplayName').textContent = defaultActor.arabicName;
        document.getElementById('scoreNumber').textContent = defaultScore + '%';
        document.getElementById('actorInfoName').textContent = defaultActor.arabicName;
        document.getElementById('actorImage').src = defaultActor.image;
        document.getElementById('actorImage').onerror = function() {
            this.src = 'https://via.placeholder.com/300x400?text=' + defaultActor.arabicName;
        };
        return;
    }

    // Update elements with comparison result
    document.getElementById('actorNameDisplay').textContent = result.actorArabicName;
    document.getElementById('scoreDisplay').textContent = Math.round(result.similarityScore);
    document.getElementById('actorDisplayName').textContent = result.actorArabicName;
    document.getElementById('scoreNumber').textContent = Math.round(result.similarityScore) + '%';
    document.getElementById('actorInfoName').textContent = result.actorArabicName;
    
    // Set user image
    if (result.userImage) {
        document.getElementById('userImage').src = result.userImage;
    }
    
    // Set actor image with error handling
    if (result.actorImage) {
        document.getElementById('actorImage').src = result.actorImage;
    } else {
        // Find actor from database and use their image
        const actor = actorsData.find(a => a.arabicName === result.actorArabicName);
        if (actor) {
            document.getElementById('actorImage').src = actor.image;
        }
    }
    
    // Handle image loading errors
    document.getElementById('actorImage').onerror = function() {
        const actor = actorsData.find(a => a.arabicName === result.actorArabicName);
        if (actor) {
            this.src = actor.image;
        }
    };
}

function shareResult() {
    const result = JSON.parse(sessionStorage.getItem('lastComparisonResult') || '{}');
    const actorName = result.actorArabicName || 'ممثل شبيه';
    const score = result.similarityScore ? Math.round(result.similarityScore) : 0;
    const text = `أنا أشبه الممثل ${actorName} بنسبة ${score}%! 🎬`;

    if (navigator.share) {
        navigator.share({
            title: 'ممثل شبيه',
            text: text,
            url: window.location.href
        }).catch(err => console.log('Share failed:', err));
    } else {
        // Fallback: copy to clipboard silently
        navigator.clipboard.writeText(text).catch(err => console.log('Copy failed:', err));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayResults();
});
