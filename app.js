const translations = {
    ar: {
        'welcome-title': 'اصنع سحر التهنئة بالذكاء الاصطناعي',
        'step1-desc': 'أدخل تفاصيلك لنبدأ في تصميم كارت مذهل وفريد من نوعه.',
        'login-title': 'أهلاً بك في WishAI ✦',
        'login-desc': 'سجل دخولك لتتمكن من حفظ بطاقاتك والوصول إليها من أي مكان.',
        'btn-google': 'المتابعة باستخدام Google',
        'enter-name': 'الاسم:',
        'select-occasion': 'اختر المناسبة:',
        'greeting-label': 'نص التهنئة:',
        'ai-suggest': 'اقتراحات ذكية',
        'ai-suggestions-title': 'اقتراحات الذكاء الاصطناعي',
        'loading-suggestions': 'جاري التفكير...',
        'custom-instructions': 'إضافات خاصة (اختياري):',
        'optional-placeholder': 'مثال: أضف زهور الياسمين، اجعل اللون الفيروزي هو الغالب...',
        'customize-design': 'تخصيص التصميم',
        'art-style': 'نمط الفن:',
        'detail-level': 'مستوى التفاصيل:',
        'color-intensity': 'كثافة الألوان:',
        'color-palette': 'لوحة الألوان:',
        'generate-btn': 'توليد البطاقة ✨',
        'my-cards': 'بطاقاتي 🖼️',
        'gallery-title': 'معرض البطاقات',
        'gallery-desc': 'جميع إبداعاتك السابقة محفوظة هنا.',
        'no-cards-saved': 'لم تقم بتوليد أي بطاقات حتى الآن.',
        'back-home': 'العودة للرئيسية',
        'delete-card': 'حذف',
        'download': 'تحميل البطاقة',
        'create-new': 'تصميم جديد',
        'logout': 'تسجيل الخروج',
        'generating': 'جاري التوليد...',
        'ramadan': 'رمضان', 'eid': 'العيد', 'birthday': 'ميلاد', 'wedding': 'زواج',
        'graduation': 'تخرج', 'success': 'نجاح', 'newborn': 'مولود جديد', 'love': 'حب',
        'friendship': 'صداقة', 'daily': 'تحية يومية', 'newyear': 'سنة جديدة', 'thankyou': 'شكر',
        'btn-guest': 'المتابعة كزائر'
    },
    en: {
        'welcome-title': 'Create AI Greeting Magic',
        'step1-desc': 'Enter your details to start designing a stunning and unique card.',
        'login-title': 'Welcome to WishAI ✦',
        'login-desc': 'Log in to save your cards and access them from anywhere.',
        'btn-google': 'Continue with Google',
        'enter-name': 'Name:',
        'select-occasion': 'Select Occasion:',
        'greeting-label': 'Greeting Text:',
        'ai-suggest': 'AI Suggestions',
        'ai-suggestions-title': 'AI Suggestions',
        'loading-suggestions': 'Thinking...',
        'custom-instructions': 'Special Instructions (Optional):',
        'optional-placeholder': 'e.g., add jasmine flowers, dominant turquoise color...',
        'customize-design': 'Customize Design',
        'art-style': 'Art Style:',
        'detail-level': 'Detail Level:',
        'color-intensity': 'Color Intensity:',
        'color-palette': 'Color Palette:',
        'generate-btn': 'Generate Card ✨',
        'my-cards': 'My Cards 🖼️',
        'gallery-title': 'Card Gallery',
        'gallery-desc': 'All your previous creations are saved here.',
        'no-cards-saved': 'You haven\'t generated any cards yet.',
        'back-home': 'Back Home',
        'delete-card': 'Delete',
        'download': 'Download Card',
        'create-new': 'New Design',
        'logout': 'Logout',
        'generating': 'Generating...',
        'ramadan': 'Ramadan', 'eid': 'Eid', 'birthday': 'Birthday', 'wedding': 'Wedding',
        'graduation': 'Graduation', 'success': 'Success', 'newborn': 'Newborn', 'love': 'Love',
        'friendship': 'Friendship', 'daily': 'Daily Greeting', 'newyear': 'New Year', 'thankyou': 'Thank You',
        'btn-guest': 'Continue as Guest'
    }
};

const occasions = [
    {
        id: 'ramadan', icon: '🌙', nameAr: 'رمضان', nameEn: 'Ramadan',
        descAr: 'أجواء رمضانية روحانية، فوانيس، هلال في السماء، وزخارف هندسية إسلامية أنيقة.',
        descEn: 'Spiritual Ramadan atmosphere, lanterns, crescent moon in the sky, and elegant Islamic geometric patterns.'
    },
    {
        id: 'eid', icon: '🕌', nameAr: 'العيد', nameEn: 'Eid',
        descAr: 'مظاهر احتفال بعيد الفطر أو الأضحى، مساجد مزينة، عيدية، وحلويات العيد المبهجة.',
        descEn: 'Celebration of Eid Al-Fitr or Eid Al-Adha, decorated mosques, Eid gifts, and joyful holiday sweets.'
    },
    {
        id: 'birthday', icon: '🎂', nameAr: 'ميلاد', nameEn: 'Birthday',
        descAr: 'كعكة ميلاد فاخرة، شموع، بالونات ملونة، وهدايا مغلفة بطريقة فنية.',
        descEn: 'Luxury birthday cake, candles, colorful balloons, and artistically wrapped gifts.'
    },
    {
        id: 'wedding', icon: '💍', nameAr: 'زواج', nameEn: 'Wedding',
        descAr: 'ورود فخم، خواتم زفاف ذهبية، ستائر حريرية، وإضاءة رومانسية حالمة.',
        descEn: 'Luxury roses, golden wedding rings, silk curtains, and dreamy romantic lighting.'
    },
    {
        id: 'graduation', icon: '🎓', nameAr: 'تخرج', nameEn: 'Graduation',
        descAr: 'قبعة تخرج، شهادة مربوطة بشريط أحمر، قصاصات ورق ملونة، وأجواء نجاح.',
        descEn: 'Graduation cap, diploma tied with a red ribbon, colorful confetti, and success vibes.'
    },
    {
        id: 'success', icon: '🎉', nameAr: 'نجاح', nameEn: 'Success',
        descAr: 'كؤوس ذهبية، ألعاب نارية في السماء، ألوان مشرقة، ورموز فخر وإنجاز.',
        descEn: 'Golden trophies, fireworks in the sky, bright colors, and symbols of pride and achievement.'
    },
    {
        id: 'newborn', icon: '👶', nameAr: 'مولود جديد', nameEn: 'Newborn',
        descAr: 'ملابس أطفال ناعمة، ألعاب خشبية، ألوان أزرق فاتح أو وردي، وأجواء هادئة.',
        descEn: 'Soft baby clothes, wooden toys, light blue or pink colors, and a peaceful atmosphere.'
    },
    {
        id: 'love', icon: '❤️', nameAr: 'حب', nameEn: 'Love',
        descAr: 'قلوب فنية، ورود حمراء، شموع دافئة، وجماليات رومانسية ناعمة.',
        descEn: 'Artistic hearts, red roses, warm candles, and soft romantic aesthetics.'
    },
    {
        id: 'friendship', icon: '🤝', nameAr: 'صداقة', nameEn: 'Friendship',
        descAr: 'رموز الروابط القوية، أزهار الصداقة، ألوان مبهجة، ودفء إنساني.',
        descEn: 'Symbols of strong bonds, friendship flowers, cheerful colors, and human warmth.'
    },
    {
        id: 'daily', icon: '☀️', nameAr: 'تحية يومية', nameEn: 'Daily',
        descAr: 'أجواء صباحية مشرقة، فنجان قهوة، طبيعة خضراء، وكلمات تبعث على الأمل.',
        descEn: 'Bright morning atmosphere, cup of coffee, green nature, and hopeful words.'
    },
    {
        id: 'newyear', icon: '🎇', nameAr: 'سنة جديدة', nameEn: 'New Year',
        descAr: 'ألعاب نارية ضخمة، الساعة تشير للثانية عشر، لمعان ذهبي وفضي، وحماس للمستقبل.',
        descEn: 'Massive fireworks, clock pointing to midnight, gold and silver glitter, and excitement for the future.'
    },
    {
        id: 'thankyou', icon: '🙏', nameAr: 'شكر', nameEn: 'Thank You',
        descAr: 'باقات زهر، رموز الامتنان، ألوان هادئة، وبساطة أنيقة.',
        descEn: 'Flower bouquets, symbols of gratitude, calm colors, and elegant simplicity.'
    }
];


const greetings = {
    ar: {
        ramadan: 'رمضان كريم', eid: 'عيد مبارك', birthday: 'عيد ميلاد سعيد',
        wedding: 'زواج مبارك', graduation: 'مبارك التخرج', success: 'مبارك النجاح',
        newborn: 'مبارك المولود', love: 'أحبك', friendship: 'صديقي الغالي',
        daily: 'يوم سعيد', newyear: 'سنة سعيدة', thankyou: 'شكراً لك'
    },
    en: {
        ramadan: 'Ramadan Kareem', eid: 'Eid Mubarak', birthday: 'Happy Birthday',
        wedding: 'Happy Wedding', graduation: 'Happy Graduation', success: 'Congratulations',
        newborn: 'Welcome Baby', love: 'I Love You', friendship: 'Best Friends Forever',
        daily: 'Have a Great Day', newyear: 'Happy New Year', thankyou: 'Thank You'
    }
};

let state = {
    lang: 'ar',
    isLoggedIn: false,
    user: null,
    name: '',
    occasion: null,
    greeting: '',
    instructions: '',
    style: 'modern',
    details: 7,
    colorIntensity: 5,
    palette: 'auto'
};

const API_KEY = 'AIzaSyCjHv0CLNcwJG7WEUoorduNGGFUiDNHWRc';
// Confirmed available models from API (tested 2026-03-05):
const AI_MODEL = 'gemini-2.5-flash'; // For text: suggestions & prompt refinement (v1beta ✅)
const NB2_MODEL = 'gemini-3.1-flash-image-preview'; // Nano Banana 2 — native image generation (v1beta ✅)
const NB2_BACKUP = 'nano-banana-pro-preview';        // Nano Banana Pro — backup (v1beta ✅)
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';


function init() {
    renderOccasions();
    bindEvents();
    updateText();
    checkAuth();
}

function checkAuth() {
    const savedUser = localStorage.getItem('wishai_user');
    if (savedUser) {
        state.isLoggedIn = true;
        state.user = JSON.parse(savedUser);
        updateUserInfo();
        go(1);
    } else {
        go(0);
    }
}

function updateUserInfo() {
    const userInfo = document.getElementById('user-info');
    const nameHeader = document.getElementById('user-name-header');
    if (state.isLoggedIn && state.user) {
        userInfo.classList.remove('hidden');
        nameHeader.textContent = state.user.name;
    } else {
        userInfo.classList.add('hidden');
    }
}

function logout() {
    state.isLoggedIn = false;
    state.user = null;
    localStorage.removeItem('wishai_user');

    // Revoke Google session if needed
    if (typeof google !== 'undefined' && google.accounts.id) {
        google.accounts.id.disableAutoSelect();
    }

    updateUserInfo();
    go(0);
}

/* 🔑 AUTH CONFIGURATION - REPLACE WITH YOUR KEYS TO GO LIVE */
const authOptions = {
    google: {
        clientId: '407778791327-ailt3nkhvj1hni90e6up27gg7rl46nut.apps.googleusercontent.com',
        enabled: true
    },
    apple: {
        clientId: 'YOUR_APPLE_CLIENT_ID',
        enabled: false
    },
    microsoft: {
        clientId: 'YOUR_MICROSOFT_CLIENT_ID',
        enabled: false
    }
};

function login(provider) {
    console.log(`🚀 Starting ${provider} login flow...`);

    if (provider === 'guest') {
        return completeLogin({
            name: state.lang === 'ar' ? 'ضيف' : 'Guest',
            email: 'guest@wishai.demo',
            provider: 'guest',
            photo: '',
            id: 'guest' + Date.now()
        });
    }

    if (provider === 'google' && authOptions.google.enabled) {
        return loginWithGoogle();
    }

    // Fallback: Professional Simulation
    const width = 500, height = 600;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);

    const authWindow = window.open(
        `auth-sim.html?provider=${provider}&lang=${state.lang}`,
        'WishAI Auth',
        `width=${width},height=${height},top=${top},left=${left}`
    );

    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
        loginCard.style.opacity = '0.5';
        loginCard.style.pointerEvents = 'none';

        const checkClosed = setInterval(() => {
            if (authWindow && authWindow.closed) {
                clearInterval(checkClosed);
                if (!state.isLoggedIn) {
                    loginCard.style.opacity = '1';
                    loginCard.style.pointerEvents = 'all';
                }
            }
        }, 500);
    }
}

let tokenClient;

function loginWithGoogle() {
    if (typeof google === 'undefined' || !google.accounts.oauth2) {
        console.error("Google OAuth2 library not loaded.");
        return alert(state.lang === 'ar' ? "جاري تحميل خدمات Google، يرجى المحاولة بعد لحظة." : "Google services are loading... please try again.");
    }

    try {
        if (!tokenClient) {
            tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: authOptions.google.clientId,
                scope: 'openid profile email',
                callback: (tokenResponse) => {
                    if (tokenResponse && tokenResponse.access_token) {
                        fetchUserInfo(tokenResponse.access_token);
                    } else if (tokenResponse.error) {
                        console.error("Token Error:", tokenResponse.error);
                        handleAuthError('google');
                    }
                },
                error_callback: (err) => {
                    console.error("GSI Client Error:", err);
                    handleAuthError('google');
                }
            });
        }

        // This triggers the real Google Account selection popup
        tokenClient.requestAccessToken({ prompt: 'select_account' });

    } catch (err) {
        console.error("GSI Exception:", err);
        handleAuthError('google');
    }
}

function fetchUserInfo(accessToken) {
    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch user info');
            return response.json();
        })
        .then(data => {
            console.log("✅ Real Google Login Success:", data.email);
            completeLogin({
                name: data.name,
                email: data.email,
                provider: 'google',
                photo: data.picture,
                id: data.sub
            });
        })
        .catch(err => {
            console.error("Userinfo Fetch Error:", err);
            handleAuthError('google');
        });
}

function handleAuthError(provider) {
    // If it's a domain/origin error, warn the user
    console.warn(`Auth failed for ${provider}. Ensure your authorized origins in Google Console match http://localhost:8080`);

    const msg = state.lang === 'ar' ?
        `فشل الربط الحقيقي (ربما بسبب إعدادات النطاق/الأمان). سنستمر كضيف مؤقتاً.` :
        `Real integration failed (Check console for origin errors). Proceeding as guest.`;

    alert(msg);
    // Auto-login as guest if real auth fails during demo to prevent getting stuck
    completeLogin({
        name: state.lang === 'ar' ? 'ضيف' : 'Guest',
        email: 'guest@wishai.demo',
        provider: 'guest',
        photo: '',
        id: 'guest123'
    });
}

function completeLogin(userData) {
    state.isLoggedIn = true;
    state.user = userData;
    localStorage.setItem('wishai_user', JSON.stringify(userData));
    updateUserInfo();
    go(1);

    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
        loginCard.style.opacity = '1';
        loginCard.style.pointerEvents = 'all';
    }
}

// Handle message from auth popup (Simulation handle)
window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return;
    if (event.data.type === 'AUTH_SUCCESS') {
        completeLogin(event.data.user);
    }
});


function bindEvents() {
    document.getElementById('logout-btn').onclick = logout;
    // social login buttons managed via onclick in HTML

    // Logo Click -> Go Home & Reset
    const logo = document.querySelector('.brand');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.onclick = () => {
            document.getElementById('restart-btn').click();
        };
    }

    document.getElementById('lang-toggle').onclick = (e) => {
        if (!e.target.dataset.lang) return;
        state.lang = e.target.dataset.lang;
        document.querySelectorAll('#lang-toggle span').forEach(s => s.classList.remove('active'));
        e.target.classList.add('active');
        document.documentElement.lang = state.lang;
        document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
        updateText();
        renderOccasions();
    };

    document.getElementById('ai-suggest-btn').onclick = generateSuggestions;

    document.getElementById('greeting-text').oninput = (e) => {
        state.greeting = e.target.value;
    };

    document.getElementById('advanced-toggle').onclick = () => {
        const panel = document.getElementById('advanced-panel');
        const icon = document.querySelector('#advanced-toggle .toggle-icon');
        panel.classList.toggle('open');
        icon.style.transform = panel.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
    };

    // Sliders
    const dSlider = document.getElementById('pref-details');
    const cSlider = document.getElementById('pref-colors');

    dSlider.oninput = (e) => {
        state.details = e.target.value;
        document.getElementById('detail-value').textContent = state.details;
    };

    cSlider.oninput = (e) => {
        state.colorIntensity = e.target.value;
        const labels = state.lang === 'ar' ? ['باهت', 'متوازن', 'غني'] : ['Pale', 'Balanced', 'Rich'];
        let label = labels[1];
        if (state.colorIntensity < 4) label = labels[0];
        else if (state.colorIntensity > 7) label = labels[2];
        document.getElementById('color-value').textContent = label;
    };

    const updateSlider = (slider, delta) => {
        const newVal = Math.min(Math.max(parseInt(slider.value) + delta, 1), 10);
        slider.value = newVal;
        slider.dispatchEvent(new Event('input'));
    };

    document.getElementById('detail-minus').onclick = () => updateSlider(dSlider, -1);
    document.getElementById('detail-plus').onclick = () => updateSlider(dSlider, 1);
    document.getElementById('color-minus').onclick = () => updateSlider(cSlider, -1);
    document.getElementById('color-plus').onclick = () => updateSlider(cSlider, 1);


    // Sub-style configurations
    const subStylesConfig = {
        modern: ['Futuristic', 'Neon', 'Cyberpunk', 'Neon Lights', 'Glassmorphism'],
        traditional: ['Vintage', 'Classic Art', 'Calligraphy', 'Victorian'],
        minimalist: ['Flat Design', 'Line Art', 'Monochrome', 'Geometric'],
        vibrant: ['Pop Art', 'Psychedelic', 'Gradient', 'Fluid'],
        watercolor: ['Pastel', 'Oil Painting', 'Ink Wash', 'Charcoal'],
        '3d-render': ['Claymation', 'Photorealistic', 'Low Poly', 'Isometric']
    };

    // Art Style Cards (Image Selector)
    document.querySelectorAll('.style-card[data-value]').forEach(c => {
        c.onclick = () => {
            document.querySelectorAll('.style-card[data-value]').forEach(x => x.classList.remove('active', 'selected'));
            c.classList.add('active', 'selected');
            state.style = c.dataset.value;
            state.subStyle = null; // reset

            // Populate Sub-Styles Panel
            const subPanel = document.getElementById('sub-styles-panel');
            const subContainer = document.getElementById('sub-style-chips');
            subContainer.innerHTML = '';

            const options = subStylesConfig[state.style];
            if (options && options.length > 0) {
                subPanel.classList.remove('hidden');
                options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'chip';
                    btn.type = 'button';
                    btn.innerHTML = `<span class="chip-icon">✨</span><span>${opt}</span>`;
                    btn.onclick = () => {
                        document.querySelectorAll('#sub-style-chips .chip').forEach(x => x.classList.remove('active', 'selected'));
                        btn.classList.add('active', 'selected');
                        state.subStyle = opt;
                    };
                    subContainer.appendChild(btn);
                });

                // Select first option by default
                subContainer.firstChild.click();
            } else {
                subPanel.classList.add('hidden');
            }
        };
    });

    // Default initialization for style selection
    document.querySelector('.style-card[data-value="modern"]')?.click();

    // Color Palette Chips (HTML uses class palette-chip + data-palette)
    document.querySelectorAll('.palette-chip[data-palette]').forEach(c => {
        c.onclick = () => {
            document.querySelectorAll('.palette-chip[data-palette]').forEach(x => x.classList.remove('active', 'selected'));
            c.classList.add('active', 'selected');
            state.palette = c.dataset.palette;
        };
    });

    document.getElementById('generate-btn').onclick = () => {
        state.name = document.getElementById('user-name').value.trim();
        state.greeting = document.getElementById('greeting-text').value.trim();
        state.instructions = document.getElementById('custom-instructions').value.trim();

        if (!state.name) return alert(state.lang === 'ar' ? 'أدخل اسمك' : 'Enter your name');
        if (!state.occasion) return alert(state.lang === 'ar' ? 'اختر مناسبة' : 'Select an occasion');

        go(2);
        generate();
    };

    document.getElementById('restart-btn').onclick = () => {
        state.occasion = null;
        state.name = '';
        state.greeting = '';
        document.getElementById('user-name').value = '';
        document.getElementById('greeting-text').value = '';
        document.getElementById('custom-instructions').value = '';
        document.getElementById('greeting-field').classList.add('hidden');
        document.getElementById('suggestions-container').classList.add('hidden');
        go(1);
        renderOccasions();
    };

    document.getElementById('my-cards-btn').onclick = () => {
        go(3);
        renderGallery();
    };

    document.querySelector('.back-home-btn').onclick = () => go(1);

    // ==========================================
    // Fullscreen Modal & Download Logic
    // ==========================================
    const imgModal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');

    // Open Modal
    document.getElementById('generated-image').onclick = (e) => {
        if (!e.target.src) return;
        modalImg.src = e.target.src;
        imgModal.classList.remove('hidden');
    };

    // Close Modal
    document.getElementById('close-modal-btn').onclick = () => {
        imgModal.classList.add('hidden');
    };
    imgModal.onclick = (e) => {
        if (e.target === imgModal) imgModal.classList.add('hidden');
    };

    // Download Logic (Robust fetch to avoid CORS/navigation issues)
    const handleDownload = async () => {
        const src = document.getElementById('generated-image').src;
        if (!src) return;

        try {
            if (src.startsWith('data:')) {
                const a = document.createElement('a');
                a.href = src;
                a.download = `WishAI-${state.occasion || 'card'}-${Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                // Fetch as blob to force download instead of open in new tab
                const response = await fetch(src);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `WishAI-${state.occasion || 'card'}-${Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error("Download failed, using fallback:", err);
            // Fallback
            const a = document.createElement('a');
            a.href = src;
            a.download = `WishAI-${state.occasion || 'card'}.png`;
            a.click();
        }
    };

    document.getElementById('download-btn').onclick = handleDownload;
    document.getElementById('modal-download-btn').onclick = handleDownload;
}

function renderOccasions() {
    const grid = document.getElementById('occasion-grid');
    grid.innerHTML = '';
    occasions.forEach(o => {
        const el = document.createElement('div');
        el.className = `occ${state.occasion === o.id ? ' selected' : ''}`;
        el.innerHTML = `<span class="occ-icon">${o.icon}</span><span class="occ-name">${state.lang === 'ar' ? o.nameAr : o.nameEn}</span>`;
        el.onclick = () => {
            state.occasion = o.id;
            const defaultGreeting = greetings[state.lang][o.id] || '';
            state.greeting = defaultGreeting;
            document.getElementById('greeting-text').value = defaultGreeting;
            document.getElementById('greeting-field').classList.remove('hidden');
            document.getElementById('suggestions-container').classList.add('hidden');
            renderOccasions();
        };
        grid.appendChild(el);
    });
}

function updateText() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (translations[state.lang][key]) el.textContent = translations[state.lang][key];
    });
    document.getElementById('user-name').placeholder = state.lang === 'ar' ? 'ما هو اسمك؟' : 'What is your name?';
}

function go(n) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${n}`).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function generateSuggestions() {
    const btn = document.getElementById('ai-suggest-btn');
    const container = document.getElementById('suggestions-container');
    const list = document.getElementById('suggestions-list');
    const loadingEl = document.getElementById('suggestions-loading');

    if (!state.occasion) return;

    btn.classList.add('loading');
    container.classList.remove('hidden');
    list.innerHTML = '';
    loadingEl.classList.remove('hidden');

    const occ = occasions.find(o => o.id === state.occasion);
    const occName = state.lang === 'ar' ? occ.nameAr : occ.nameEn;

    const prompt = state.lang === 'ar'
        ? `اقترح 5 نصوص تهنئة قصيرة ومميزة بمناسبة ${occName}. النصوص يجب أن تكون بالعربية، قصيرة (لا تزيد عن 8 كلمات)، عامة (لا تستخدم أي أسماء أشخاص)، وقابلة لكتابتها على بطاقة تهنئة. أعطني النصوص فقط، كل نص في سطر منفصل مرقم (1. 2. 3. الخ)، بدون أي شرح إضافي.`
        : `Suggest 5 short and unique greeting texts for ${occName}. The texts should be in English, short (max 8 words), general (do not include any person names), and suitable for a greeting card. Give me only the texts, each on a separate numbered line (1. 2. 3. etc), without any extra explanation.`;

    try {
        const res = await fetch(`${API_BASE}/${AI_MODEL}:generateContent?key=${API_KEY}`, {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`API Error ${res.status}: ${errText}`);
        }
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('Empty response from AI');
        const suggestions = text.split('\n').map(l => l.replace(/^\d+[\.\)\-]\s*/, '').trim()).filter(l => l.length > 0).slice(0, 5);

        loadingEl.classList.add('hidden');
        suggestions.forEach((s, i) => {
            const item = document.createElement('button');
            item.className = 'suggestion-item';
            item.innerHTML = `<span class="suggestion-num">${i + 1}</span><span class="suggestion-text">${s}</span>`;
            item.onclick = () => {
                state.greeting = s;
                document.getElementById('greeting-text').value = s;
                list.querySelectorAll('.suggestion-item').forEach(x => x.classList.remove('selected-suggestion'));
                item.classList.add('selected-suggestion');
            };
            list.appendChild(item);
        });
    } catch (e) {
        console.error(e);
        loadingEl.classList.add('hidden');
        list.innerHTML = `<div style="color:var(--dim);text-align:center;padding:10px;">${state.lang === 'ar' ? 'حدث خطأ، حاول مرة أخرى' : 'Error, try again'}</div>`;
    }
    btn.classList.remove('loading');
}

async function generate() {
    console.log("🚀 WishAI Mastery Engine: Nano Banana 2 — Active");

    const img = document.getElementById('generated-image');
    const loading = document.getElementById('loading-area');
    const result = document.getElementById('result-area');
    const greetingOverlay = document.getElementById('overlay-greeting');
    const nameOverlay = document.getElementById('overlay-name');

    // 1. Prepare UI
    // Do not clear img.src immediately so we don't get an empty space.
    // Let the loader overlay it.
    img.style.opacity = '0.3';
    greetingOverlay.textContent = '';
    nameOverlay.textContent = '';

    // 2. Build Sophisticated Prompt
    const occ = occasions.find(o => o.id === state.occasion);
    const occDesc = state.lang === 'ar' ? occ.descAr : occ.descEn;
    const langLabel = state.lang === 'ar' ? 'Arabic' : 'English';

    const typoStyle = state.lang === 'ar'
        ? 'Majestic golden 3D Arabic calligraphy (Thuluth and Diwani mix)'
        : 'Elegant premium 3D golden serif typography with artistic flourishes';

    const prompt = `Create a stunning, ultra-premium vertical greeting card.
Description: ${occDesc}.
Artistic Style: ${state.style}${state.subStyle ? ` (${state.subStyle})` : ''}.
Design Quality: Detail Level ${state.details}/10, Color Intensity ${state.colorIntensity}/10, Color Palette: ${state.palette}.
Additional User Directives: ${state.instructions || 'None'}.

CRITICAL TYPOGRAPHY INSTRUCTIONS:
1. MAIN GREETING: Render the text "${state.greeting}" exactly at the center of the card. Use ${typoStyle}. Must be in ${langLabel} and perfectly legible.
2. PERSONAL NAME: Render the name "${state.name}" elegantly below the greeting. Keep the original script EXACTLY as-is.
3. TECHNICAL QUALITY: 8k resolution, cinematic lighting, high-fidelity textures, professional design.
4. TEXT GUARANTEE: ${langLabel} text must be perfectly written. Arabic must be correctly connected (Right-to-Left).`;

    // Helper: display image from base64
    function showImage(base64, mimeType) {
        const src = `data:${mimeType};base64,${base64}`;
        img.src = src;
        img.style.opacity = '1';
        loading.classList.add('hidden');
        result.classList.remove('hidden');
        saveCard(src, state.occasion, state.name);
        console.log("✅ Nano Banana 2: Card Generated Successfully!");
    }

    // Helper: display image from URL
    function showImageUrl(url) {
        const loader = new Image();
        loader.onload = () => {
            img.src = url;
            img.style.opacity = '1';
            loading.classList.add('hidden');
            result.classList.remove('hidden');
            saveCard(url, state.occasion, state.name);
            console.log("✅ Mastered (Fallback Engine): Card Generated.");
        };
        loader.onerror = () => fallback();
        loader.src = url;
    }

    try {
        // ── PRIMARY: Nano Banana 2 (gemini-3.1-flash-image-preview) ──
        console.log("🧠 Nano Banana 2: Generating native image...");

        // Try NB2 then NB2-Pro, both confirmed available in this API account
        const imageModels = [NB2_MODEL, NB2_BACKUP];

        let nbResponse = null;
        for (const model of imageModels) {
            try {
                const res = await fetch(
                    `${API_BASE}/${model}:generateContent?key=${API_KEY}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: {
                                responseModalities: ['IMAGE', 'TEXT']
                            }
                        })
                    }
                );
                if (res.ok) {
                    nbResponse = res;
                    console.log(`✅ Connected to Nano Banana model: ${model}`);
                    break;
                } else {
                    const errText = await res.text();
                    console.warn(`⚠️ ${model} failed (${res.status}):`, errText.slice(0, 200));
                }
            } catch (err) {
                console.warn(`⚠️ ${model} network error:`, err.message);
            }
        }

        if (nbResponse && nbResponse.ok) {
            const data = await nbResponse.json();
            const parts = data.candidates?.[0]?.content?.parts;
            if (parts) {
                const imgPart = parts.find(p => p.inlineData);
                if (imgPart) {
                    showImage(imgPart.inlineData.data, imgPart.inlineData.mimeType || 'image/png');
                    return; // ✅ Success
                }
            }
            console.warn("⚠️ Nano Banana 2: No image part in response, switching to backup engine...");
        } else if (nbResponse) {
            const errText = await nbResponse.text();
            console.warn("⚠️ Nano Banana 2 API Error:", nbResponse.status, errText);
        } else {
            console.warn("⚠️ Nano Banana 2: All Gemini image models failed to respond.");
        }

        // ── SECONDARY: Pollinations Flux (reliable fallback visual engine) ──
        console.log("🎨 Backup Engine (Flux): Rendering Card...");
        const seed = Math.floor(Math.random() * 1000000);
        const fluxUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=1200&model=flux&seed=${seed}&nologo=true`;
        showImageUrl(fluxUrl);

    } catch (e) {
        console.error("Generation Error:", e);
        fallback();
    }
}




function fallback() {
    const img = document.getElementById('generated-image');
    // High-quality static fallback if AI system is down
    const fbUrl = "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800";
    img.src = fbUrl;
    img.style.opacity = '1';
    document.getElementById('overlay-greeting').textContent = state.greeting;
    document.getElementById('overlay-name').textContent = state.name;
    document.getElementById('loading-area').classList.add('hidden');
    document.getElementById('result-area').classList.remove('hidden');
    saveCard(fbUrl, state.occasion, state.name, true);
}



function saveCard(src, occId, name, isFallback = false) {
    try {
        let cards = JSON.parse(localStorage.getItem('wishai_cards') || '[]');
        cards.unshift({ id: Date.now(), src, occId, name, date: new Date().toISOString(), isFallback });
        if (cards.length > 15) cards.pop();

        // Try to save. If it fails due to quota, keep popping until it fits, or abandon.
        let saved = false;
        while (!saved && cards.length > 0) {
            try {
                localStorage.setItem('wishai_cards', JSON.stringify(cards));
                saved = true;
            } catch (e) {
                cards.pop(); // Remove oldest to free space
            }
        }
    } catch (err) {
        console.warn('Could not save card to history:', err);
    }
}

function renderGallery() {
    const grid = document.getElementById('gallery-grid');
    const empty = document.getElementById('gallery-empty');
    const cards = JSON.parse(localStorage.getItem('wishai_cards') || '[]');

    if (cards.length === 0) {
        empty.classList.remove('hidden');
        grid.classList.add('hidden');
    } else {
        empty.classList.add('hidden');
        grid.classList.remove('hidden');
        grid.innerHTML = cards.map(c => `
            <div class="gallery-item">
                <img src="${c.src}">
                <div class="gallery-overlay">
                    <div class="gallery-actions">
                        <button onclick="downloadCard('${c.src}', '${c.name}')">⬇️</button>
                        <button onclick="deleteCard(${c.id})">🗑️</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function downloadCard(src, name) {
    const a = document.createElement('a');
    a.href = src;
    a.download = `WishAI-${name || 'card'}.png`;
    a.click();
}

function deleteCard(id) {
    let cards = JSON.parse(localStorage.getItem('wishai_cards') || '[]');
    cards = cards.filter(c => c.id !== id);
    localStorage.setItem('wishai_cards', JSON.stringify(cards));
    renderGallery();
}

document.addEventListener('DOMContentLoaded', init);
