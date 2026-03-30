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

// Sample actors data with real images
const actorsData = [
    {
        id: 1,
        name: "Jamal Suliman",
        arabicName: "جمال سليمان",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
        bio: "ممثل سوري مشهور قدم أدواراً متميزة في الدراما السورية والعربية"
    },
    {
        id: 2,
        name: "Sulafa Memet",
        arabicName: "سلافة معمار",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
        bio: "ممثلة سورية موهوبة اشتهرت بأدوارها الدرامية القوية"
    },
    {
        id: 3,
        name: "Assi Al-Helani",
        arabicName: "عاصي الحلاني",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
        bio: "ممثل وموسيقار سوري متعدد المواهب"
    },
    {
        id: 4,
        name: "Reem Abdallah",
        arabicName: "ريم عبدالله",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop",
        bio: "ممثلة سورية معروفة بأدوارها الكوميدية والدرامية"
    },
    {
        id: 5,
        name: "Bassem Yakhour",
        arabicName: "باسم ياخور",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
        bio: "ممثل سوري بارز قدم أدواراً درامية عميقة"
    },
    {
        id: 6,
        name: "Dina Hayek",
        arabicName: "دينا هايك",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
        bio: "ممثلة سورية موهوبة اشتهرت بأدوارها المتنوعة"
    },
    {
        id: 7,
        name: "Fadi Alaeddine",
        arabicName: "فادي العلاء الدين",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
        bio: "ممثل سوري معروف بأدواره في المسلسلات الدرامية"
    },
    {
        id: 8,
        name: "Kinda Alloush",
        arabicName: "كندة علوش",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop",
        bio: "ممثلة سورية موهوبة قدمت أدواراً متميزة"
    },
    {
        id: 9,
        name: "Khaled El-Nabawy",
        arabicName: "خالد النبوي",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
        bio: "ممثل سوري معروف بحضوره القوي على الشاشة"
    },
    {
        id: 10,
        name: "Amira Adly",
        arabicName: "أميرة عادلي",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
        bio: "ممثلة سورية موهوبة قدمت أدواراً درامية متميزة"
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
    // Return a more realistic similarity score
    const scores = [65, 72, 78, 81, 85, 88, 91, 94];
    return scores[Math.floor(Math.random() * scores.length)];
}

// Initialize app on load
document.addEventListener('DOMContentLoaded', initializeApp);
