/*
 * Eng.r Antonio GITHOP - Portfolio Website Script
 *
 * This script handles all dynamic functionality for the site including:
 * - Page Loader
 * - Locomotive Scroll for smooth scrolling & parallax
 * - GSAP professional animations
 * - Theme (Dark/Light) switching and persistence
 * - Multi-language support and persistence
 * - Mobile navigation toggle
 * - Header styling on scroll
 * - Portfolio item filtering
 * - Contact form submission (using Web3Forms)
 * - Custom mouse cursor
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // --- Element Selections ---
  const loader = document.querySelector('.loader');
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link');
  const themeToggle = document.querySelector('.theme-toggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const navbar = document.querySelector('#primary-nav');
  const langSelector = document.querySelector('.language-selector');
  const langDropdown = document.querySelector('.lang-dropdown');
  const currentLangSpan = document.getElementById('current-lang');
  const langChevron = langSelector.querySelector('.fa-chevron-down');
  const filterBtns = document.querySelector('.portfolio-filters');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.querySelector('.form-status');
  const backToTopBtn = document.querySelector('.back-to-top');
  const footerYear = document.getElementById('year');
  const splineViewer = document.getElementById('spline');

  // --- Smooth Scroll & GSAP Integration ---
  const scroll = new LocomotiveScroll({
      el: document.querySelector('[data-scroll-container]'),
      smooth: true,
      tablet: { smooth: true },
      smartphone: { smooth: true }
  });

  scroll.on('scroll', ScrollTrigger.update);

  ScrollTrigger.scrollerProxy('[data-scroll-container]', {
      scrollTop(value) {
          return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: document.querySelector('[data-scroll-container]').style.transform ? "transform" : "fixed"
  });

  // --- Page Loader & Initial Animations ---
  const initPageLoad = () => {
    gsap.set(header, { y: '-100%' });
    gsap.set('.hero-title, .hero-subtitle, .hero-buttons > *', { opacity: 0, y: 40 });

    // Hide loader
    loader.classList.add('hidden');

    // Animate content in after loader is gone
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.2 } });
    tl.to(header, { y: '0%', duration: 1, ease: 'power2.out' }, 0.5)
      .to('.hero-title', { opacity: 1, y: 0 }, 0.8)
      .to('.hero-subtitle', { opacity: 1, y: 0 }, '-=0.9')
      .to('.hero-buttons > *', { opacity: 1, y: 0, stagger: 0.15 }, '-=0.8');
  };
  
  window.addEventListener('load', initPageLoad);

  // --- Scroll-Triggered Animations ---
  const initScrollAnimations = () => {
      // Re-calculate ScrollTrigger positions on Locomotive scroll update
      ScrollTrigger.addEventListener('refresh', () => scroll.update());
      ScrollTrigger.refresh();

      // Animate Section Titles
      document.querySelectorAll('.section-title').forEach(title => {
          gsap.from(title, {
              scrollTrigger: { trigger: title, scroller: '[data-scroll-container]', start: 'top 85%', toggleActions: 'play none none none' },
              opacity: 0, y: 50, duration: 0.8, ease: 'power2.out'
          });
      });

      // Staggered Cards for Services
      gsap.from('.service-card', {
          scrollTrigger: { trigger: '.services-grid', scroller: '[data-scroll-container]', start: 'top 80%', toggleActions: 'play none none none' },
          opacity: 0, y: 50, duration: 0.5, stagger: 0.1
      });

      // Staggered Steps for Process
      gsap.from('.process-step', {
          scrollTrigger: { trigger: '.process-timeline', scroller: '[data-scroll-container]', start: 'top 80%', toggleActions: 'play none none none' },
          opacity: 0, scale: 0.8, duration: 0.5, stagger: 0.15
      });
      
      // Portfolio Items Parallax Reveal
      document.querySelectorAll('.portfolio-item').forEach((item, index) => {
          gsap.from(item, {
            scrollTrigger: { trigger: item, scroller: '[data-scroll-container]', start: 'top 90%', toggleActions: 'play none none none' },
            opacity: 0,
            x: index % 2 === 0 ? -60 : 60,
            duration: 1,
            ease: 'power3.out'
          });
      });

      // Testimonials Animation
      gsap.from('.testimonial-card', {
        scrollTrigger: { trigger: '.testimonials-grid', scroller: '[data-scroll-container]', start: 'top 80%', toggleActions: 'play none none none' },
        opacity: 0, y: 50, stagger: 0.2, duration: 0.7
      });

      // Footer Animation
      gsap.from('.footer-content > *', {
        scrollTrigger: { trigger: '.footer', scroller: '[data-scroll-container]', start: 'top 95%', toggleActions: 'play none none none' },
        opacity: 0, y: 40, stagger: 0.2, duration: 0.8
      });
  };

  // --- Initial Setup ---
  if (footerYear) footerYear.textContent = new Date().getFullYear();
  if (splineViewer) setTimeout(() => { splineViewer.load("https://prod.spline.design/AV2e0-V3-p75A2iJ/scene.splinecode").then(() => splineViewer.classList.add('loaded')); }, 500);

  // --- Header Scroll Effect ---
  let lastScrollY = 0;
  scroll.on('scroll', (instance) => {
    const currentScrollY = instance.scroll.y;
    header.classList.toggle('scrolled', currentScrollY > 50);
    // You could add hide/show on scroll direction change here if desired
    lastScrollY = currentScrollY;
  });

  // --- Mobile Navigation ---
  const toggleMobileMenu = () => { navbar.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', navbar.classList.contains('open')); };
  const closeMobileMenu = () => { navbar.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); };

  // --- Theme Toggle ---
  let currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const applyTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      themeToggle.querySelector('i').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      localStorage.setItem('theme', theme);
      currentTheme = theme;
  };
  const toggleTheme = () => applyTheme(currentTheme === 'dark' ? 'light' : 'dark');

  // --- Language Switcher ---
  const translations = {
    // ... (All your translations remain here, unchanged)
    en: {logo: "Eng.r Antonio GITHOP", nav_services: "Services", nav_process: "Process", nav_portfolio: "Portfolio", nav_testimonials: "Testimonials", nav_contact: "Contact", hero_title: "Shaping Spaces, Building Dreams", hero_subtitle: "Hyper-realistic 3D visualization and innovative architectural design that brings your vision to life.", hero_cta_drive: "View Projects on Drive", hero_cta_portfolio: "See Our Portfolio", services_title: "Core Expertise", service_1_title: "Architectural & Interior Design", service_1_desc: "Creating functional and aesthetic spaces that reflect your unique identity.", service_2_title: "3D Visualization & Rendering", service_2_desc: "Bringing concepts to life with hyper-realistic 3D models and interactive renderings.", service_3_title: "Smart Lighting & Electrical", service_3_desc: "Designing intelligent and efficient lighting and electrical plans for modern living.", service_4_title: "Commercial & Residential Planning", service_4_desc: "Expert planning for both commercial and residential spaces to maximize utility.", service_5_title: "Project Management & B2B", service_5_desc: "Providing strategic B2B consulting and end-to-end project management.", service_6_title: "Smart Home Solutions", service_6_desc: "Integrating cutting-edge technology to create intelligent and secure homes.", process_title: "Our Methodology", process_1_title: "Consultation & Briefing", process_1_desc: "Understanding your vision, requirements, and goals.", process_2_title: "Concept & Design", process_2_desc: "Developing initial concepts, sketches, and space planning.", process_3_title: "3D Visualization", process_3_desc: "Creating realistic 3D models for review and refinement.", process_4_title: "Execution & Delivery", process_4_desc: "Managing the project to ensure quality and timely completion.", portfolio_title: "Our Portfolio", filter_all: "All", filter_residential: "Residential", filter_commercial: "Commercial", filter_render: "3D Renders", testimonials_title: "What Our Clients Say", testimonial_1_text: "\"Antonio's team transformed our space with an incredible eye for detail. The 3D visualizations were a game-changer.\"", testimonial_1_author: "- CEO, Tech Innovators Inc.", testimonial_2_text: "\"The smart home integration was seamless and has fundamentally changed how we experience our home. Truly professional.\"", testimonial_2_author: "- J. Anderson, Private Residence", contact_title: "Let's Build Together", contact_info_title: "Get in Touch", contact_info_desc: "Have a project in mind or need a consultation? We are here to help you.", custom_apps_text: "We can build a website for you and your business.", contact_form_name: "Your Name", contact_form_email: "Your Email", contact_form_message: "Your Message", contact_form_submit: "Send Message", footer_text: `© ${new Date().getFullYear()} Eng.r Antonio GITHOP. All Rights Reserved.`,},
    ar: {logo: "م. أنطونيو جيثوب", nav_services: "خدماتنا", nav_process: "منهجيتنا", nav_portfolio: "أعمالنا", nav_testimonials: "آراء العملاء", nav_contact: "اتصل بنا", hero_title: "نصمم المساحات، ونبني الأحلام", hero_subtitle: "تصور ثلاثي الأبعاد واقعي وتصميم معماري مبتكر يجسد رؤيتك.", hero_cta_drive: "شاهد المشاريع على Drive", hero_cta_portfolio: "تصفح أعمالنا", services_title: "خبراتنا الأساسية", service_1_title: "التصميم المعماري والداخلي", service_1_desc: "نصنع مساحات وظيفية وجمالية تعكس هويتك الفريدة.", service_2_title: "التصور والعرض ثلاثي الأبعاد", service_2_desc: "نُحيي المفاهيم بنماذج ثلاثية الأبعاد واقعية وعروض تفاعلية.", service_3_title: "الإضاءة الذكية والكهرباء", service_3_desc: "نصمم خطط إضاءة وكهرباء ذكية وفعالة للمعيشة العصرية.", service_4_title: "التخطيط التجاري والسكني", service_4_desc: "تخطيط احترافي للمساحات التجارية والسكنية لتعظيم الاستفادة منها.", service_5_title: "إدارة المشاريع و B2B", service_5_desc: "نقدم استشارات استراتيجية بين الشركات وإدارة شاملة للمشاريع.", service_6_title: "حلول المنزل الذكي", service_6_desc: "ندمج أحدث التقنيات لإنشاء منازل ذكية وآمنة.", process_title: "منهجيتنا", process_1_title: "الاستشارة والتعريف", process_1_desc: "فهم رؤيتك ومتطلباتك وأهدافك.", process_2_title: "المفهوم والتصميم", process_2_desc: "تطوير المفاهيم الأولية والرسومات وتخطيط المساحات.", process_3_title: "التصور ثلاثي الأبعاد", process_3_desc: "إنشاء نماذج ثلاثية الأبعاد واقعية للمراجعة والتعديل.", process_4_title: "التنفيذ والتسليم", process_4_desc: "إدارة المشروع لضمان الجودة والإنجاز في الوقت المحدد.", portfolio_title: "معرض أعمالنا", filter_all: "الكل", filter_residential: "سكني", filter_commercial: "تجاري", filter_render: "تصور ثلاثي الأبعاد", testimonials_title: "ماذا يقول عملاؤنا", testimonial_1_text: "\"فريق أنطونيو حوّل مساحتنا بعين لا تصدق للتفاصيل. التصورات ثلاثية الأبعاد كانت نقلة نوعية.\"", testimonial_1_author: "- الرئيس التنفيذي، Tech Innovators Inc.", testimonial_2_text: "\"تكامل المنزل الذكي كان سلسًا وغيّر بشكل جذري طريقة تجربتنا لمنزلنا. احترافية حقيقية.\"", testimonial_2_author: "- ج. أندرسون، إقامة خاصة", contact_title: "لنبنِ معًا", contact_info_title: "تواصل معنا", contact_info_desc: "هل لديك مشروع في ذهنك أو تحتاج إلى استشارة؟ نحن هنا لمساعدتك.", custom_apps_text: "يمكننا بناء موقع إلكتروني لك ولعملك.", contact_form_name: "اسمك", contact_form_email: "بريدك الإلكتروني", contact_form_message: "رسالتك", contact_form_submit: "إرسال الرسالة", footer_text: `© ${new Date().getFullYear()} م. أنطونيو جيثوب. جميع الحقوق محفوظة.`,},
    tr: {logo: "Müh. Antonio GITHOP", nav_services: "Hizmetler", nav_process: "Süreç", nav_portfolio: "Portföy", nav_testimonials: "Yorumlar", nav_contact: "İletişim", hero_title: "Mekanları Şekillendiriyor, Hayalleri İnşa Ediyoruz", hero_subtitle: "Vizyonunuzu hayata geçiren hiper-gerçekçi 3D görselleştirme ve yenilikçi mimari tasarım.", hero_cta_drive: "Projeleri Drive'da Görüntüle", hero_cta_portfolio: "Portfolyomuzu Görün", services_title: "Temel Uzmanlık Alanlarımız", service_1_title: "Mimari ve İç Tasarım", service_1_desc: "Benzersiz kimliğinizi yansıtan fonksiyonel ve estetik mekanlar yaratıyoruz.", service_2_title: "3D Görselleştirme ve Render", service_2_desc: "Hiper-gerçekçi 3D modeller ve interaktif renderlarla konseptleri hayata geçiriyoruz.", service_3_title: "Akıllı Aydınlatma ve Elektrik", service_3_desc: "Modern yaşam için akıllı ve verimli aydınlatma ve elektrik planları tasarlıyoruz.", service_4_title: "Ticari ve Konut Planlaması", service_4_desc: "Kullanımı en üst düzeye çıkarmak için hem ticari hem de konut alanları için uzman planlama.", service_5_title: "Proje Yönetimi ve B2B", service_5_desc: "Stratejik B2B danışmanlığı ve uçtan uca proje yönetimi sağlıyoruz.", service_6_title: "Akıllı Ev Çözümleri", service_6_desc: "Akıllı ve güvenli evler yaratmak için en son teknolojiyi entegre ediyoruz.", process_title: "Metodolojimiz", process_1_title: "Danışmanlık ve Bilgilendirme", process_1_desc: "Vizyonunuzu, gereksinimlerinizi ve hedeflerinizi anlama.", process_2_title: "Konsept ve Tasarım", process_2_desc: "İlk konseptleri, eskizleri ve alan planlamasını geliştirme.", process_3_title: "3D Görselleştirme", process_3_desc: "İnceleme ve iyileştirme için gerçekçi 3D modeller oluşturma.", process_4_title: "Uygulama ve Teslimat", process_4_desc: "Kaliteyi ve zamanında tamamlanmayı sağlamak için projeyi yönetme.", portfolio_title: "Portfolyomuz", filter_all: "Tümü", filter_residential: "Konut", filter_commercial: "Ticari", filter_render: "3D Renderlar", testimonials_title: "Müşterilerimiz Ne Diyor", testimonial_1_text: "\"Antonio'nun ekibi, inanılmaz bir detay gözüyle mekanımızı dönüştürdü. 3D görselleştirmeler oyunun kurallarını değiştirdi.\"", testimonial_1_author: "- CEO, Tech Innovators Inc.", testimonial_2_text: "\"Akıllı ev entegrasyonu sorunsuzdu ve evimizi deneyimleme şeklimizi temelden değiştirdi. Gerçekten profesyonel.\"", testimonial_2_author: "- J. Anderson, Özel Konut", contact_title: "Birlikte İnşa Edelim", contact_info_title: "İletişime Geçin", contact_info_desc: "Aklınızda bir proje mi var veya danışmanlığa mı ihtiyacınız var? Size yardımcı olmak için buradayız.", custom_apps_text: "Sizin ve işletmeniz için bir web sitesi oluşturabiliriz.", contact_form_name: "Adınız", contact_form_email: "E-postanız", contact_form_message: "Mesajınız", contact_form_submit: "Mesaj Gönder", footer_text: `© ${new Date().getFullYear()} Müh. Antonio GITHOP. Tüm Hakları Saklıdır.`,}
  };
  const applyLanguage = (lang) => {
      const langData = translations[lang];
      document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.querySelectorAll('[data-lang-key]').forEach(el => { const key = el.getAttribute('data-lang-key'); if (langData[key]) el.textContent = langData[key]; });
      document.querySelectorAll('[data-lang-placeholder]').forEach(el => { const key = el.getAttribute('data-lang-placeholder'); if (langData[key]) el.placeholder = langData[key]; });
      currentLangSpan.textContent = lang.toUpperCase(); localStorage.setItem('language', lang);
  };
  const currentLanguage = localStorage.getItem('language') || 'en';

  // --- Portfolio Filtering ---
  const handleFilterClick = (e) => {
    const target = e.target; if (!target.matches('.filter-btn')) return;
    filterBtns.querySelector('.active').classList.remove('active'); target.classList.add('active');
    const filterValue = target.dataset.filter;
    portfolioItems.forEach(item => { const itemCategory = item.dataset.category; const shouldShow = filterValue === 'all' || filterValue === itemCategory; item.classList.toggle('hide', !shouldShow); item.classList.toggle('show', shouldShow); });
  };

  // --- Contact Form Submission ---
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

  // --- Back to Top Button ---
  scroll.on('scroll', (instance) => { backToTopBtn.classList.toggle('show', instance.scroll.y > window.innerHeight); });

  // --- Custom Cursor ---
  const setupCursor = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const cursor = document.querySelector('.cursor'); const follower = document.querySelector('.cursor-follower');
    window.addEventListener('mousemove', e => { gsap.to(cursor, { duration: 0.2, x: e.clientX, y: e.clientY }); gsap.to(follower, { duration: 0.6, x: e.clientX, y: e.clientY, ease: 'power2.out' }); });
    document.querySelectorAll('a, button, .service-card, .filter-btn, .lang-dropdown li').forEach(el => { el.addEventListener('mouseenter', () => gsap.to(follower, { scale: 1.5, background: 'rgba(205,164,94,0.2)' })); el.addEventListener('mouseleave', () => gsap.to(follower, { scale: 1, background: 'transparent' })); });
  };

  // --- Event Listeners ---
  if (menuToggle) menuToggle.addEventListener('click', toggleMobileMenu);
  if (navbar) navbar.addEventListener('click', (e) => { if (e.target.matches('.nav-link')) closeMobileMenu(); });
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  
  if (langSelector) {
    langSelector.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langSelector.classList.toggle('open');
      gsap.to(langChevron, { rotation: isOpen ? 180 : 0, duration: 0.3 });
    });
    langDropdown.addEventListener('click', (e) => { if (e.target.matches('[data-lang]')) { applyLanguage(e.target.dataset.lang); } });
  }
  document.addEventListener('click', () => { if (langSelector && langSelector.classList.contains('open')) { langSelector.classList.remove('open'); gsap.to(langChevron, { rotation: 0, duration: 0.3 }); } });

  if (filterBtns) filterBtns.addEventListener('click', handleFilterClick);
  if (contactForm) contactForm.addEventListener('submit', handleFormSubmit);
  if (backToTopBtn) backToTopBtn.addEventListener('click', () => scroll.scrollTo(0));

  // --- Initial Function Calls ---
  applyTheme(currentTheme);
  applyLanguage(currentLanguage);
  setupCursor();
  initScrollAnimations();
});
