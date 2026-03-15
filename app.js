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
        'btn-guest': 'المتابعة كزائر',
        'sub-style': 'خيارات الأسلوب المتقدمة:',
        'style-modern': 'عصري وحديث',
        'style-traditional': 'تراثي كلاسيكي',
        'style-minimalist': 'بسيط وأنيق',
        'style-vibrant': 'ملون ومبهج',
        'style-watercolor': 'ألوان مائية',
        'style-3d': 'ثلاثي الأبعاد',
        'style-cinematic': 'تصوير سينمائي',
        'style-illustration': 'رسم توضيحي',
        'style-papercraft': 'فن ورقي',
        'live-preview': 'معاينة مباشرة (تصميم تخيلي)',
        'share': 'مشاركة 🔗'
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
        'btn-guest': 'Continue as Guest',
        'sub-style': 'Advanced Style Options:',
        'style-modern': 'Modern',
        'style-traditional': 'Traditional / Classic',
        'style-minimalist': 'Minimalist',
        'style-vibrant': 'Vibrant',
        'style-watercolor': 'Watercolor',
        'style-3d': '3D Render',
        'style-cinematic': 'Cinematic',
        'style-illustration': 'Illustration',
        'style-papercraft': 'Papercraft',
        'live-preview': 'Live Preview (Estimated)',
        'share': 'Share 🔗'
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

// 🔒 Security Update: API Key moved to Netlify environment variables
const API_BASE = '/.netlify/functions/gemini';
const AI_MODEL = 'gemini-1.5-flash'; 
const NB2_MODEL = 'gemini-1.5-flash'; 
const NB2_IMAGE_MODEL = 'gemini-1.5-flash'; 
const NB2_BACKUP = 'gemini-1.5-pro';
const REQUEST_TIMEOUT = 35000; 

// Top 1% Engineering: Persistent Connectivity Monitor
async function checkConnectivity() {
    try {
        const res = await fetch(API_BASE, {
            method: 'POST',
            body: JSON.stringify({ action: 'heartbeat' })
        });
        const data = await res.json();
        console.log(`[WishAI] System Heartbeat: ${data.status} (KeyLen: ${data.keyLen || data.keyLength || 0})`);
        return data.status === 'OK';
    } catch {
        return false;
    }
}


const FALLBACK_GREETINGS = {
    'ramadan': ['رمضان كريم وكل عام وأنتم بخير', 'مبارك عليكم الشهر الفضيل', 'نسأل الله لكم قبول الطاعات في رمضان', 'رمضان مبارك، أعاده الله عليكم باليمن والبركات', 'أجمل التهاني بمناسبة حلول شهر رمضان'],
    'eid': ['عيدكم مبارك وكل عام وأنتم بخير', 'تقبل الله منا ومنكم صالح الأعمال', 'عساكم من عواده، عيد سعيد', 'أجمل الأماني بمناسبة العيد السعيد', 'عيد مبارك، أعاده الله علينا وعليكم بالخير'],
    'grad': ['مبارك التخرج وإلى مزيد من النجاح', 'ألف مبروك التخرج، فخورون بك', 'تهانينا القلبية بهذا الإنجاز الرائع', 'نجاحك يسعدنا، مبارك التخرج', 'من نجاح إلى نجاح، ألف مبروك'],
    'success': ['ألف مبروك النجاح والتفوق', 'مبارك هذا الإنجاز المستحق', 'تهانينا بالنجاح، وإلى الأمام دائماً', 'فرحتنا بنجاحك لا توصف، مبروك', 'نبارك لكم هذا التميز والنجاح'],
    'wedding': ['بارك الله لكما وبارك عليكما وجمع بينكما في خير', 'ألف مبروك الزواج السعيد', 'تمنياتنا لكم بحياة ملؤها الحب والسعادة', 'زواج مبارك، دامت أيامكم أفراحاً', 'أجمل التهاني للعروسين الجميلين'],
    'newborn': ['بورك لك في الموهوب وشكرت الواهب', 'مبارك المولود الجديد، جعله الله من الصالحين', 'ألف مبروك بقدوم الضيف الجديد', 'يتربى في عزكم، ألف مبروك', 'الحمد لله على سلامة المولود ومبارك لكم'],
    'love': ['كل عام وحبنا يزداد جمالاً', 'أنت أجمل هدايا القدر', 'سأبقى أحبك دائماً وأبداً', 'وجودك في حياتي هو السعادة الحقيقية', 'إلى من أحب، كل عام وأنت بخير'],
    'new-year': ['سنة جديدة سعيدة مليئة بالأفراح', 'كل عام وأنتم بخير بمناسبة العام الجديد', 'نتمنى لكم عاماً مشرقاً وناجحاً', 'بداية عام جميلة كجمال قلوبكم', 'أجمل الأماني بعام 2024 سعيد'],
    'friendship': ['شكراً لكونك الصديق الذي لا يتبدل', 'الصداقة كنز، وأنت أغلى ما أملك', 'كل عام وصداقتنا تزداد قوة', 'دمت لي صديقاً وفياً وسنداً', 'لأعز أصدقائي، كل المحبة'],
    'thanks': ['شكراً لك من القلب على كل شيء', 'ممتن جداً لوجودك ودعمك', 'كلمات الشكر لا تفي بحقك', 'تقديراً لجهودك الرائعة، شكراً لك', 'شكراً جزيلاً، أنت متميز دائماً'],
    'daily': ['صباح الخير والأمل والسعادة', 'يوم جميل يشبه نقاء قلبك', 'أتمنى لك يوماً مليئاً بالإنجازات', 'مساء الخير والسكينة', 'طابت أيامكم بكل خير']
};

function init() {
    checkConnectivity();
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
        updatePreview();
    };

    document.getElementById('user-name').oninput = (e) => {
        updatePreview();
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
        modern: {
            ar: ['مستقبلي', 'نيون', 'سايبر بانك', 'إضاءات نيون', 'زجاجي', 'تجريدي', 'ثلاثي الأبعاد حديث', 'إضاءة سينمائية'],
            en: ['Futuristic', 'Neon', 'Cyberpunk', 'Neon Lights', 'Glassmorphism', 'Abstract', 'Modern 3D', 'Cinematic Lighting']
        },
        traditional: {
            ar: ['عتيق', 'فن كلاسيكي', 'تخطيط', 'فيكتوري', 'زخرفة إسلامية', 'عصر النهضة', 'رسم زيتي تقليدي', 'فن استشراقي'],
            en: ['Vintage', 'Classic Art', 'Calligraphy', 'Victorian', 'Islamic Geometry', 'Renaissance', 'Traditional Oil Painting', 'Orientalist Art']
        },
        minimalist: {
            ar: ['تصميم مسطح', 'فن خطي', 'أحادية اللون', 'هندسي', 'مساحات سلبية', 'بسيط ولطيف', 'فن البوب المينيمالي', 'إسكندنافي'],
            en: ['Flat Design', 'Line Art', 'Monochrome', 'Geometric', 'Negative Space', 'Simple & Cute', 'Minimal Pop Art', 'Scandinavian']
        },
        vibrant: {
            ar: ['بوب آرت', 'مزاجي', 'تدرج لوني', 'سائل', 'مضيء', 'ألوان نيون', 'سريالي ملون', 'كاريكاتير'],
            en: ['Pop Art', 'Psychedelic', 'Gradient', 'Fluid', 'Luminous', 'Neon Colors', 'Colorful Surrealism', 'Caricature']
        },
        watercolor: {
            ar: ['ألوان باستيل', 'رسم زيتي', 'حبر', 'فحم', 'ألوان مائية ناعمة', 'رسم قلم رصاص', 'ألوان جواش', 'لطخات ألوان'],
            en: ['Pastel', 'Oil Painting', 'Ink Wash', 'Charcoal', 'Soft Watercolor', 'Pencil Sketch', 'Gouache', 'Color Splashes']
        },
        '3d-render': {
            ar: ['صلصال', 'واقعي', 'رسوم منخفضة', 'فيزيائي', 'تصيير أوكتان', 'ألياف ناعمة', 'تكوين فوكسل', 'إضاءة استوديو'],
            en: ['Claymation', 'Photorealistic', 'Low Poly', 'Isometric', 'Octane Render', 'Soft Fluff', 'Voxel Art', 'Studio Lighting']
        },
        cinematic: {
            ar: ['إضاءة درامية', 'تصوير فيلم', 'عدسة ماكرو', 'أبيض وأسود سينمائي', 'خيال علمي', 'فانتازيا', 'مشهد ملحمي', 'إضاءة خلفية'],
            en: ['Dramatic Lighting', 'Film Photography', 'Macro Lens', 'Cinematic B&W', 'Sci-Fi', 'Fantasy', 'Epic Scene', 'Backlighting']
        },
        illustration: {
            ar: ['رسم رقمي', 'أنمي', 'كتب أطفال', 'كوميكس', 'رسم قصصي', 'شخصيات كرتونية', 'رسم خطي', 'رسم خيالي'],
            en: ['Digital Art', 'Anime', 'Childrens Book', 'Comics', 'Storybook Illustration', 'Cartoon Characters', 'Line Drawing', 'Fantasy Illustration']
        },
        papercraft: {
            ar: ['أوريغامي', 'قصاصات ورق', 'طبقات ورقية', 'صندوق إضاءة', 'ورق مقوى ثلاثي الأبعاد', 'لف الورق كويلينج', 'نقش ورقي', 'ظل ورقي'],
            en: ['Origami', 'Paper Cutout', 'Layered Paper', 'Lightbox Art', '3D Cardboard', 'Quilling Art', 'Paper Embossing', 'Paper Shadow']
        }
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

            const options = subStylesConfig[state.style]?.[state.lang] || [];
            if (options && options.length > 0) {
                subPanel.classList.remove('hidden');
                options.forEach((opt, index) => {
                    const btn = document.createElement('button');
                    btn.className = 'chip';
                    btn.type = 'button';
                    btn.innerHTML = `<span class="chip-icon">✨</span><span>${opt}</span>`;
                    btn.onclick = () => {
                        document.querySelectorAll('#sub-style-chips .chip').forEach(x => x.classList.remove('active', 'selected'));
                        btn.classList.add('active', 'selected');
                        // Use English equivalent for state.subStyle value to keep prompt consistent for AI
                        state.subStyle = subStylesConfig[state.style].en[index];
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
        console.log("State updated with instructions:", state.instructions);

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

    document.getElementById('share-btn').onclick = async () => {
        const src = document.getElementById('generated-image').src;
        if (!src) return;

        if (navigator.share) {
            try {
                // If it's a data URL, we might need to convert to file for some platforms,
                // but usually Sharing text + URL is better.
                // For this demo, we'll share the text and prompt.
                await navigator.share({
                    title: 'WishAI Greeting Card',
                    text: `${state.greeting} — ${state.lang === 'ar' ? 'صممت بواسطة WishAI' : 'Designed by WishAI'}`,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share failed:', err);
            }
        } else {
            alert(state.lang === 'ar' ? 'المشاركة غير مدعومة في هذا المتصفح' : 'Sharing not supported in this browser');
        }
    };
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
            updatePreview();
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
    updatePreview();
}

function updatePreview() {
    const name = document.getElementById('user-name').value.trim();
    const greeting = document.getElementById('greeting-text').value.trim();
    
    document.getElementById('preview-greeting-text').textContent = greeting || (state.lang === 'ar' ? 'نص التهنئة' : 'Greeting Text');
    document.getElementById('preview-name-text').textContent = name ? (state.lang === 'ar' ? `بواسطة: ${name}` : `By: ${name}`) : '';
    
    // Update mini-card background based on occasion
    const previewCard = document.getElementById('mini-card-preview');
    if (state.occasion) {
        const colors = {
            ramadan: 'linear-gradient(135deg, #1e3a8a, #1e1b4b)',
            eid: 'linear-gradient(135deg, #065f46, #064e3b)',
            birthday: 'linear-gradient(135deg, #9d174d, #831843)',
            wedding: 'linear-gradient(135deg, #f59e0b, #d97706)',
            graduation: 'linear-gradient(135deg, #1f2937, #111827)',
            success: 'linear-gradient(135deg, #ca8a04, #a16207)',
            newborn: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            love: 'linear-gradient(135deg, #dc2626, #991b1b)',
            friendship: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            daily: 'linear-gradient(135deg, #22c55e, #15803d)',
            newyear: 'linear-gradient(135deg, #4b5563, #1f2937)',
            thankyou: 'linear-gradient(135deg, #6366f1, #4338ca)'
        };
        const bg = document.querySelector('.mini-card-bg');
        if (bg) bg.style.background = colors[state.occasion] || colors.daily;
    }
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
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({ 
                action: 'suggestions',
                contents: [{ parts: [{ text: prompt }] }] 
            })
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            console.error("[WishAI Suggestion Error]", errData);
            throw new Error(`API_${res.status}`);
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
        console.error("AI Error:", e);
        loadingEl.classList.add('hidden');
        
        // Final Fix: If AI fails or quota is exceeded, use local high-quality greetings
        const fallbacks = FALLBACK_GREETINGS[state.occasion] || ['مبارك عليكم', 'كل عام وأنتم بخير', 'أجمل التهاني'];
        
        list.innerHTML = `<div style="color:var(--important);text-align:center;padding:5px;font-size:0.75rem;margin-bottom:10px;">${state.lang === 'ar' ? 'تم تفعيل الاقتراحات الذكية الاحتياطية' : 'Smart backup suggestions active'}</div>`;
        
        fallbacks.forEach((s, i) => {
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
    }
    btn.classList.remove('loading');
}

async function generate() {
    console.log("🚀 WishAI Radical Engine — Status: IGNITION");

    const img = document.getElementById('generated-image');
    const loading = document.getElementById('loading-area');
    const result = document.getElementById('result-area');
    const greetingOverlay = document.getElementById('overlay-greeting');
    const nameOverlay = document.getElementById('overlay-name');

    // 1. Prepare UI
    img.style.opacity = '0.3';
    loading.classList.remove('hidden');
    result.classList.add('hidden');

    // 2. Build Sophisticated Prompt
    const occ = occasions.find(o => o.id === state.occasion);
    const occDesc = state.lang === 'ar' ? occ.descAr : occ.descEn;
    const langLabel = state.lang === 'ar' ? 'Arabic' : 'English';

    const prompt = `Create a stunning, high-resolution vertical greeting card.
Occasion: ${occDesc}.
Style: ${state.style} (${state.subStyle || 'Modern'}).
Quality: Cinematic lighting, 8k, professional.
Instructions: ${state.instructions || 'None'}.
TEXT TO RENDER: "${state.greeting}" (Main greeting) and "${state.name}" (Sender name).
Ensure ${langLabel} text is clear and artistic. Connections must be correct.`;

    function showImage(base64, mimeType) {
        const src = `data:${mimeType};base64,${base64}`;
        img.src = src;
        img.style.opacity = '1';
        loading.classList.add('hidden');
        result.classList.remove('hidden');
        saveCard(src, state.occasion, state.name);
        console.log("✅ Card Generated Successfully via Primary Engine.");
    }

    function showImageUrl(url) {
        const loader = new Image();
        loader.onload = () => {
            img.src = url;
            img.style.opacity = '1';
            loading.classList.add('hidden');
            result.classList.remove('hidden');
            saveCard(url, state.occasion, state.name);
            console.log("✅ Card Generated Successfully via Fallback Engine.");
        };
        loader.onerror = () => {
            console.error("Fallback URL failed to load.");
            fallback();
        };
        loader.src = url;
    }

    try {
        console.log("🚀 Initializing Nano Banana 2 (Imagen 3)...");
        
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000); 

        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
                action: 'generate',
                model: 'gemini-1.5-flash', // Required for Imagen 3 in many regions
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { 
                    responseModalities: ['IMAGE'],
                    temperature: 1.0 // Better for creative cards
                }
            })
        });
        clearTimeout(timeout);

        if (res.ok) {
            const data = await res.json();
            const imgPart = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
            if (imgPart) {
                showImage(imgPart.inlineData.data, imgPart.inlineData.mimeType || 'image/png');
                return;
            }
        }
        
        const errData = await res.json().catch(() => ({}));
        console.error("[WishAI Gen Error]", errData);
        throw new Error(errData.error?.message || "AI_REJECTED");

    } catch (e) {
        console.warn("Nano Banana 2 Unavailable. Check your Key and Google Region.");
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-overlay';
        errorMsg.innerHTML = `<div style="color:var(--important);background:rgba(0,0,0,0.8);padding:20px;border-radius:10px;text-align:center;">
            <b>عذراً، محرك نانو بنانا لم يستجب</b><br>
            <span style="font-size:0.8rem;">السبب: ${e.message}</span>
        </div>`;
        loading.appendChild(errorMsg);
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
    if (!confirm(state.lang === 'ar' ? 'هل أنت متأكد من حذف هذه البطاقة؟' : 'Are you sure you want to delete this card?')) return;
    let cards = JSON.parse(localStorage.getItem('wishai_cards') || '[]');
    cards = cards.filter(c => c.id !== id);
    localStorage.setItem('wishai_cards', JSON.stringify(cards));
    renderGallery();
}

document.addEventListener('DOMContentLoaded', init);
