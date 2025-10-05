'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. تحديد العناصر الأساسية ---
    const loader = document.querySelector('.loader');
    const header = document.querySelector('.header');
    const themeToggle = document.querySelector('.theme-toggle');
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('#primary-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const langSelector = document.querySelector('.language-selector');
    const langDropdown = document.querySelector('.lang-dropdown');
    const currentLangSpan = document.getElementById('current-lang');
    const langChevron = langSelector.querySelector('.fa-chevron-down');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.querySelector('.form-status');
    const backToTopBtn = document.querySelector('.back-to-top');
    const footerYear = document.getElementById('year');
    const splineViewer = document.getElementById('spline');
    const scrollContainer = document.querySelector('[data-scroll-container]');

    // --- 2. تهيئة السكرول الناعم (Locomotive Scroll) وربطه بـ GSAP ---
    const scroll = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true,
        tablet: { smooth: true },
        smartphone: { smooth: true }
    });

    gsap.registerPlugin(ScrollTrigger);
    scroll.on('scroll', ScrollTrigger.update);
    ScrollTrigger.scrollerProxy(scrollContainer, {
        scrollTop(value) {
            return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: scrollContainer.style.transform ? "transform" : "fixed"
    });

    // --- 3. آلية تحميل الصفحة والأنيميشن الأولي (مُحسَّنة) ---
    const initPage = () => {
        loader.classList.add('hidden');
        const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.2 } });
        tl.to(header, { y: '0%', duration: 1, ease: 'power2.out' }, 0.5)
          .from('.hero-title', { opacity: 0, y: 40 }, 0.8)
          .from('.hero-subtitle', { opacity: 0, y: 40 }, '-=0.9')
          .from('.hero-buttons > *', { opacity: 0, y: 40, stagger: 0.15 }, '-=0.8');
        initScrollAnimations();
        scroll.update();
        ScrollTrigger.refresh();
    };

    window.addEventListener('load', initPage);
    setTimeout(() => { if (!loader.classList.contains('hidden')) { initPage(); } }, 7000);

    if (splineViewer) {
        splineViewer.url = "https://prod.spline.design/AV2e0-V3-p75A2iJ/scene.splinecode";
    }

    // --- 4. الأنيميشن عند السكرول ---
    const initScrollAnimations = () => {
        document.querySelectorAll('.section-title').forEach(title => {
            gsap.from(title, { scrollTrigger: { trigger: title, scroller: scrollContainer, start: 'top 85%', toggleActions: 'play none none none' }, opacity: 0, y: 50, duration: 0.8, ease: 'power2.out' });
        });
        gsap.from('.process-step', { scrollTrigger: { trigger: '.process-timeline', scroller: scrollContainer, start: 'top 80%', toggleActions: 'play none none none' }, opacity: 0, scale: 0.8, duration: 0.5, stagger: 0.15 });
        document.querySelectorAll('.portfolio-item').forEach((item, index) => {
            gsap.from(item, { scrollTrigger: { trigger: item, scroller: scrollContainer, start: 'top 90%', toggleActions: 'play none none none' }, opacity: 0, x: index % 2 === 0 ? -60 : 60, duration: 1, ease: 'power3.out' });
        });
        gsap.from('.testimonial-card', { scrollTrigger: { trigger: '.testimonials-grid', scroller: scrollContainer, start: 'top 80%', toggleActions: 'play none none none' }, opacity: 0, y: 50, stagger: 0.2, duration: 0.7 });
        gsap.from('.footer-content > *', { scrollTrigger: { trigger: '.footer', scroller: scrollContainer, start: 'top 95%', toggleActions: 'play none none none' }, opacity: 0, y: 40, stagger: 0.2, duration: 0.8 });
    };
    
    // --- 5. كل الوظائف الأخرى ---
    if (footerYear) footerYear.textContent = new Date().getFullYear();

    scroll.on('scroll', (instance) => {
        header.classList.toggle('scrolled', instance.scroll.y > 50);
    });

    const toggleMobileMenu = () => { navbar.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', navbar.classList.contains('open')); };
    const closeMobileMenu = () => { navbar.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); };

    let currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        themeToggle.querySelector('i').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', theme);
        currentTheme = theme;
    };
    const toggleTheme = () => applyTheme(currentTheme === 'dark' ? 'light' : 'dark');

    // ✅ تم تحديث الترجمة هنا
    const translations = {
        en: {logo: "Eng.r Antonio GITHOP", nav_process: "Process", nav_portfolio: "Portfolio", nav_testimonials: "Testimonials", nav_contact: "Contact", hero_title: "Masterful Designs, Meticulously Crafted.", hero_subtitle: "We specialize in bespoke architectural and interior solutions, transforming your vision into a timeless reality with hyper-realistic 3D visualization and unparalleled attention to detail.", hero_cta_drive: "View More on Google Drive", hero_cta_portfolio: "See Our Portfolio", process_title: "Our Methodology", process_1_title: "Consultation & Briefing", process_1_desc: "Understanding your vision, requirements, and goals.", process_2_title: "Concept & Design", process_2_desc: "Developing initial concepts, sketches, and space planning.", process_3_title: "3D Visualization", process_3_desc: "Creating realistic 3D models for review and refinement.", process_4_title: "Execution & Delivery", process_4_desc: "Managing the project to ensure quality and timely completion.", portfolio_title: "Our Portfolio", testimonials_title: "What Our Clients Say", testimonial_1_text: "\"Antonio's team transformed our space with an incredible eye for detail. The 3D visualizations were a game-changer.\"", testimonial_1_author: "- CEO, Tech Innovators Inc.", testimonial_2_text: "\"The smart home integration was seamless and has fundamentally changed how we experience our home. Truly professional.\"", testimonial_2_author: "- J. Anderson, Private Residence", contact_title: "Let's Build Together", contact_info_title: "Get in Touch", contact_info_desc: "Have a project in mind or need a consultation? We are here to help you.", custom_apps_text: "We can build a website for you and your business.", contact_form_name: "Your Name", contact_form_email: "Your Email", contact_form_message: "Your Message", contact_form_submit: "Send Message", footer_text: `© ${new Date().getFullYear()} Eng.r Antonio GITHOP. All Rights Reserved.`,},
        ar: {logo: "م. أنطونيو جيثوب", nav_process: "منهجيتنا", nav_portfolio: "أعمالنا", nav_testimonials: "آراء العملاء", nav_contact: "اتصل بنا", hero_title: "تصاميم بارعة، منفذة بإتقان.", hero_subtitle: "نحن متخصصون في الحلول المعمارية والداخلية المخصصة، نحول رؤيتك إلى واقع خالد من خلال تصورات ثلاثية الأبعاد فائقة الواقعية واهتمام لا مثيل له بالتفاصيل.", hero_cta_drive: "شاهد المزيد على Google Drive", hero_cta_portfolio: "تصفح أعمالنا", process_title: "منهجيتنا", process_1_title: "الاستشارة والتعريف", process_1_desc: "فهم رؤيتك ومتطلباتك وأهدافك.", process_2_title: "المفهوم والتصميم", process_2_desc: "تطوير المفاهيم الأولية والرسومات وتخطيط المساحات.", process_3_title: "التصور ثلاثي الأبعاد", process_3_desc: "إنشاء نماذج ثلاثية الأبعاد واقعية للمراجعة والتعديل.", process_4_title: "التنفيذ والتسليم", process_4_desc: "إدارة المشروع لضمان الجودة والإنجاز في الوقت المحدد.", portfolio_title: "معرض أعمالنا", testimonials_title: "ماذا يقول عملاؤنا", testimonial_1_text: "\"فريق أنطونيو حوّل مساحتنا بعين لا تصدق للتفاصيل. التصورات ثلاثية الأبعاد كانت نقلة نوعية.\"", testimonial_1_author: "- الرئيس التنفيذي، Tech Innovators Inc.", testimonial_2_text: "\"تكامل المنزل الذكي كان سلسًا وغيّر بشكل جذري طريقة تجربتنا لمنزلنا. احترافية حقيقية.\"", testimonial_2_author: "- ج. أندرسون، إقامة خاصة", contact_title: "لنبنِ معًا", contact_info_title: "تواصل معنا", contact_info_desc: "هل لديك مشروع في ذهنك أو تحتاج إلى استشارة؟ نحن هنا لمساعدتك.", custom_apps_text: "يمكننا بناء موقع إلكتروني لك ولعملك.", contact_form_name: "اسمك", contact_form_email: "بريدك الإلكتروني", contact_form_message: "رسالتك", contact_form_submit: "إرسال الرسالة", footer_text: `© ${new Date().getFullYear()} م. أنطونيو جيثوب. جميع الحقوق محفوظة.`,},
        tr: {logo: "Müh. Antonio GITHOP", nav_process: "Süreç", nav_portfolio: "Portföy", nav_testimonials: "Yorumlar", nav_contact: "İletişim", hero_title: "Usta Tasarımlar, Titizlikle Hazırlanmış.", hero_subtitle: "Kişiye özel mimari ve iç mekan çözümlerinde uzmanız, vizyonunuzu hiper-gerçekçi 3D görselleştirme ve eşsiz detaylara gösterilen özenle zamansız bir gerçeğe dönüştürüyoruz.", hero_cta_drive: "Google Drive'da Daha Fazlasını Görüntüle", hero_cta_portfolio: "Portfolyomuzu Görün", process_title: "Metodolojimiz", process_1_title: "Danışmanlık ve Bilgilendirme", process_1_desc: "Vizyonunuzu, gereksinimlerinizi ve hedeflerinizi anlama.", process_2_title: "Konsept ve Tasarım", process_2_desc: "İlk konseptleri, eskizleri ve alan planlamasını geliştirme.", process_3_title: "3D Görselleştirme", process_3_desc: "İnceleme ve iyileştirme için gerçekçi 3D modeller oluşturma.", process_4_title: "Uygulama ve Teslimat", process_4_desc: "Kaliteyi ve zamanında tamamlanmayı sağlamak için projeyi yönetme.", portfolio_title: "Portfolyomuz", testimonials_title: "Müşterilerimiz Ne Diyor", testimonial_1_text: "\"Antonio'nun ekibi, inanılmaz bir detay gözüyle mekanımızı dönüştürdü. 3D görselleştirmeler oyunun kurallarını değiştirdi.\"", testimonial_1_author: "- CEO, Tech Innovators Inc.", testimonial_2_text: "\"Akıllı ev entegrasyonu sorunsuzdu ve evimizi deneyimleme şeklimizi temelden değiştirdi. Gerçekten profesyonel.\"", testimonial_2_author: "- J. Anderson, Özel Konut", contact_title: "Birlikte İnşa Edelim", contact_info_title: "İletişime Geçin", contact_info_desc: "Aklınızda bir proje mi var veya danışmanlığa mı ihtiyacınız var? Size yardımcı olmak için buradayız.", custom_apps_text: "Sizin ve işletmeniz için bir web sitesi oluşturabiliriz.", contact_form_name: "Adınız", contact_form_email: "E-postanız", contact_form_message: "Mesajınız", contact_form_submit: "Mesaj Gönder", footer_text: `© ${new Date().getFullYear()} Müh. Antonio GITHOP. Tüm Hakları Saklıdır.`,}
    };
    const applyLanguage = (lang) => {
        const langData = translations[lang];
        document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.querySelectorAll('[data-lang-key]').forEach(el => { const key = el.getAttribute('data-lang-key'); if (langData[key]) el.textContent = langData[key]; });
        document.querySelectorAll('[data-lang-placeholder]').forEach(el => { const key = el.getAttribute('data-lang-placeholder'); if (langData[key]) el.placeholder = langData[key]; });
        currentLangSpan.textContent = lang.toUpperCase(); localStorage.setItem('language', lang);
        scroll.update();
    };
    const currentLanguage = localStorage.getItem('language') || 'en';

    const handleFormSubmit = async (e) => {
        e.preventDefault(); const formData = new FormData(contactForm); if (formData.get('website')) return;
        const object = { access_key: "YOUR_ACCESS_KEY_HERE", name: formData.get("name"), email: formData.get("email"), message: formData.get("message"), };
        const json = JSON.stringify(object); formStatus.textContent = "Sending..."; formStatus.style.color = 'var(--muted)';
        try {
            const response = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: json });
            const result = await response.json();
            if (result.success) { formStatus.textContent = "Message sent successfully!"; formStatus.style.color = 'green'; contactForm.reset(); } else { throw new Error(result.message); }
        } catch (error) { formStatus.textContent = "An error occurred. Please try again."; formStatus.style.color = 'red'; } finally { setTimeout(() => { formStatus.textContent = ""; }, 5000); }
    };

    scroll.on('scroll', (instance) => { backToTopBtn.classList.toggle('show', instance.scroll.y > window.innerHeight); });

    const setupCursor = () => {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        const cursor = document.querySelector('.cursor'); const follower = document.querySelector('.cursor-follower');
        window.addEventListener('mousemove', e => { gsap.to(cursor, { duration: 0.2, x: e.clientX, y: e.clientY }); gsap.to(follower, { duration: 0.6, x: e.clientX, y: e.clientY, ease: 'power2.out' }); });
        document.querySelectorAll('a, button, .service-card, .filter-btn, .lang-dropdown li').forEach(el => { el.addEventListener('mouseenter', () => gsap.to(follower, { scale: 1.5, background: 'rgba(205,164,94,0.2)' })); el.addEventListener('mouseleave', () => gsap.to(follower, { scale: 1, background: 'transparent' })); });
    };

    // --- 6. ربط الأحداث ---
    if (menuToggle) menuToggle.addEventListener('click', toggleMobileMenu);
    if (navbar) navbar.addEventListener('click', (e) => { if (e.target.matches('.nav-link')) closeMobileMenu(); });
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (langSelector) {
        langSelector.addEventListener('click', (e) => { e.stopPropagation(); const isOpen = langSelector.classList.toggle('open'); gsap.to(langChevron, { rotation: isOpen ? 180 : 0, duration: 0.3 }); });
        langDropdown.addEventListener('click', (e) => { if (e.target.matches('[data-lang]')) { applyLanguage(e.target.dataset.lang); } });
    }
    document.addEventListener('click', () => { if (langSelector && langSelector.classList.contains('open')) { langSelector.classList.remove('open'); gsap.to(langChevron, { rotation: 0, duration: 0.3 }); } });
    if (contactForm) contactForm.addEventListener('submit', handleFormSubmit);
    if (backToTopBtn) backToTopBtn.addEventListener('click', () => scroll.scrollTo(0));
    
    // ✅ إصلاح مشكلة التنقل بين الأقسام
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                scroll.scrollTo(targetElement);
                if (navbar.classList.contains('open')) { // For mobile
                    closeMobileMenu();
                }
            }
        });
    });

    // --- 7. تشغيل الوظائف الأولية ---
    applyTheme(currentTheme);
    applyLanguage(currentLanguage);
    setupCursor();
});
