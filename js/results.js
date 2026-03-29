function displayResults() {
    const result = JSON.parse(sessionStorage.getItem('lastComparisonResult') || '{}');

    if (!result.comparisonId) {
        document.body.innerHTML = '<div style="text-align:center; padding:2rem;"><p>لم نتمكن من العثور على النتائج</p></div>';
        return;
    }

    // Update elements
    document.getElementById('actorNameDisplay').textContent = result.actorArabicName;
    document.getElementById('scoreDisplay').textContent = Math.round(result.similarityScore);
    document.getElementById('actorDisplayName').textContent = result.actorArabicName;
    document.getElementById('scoreNumber').textContent = Math.round(result.similarityScore) + '%';
    document.getElementById('actorInfoName').textContent = result.actorArabicName;
    document.getElementById('userImage').src = result.userImage;
    document.getElementById('actorImage').src = result.actorImage;
}

function shareResult() {
    const result = JSON.parse(sessionStorage.getItem('lastComparisonResult') || '{}');
    const text = `أنا أشبه الممثل ${result.actorArabicName} بنسبة ${Math.round(result.similarityScore)}%! 🎬`;

    if (navigator.share) {
        navigator.share({
            title: 'ممثل شبيه',
            text: text,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            alert('تم نسخ النص إلى الحافظة');
        });
    }
}

document.addEventListener('DOMContentLoaded', displayResults);
