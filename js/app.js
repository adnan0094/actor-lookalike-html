// Language management
let currentLanguage = localStorage.getItem('language') || 'ar';

function initializeApp() {
    updateLanguage(currentLanguage);
    setupLanguageToggle();
}

function setupLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
            localStorage.setItem('language', currentLanguage);
            updateLanguage(currentLanguage);
            location.reload();
        });
    }
}

function updateLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Update all text elements
    const elements = document.querySelectorAll('[id]');
    elements.forEach(el => {
        const key = el.id;
        if (translations[lang]?.[key]) {
            el.textContent = translations[lang][key];
        }
    });
}

function navigateTo(page) {
    const pages = {
        'index': 'index.html',
        'upload': 'upload.html',
        'results': 'results.html',
        'history': 'history.html'
    };

    if (pages[page]) {
        window.location.href = pages[page];
    }
}

// Sample actors data
const actorsData = [
    {
        id: 1,
        name: "Jamal Suliman",
        arabicName: "جمال سليمان",
        image: "https://via.placeholder.com/300x400?text=Jamal+Suliman"
    },
    {
        id: 2,
        name: "Sulafa Memet",
        arabicName: "سلافة معمار",
        image: "https://via.placeholder.com/300x400?text=Sulafa+Memet"
    },
    {
        id: 3,
        name: "Assi Al-Helani",
        arabicName: "عاصي الحلاني",
        image: "https://via.placeholder.com/300x400?text=Assi+Al-Helani"
    },
    {
        id: 4,
        name: "Reem Abdallah",
        arabicName: "ريم عبدالله",
        image: "https://via.placeholder.com/300x400?text=Reem+Abdallah"
    },
    {
        id: 5,
        name: "Bassem Yakhour",
        arabicName: "باسم ياخور",
        image: "https://via.placeholder.com/300x400?text=Bassem+Yakhour"
    },
    {
        id: 6,
        name: "Dina Hayek",
        arabicName: "دينا هايك",
        image: "https://via.placeholder.com/300x400?text=Dina+Hayek"
    },
    {
        id: 7,
        name: "Fadi Alaeddine",
        arabicName: "فادي العلاء الدين",
        image: "https://via.placeholder.com/300x400?text=Fadi+Alaeddine"
    },
    {
        id: 8,
        name: "Kinda Alloush",
        arabicName: "كندة علوش",
        image: "https://via.placeholder.com/300x400?text=Kinda+Alloush"
    },
    {
        id: 9,
        name: "Khaled El-Nabawy",
        arabicName: "خالد النبوي",
        image: "https://via.placeholder.com/300x400?text=Khaled+El-Nabawy"
    },
    {
        id: 10,
        name: "Amira Adly",
        arabicName: "أميرة عادلي",
        image: "https://via.placeholder.com/300x400?text=Amira+Adly"
    }
];

// Storage management
function saveComparison(comparison) {
    const history = JSON.parse(localStorage.getItem('comparisonHistory') || '[]');
    history.unshift({
        ...comparison,
        timestamp: new Date().toISOString()
    });
    // Keep only last 50 comparisons
    if (history.length > 50) {
        history.pop();
    }
    localStorage.setItem('comparisonHistory', JSON.stringify(history));
}

function getComparisonHistory() {
    return JSON.parse(localStorage.getItem('comparisonHistory') || '[]');
}

function getRandomActor() {
    return actorsData[Math.floor(Math.random() * actorsData.length)];
}

function calculateSimilarity() {
    // Simulate similarity calculation (in real app, this would use ML model)
    return Math.floor(Math.random() * 40) + 60; // 60-100%
}

// Initialize app on load
document.addEventListener('DOMContentLoaded', initializeApp);
