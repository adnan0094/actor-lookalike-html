function displayHistory() {
    const history = getComparisonHistory();
    const historyContent = document.getElementById('historyContent');

    if (history.length === 0) {
        historyContent.innerHTML = `
            <div class="empty-state">
                <p id="noHistoryText">لا توجد مقارنات سابقة حتى الآن</p>
                <button class="btn btn-primary" onclick="navigateTo('upload')" id="startFirstText">ابدأ المقارنة الأولى</button>
            </div>
        `;
        return;
    }

    historyContent.innerHTML = history.map((item, index) => `
        <div class="history-item" onclick="viewComparison(${index})">
            <img src="${item.userImage}" alt="صورتك">
            <div class="history-info">
                <h3>${item.actorArabicName}</h3>
                <p>${item.actorName}</p>
                <p style="font-size: 0.8rem; color: #9ca3af;">${new Date(item.timestamp).toLocaleDateString('ar-SA')}</p>
            </div>
            <div class="history-score">${Math.round(item.similarityScore)}%</div>
            <img src="${item.actorImage}" alt="${item.actorArabicName}">
            <button class="delete-btn" onclick="deleteComparison(event, ${index})">🗑️</button>
        </div>
    `).join('');
}

function viewComparison(index) {
    const history = getComparisonHistory();
    if (history[index]) {
        sessionStorage.setItem('lastComparisonResult', JSON.stringify(history[index]));
        navigateTo('results');
    }
}

function deleteComparison(event, index) {
    event.stopPropagation();
    const history = getComparisonHistory();
    history.splice(index, 1);
    localStorage.setItem('comparisonHistory', JSON.stringify(history));
    displayHistory();
}

document.addEventListener('DOMContentLoaded', displayHistory);
