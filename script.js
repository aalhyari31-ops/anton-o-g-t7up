document.addEventListener('DOMContentLoaded', () => {

    // --- Translations Data ---
    const translations = {
        en: {
            logo: "Eng.r Antonio GITHOP", nav_services: "Services", nav_process: "Process", nav_portfolio: "Portfolio", nav_testimonials: "Testimonials", nav_contact: "Contact",
            hero_title: "Shaping Spaces, Building Dreams", hero_subtitle: "Hyper-realistic 3D visualization and innovative architectural design that brings your vision to life.", hero_cta_drive: "View Projects on Drive", hero_cta_portfolio: "See Our Portfolio",
            services_title: "Core Expertise", service_1_title: "Architectural & Interior Design", service_1_desc: "Creating functional and aesthetic spaces that reflect your unique identity.", service_2_title: "3D Visualization & Rendering", service_2_desc: "Bringing concepts to life with hyper-realistic 3D models and interactive renderings.", service_3_title: "Smart Lighting & Electrical", service_3_desc: "Designing intelligent and efficient lighting and electrical plans for modern living.", service_4_title: "Commercial & Residential Planning", service_4_desc: "Expert planning for both commercial and residential spaces to maximize utility.", service_5_title: "Project Management & B2B", service_5_desc: "Providing strategic B2B consulting and end-to-end project management.", service_6_title: "Smart Home Solutions", service_6_desc: "Integrating cutting-edge technology to create intelligent and secure homes.",
            process_title: "Our Methodology", process_1_title: "Consultation & Briefing", process_1_desc: "Understanding your vision, requirements, and goals.", process_2_title: "Concept & Design", process_2_desc: "Developing initial concepts, sketches, and space planning.", process_3_title: "3D Visualization", process_3_desc: "Creating realistic 3D models for review and refinement.", process_4_title: "Execution & Delivery", process_4_desc: "Managing the project to ensure quality and timely completion.",
            portfolio_title: "Our Portfolio", filter_all: "All", filter_residential: "Residential", filter_commercial: "Commercial", filter_render: "3D Renders",
            testimonials_title: "What Our Clients Say", testimonial_1_text: "\"Antonio's team transformed our space with an incredible eye for detail. The 3D visualizations were a game-changer.\"", testimonial_1_author: "- CEO, Tech Innovators Inc.", testimonial_2_text: "\"The smart home integration was seamless and has fundamentally changed how we experience our home. Truly professional.\"", testimonial_2_author: "- J. Anderson, Private Residence",
            contact_title: "Let's Build Together", contact_info_title: "Get in Touch", contact_info_desc: "Have a project in mind or need a consultation? We are here to help you.", contact_form_name: "Your Name", contact_form_email: "Your Email", contact_form_message: "Your Message", contact_form_submit: "Send Message", custom_apps_text: "We can build a website for you and your business.", footer_text: `© ${new Date().getFullYear()} Eng.r Antonio GITHOP. All Rights Reserved.`,
        },
        ar: {
            logo: "م. أنطونيو جيثوب", nav_services: "الخدمات", nav_process: "المنهجية", nav_portfolio: "أعمالنا", nav_testimonials: "الشهادات", nav_contact: "تواصل معنا",
            hero_title: "نصمم المساحات، ونبني الأحلام", hero_subtitle: "تصور ثلاثي الأبعاد فائق الواقعية وتصميم معماري مبتكر يجسد رؤيتك.", hero_cta_drive: "شاهد المشاريع على درايف", hero_cta_portfolio: "تصفح أعمالنا",
            services_title: "الخبرات الأساسية", service_1_title: "تصميم معماري وداخلي", service_1_desc: "خلق مساحات عملية وجمالية تعكس هويتك الفريدة.", service_2_title: "تصور وعرض ثلاثي الأبعاد", service_2_desc: "تحويل المفاهيم إلى واقع ملموس بنماذج ثلاثية الأبعاد.", service_3_title: "الإضاءة والكهرباء الذكية", service_3_desc: "تصميم خطط إضاءة وكهرباء ذكية وفعالة للمعيشة العصرية.", service_4_title: "تخطيط تجاري وسكني", service_4_desc: "تخطيط احترافي للمساحات التجارية والسكنية لتحقيق أقصى استفادة.", service_5_title: "إدارة المشاريع و B2B", service_5_desc: "نقدم استشارات استراتيجية للشركات وإدارة متكاملة للمشاريع.", service_6_title: "حلول المنزل الذكي", service_6_desc: "دمج أحدث التقنيات لإنشاء منازل ذكية وآمنة.",
            process_title: "منهجية عملنا", process_1_title: "الاستشارة والاجتماع", process_1_desc: "فهم رؤيتك، متطلباتك، وأهدافك بشكل كامل.", process_2_title: "المفهوم والتصميم", process_2_desc: "تطوير المفاهيم الأولية والمخططات وتخطيط المساحات.", process_3_title: "التصور ثلاثي الأبعاد", process_3_desc: "إنشاء نماذج ثلاثية الأبعاد واقعية للمراجعة والتعديل.", process_4_title: "التنفيذ والتسليم", process_4_desc: "إدارة المشروع لضمان الجودة والانتهاء في الوقت المحدد.",
            portfolio_title: "معرض أعمالنا", filter_all: "الكل", filter_residential: "سكني", filter_commercial: "تجاري", filter_render: "تصور 3D",
            testimonials_title: "ماذا يقول عملاؤنا", testimonial_1_text: "\"قام فريق أنطونيو بتحويل مساحتنا بعين لا تصدق للتفاصيل وفهم عميق لعلامتنا التجارية. كانت النماذج ثلاثية الأبعاد نقطة تحول.\"", testimonial_1_author: "- الرئيس التنفيذي، شركة Tech Innovators", testimonial_2_text: "\"كان دمج المنزل الذكي سلسًا وغير طريقة عيشنا في منزلنا بشكل جذري. احترافية حقيقية من البداية إلى النهاية.\"", testimonial_2_author: "- ج. أندرسون، مسكن خاص",
            contact_title: "لنبدأ البناء معاً", contact_info_title: "تواصل معنا", contact_info_desc: "هل لديك مشروع أو تحتاج إلى استشارة؟ نحن هنا لمساعدتك.", contact_form_name: "الاسم", contact_form_email: "البريد الإلكتروني", contact_form_message: "رسالتك", contact_form_submit: "إرسال الرسالة", custom_apps_text: "نستطيع بناء موقع لك ولعملك.", footer_text: `© ${new Date().getFullYear()} م. أنطونيو جيثوب. جميع الحقوق محفوظة.`,
        },
        tr: {
            logo: "Müh. Antonio GITHOP", nav_services: "Hizmetler", nav_process: "Süreç", nav_portfolio: "Portfolyo", nav_testimonials: "Referanslar", nav_contact: "İletişim",
            hero_title: "Mekanları Şekillendir, Hayalleri İnşa Et", hero_subtitle: "Vizyonunuzu hayata geçiren hiper-gerçekçi 3D görselleştirme ve yenilikçi mimari tasarım.", hero_cta_drive: "Projeleri Drive'da Görüntüle", hero_cta_portfolio: "Portfolyomuzu Görün",
            services_title: "Temel Uzmanlık Alanları", service_1_title: "Mimari ve İç Tasarım", service_1_desc: "Benzersiz kimliğinizi yansıtan işlevsel ve estetik mekanlar yaratmak.", service_2_title: "3D Görselleştirme ve Render", service_2_desc: "Hiper-gerçekçi 3D modeller ile konseptleri hayata geçirmek.", service_3_title: "Akıllı Aydınlatma ve Elektrik", service_3_desc: "Modern yaşam için akıllı ve verimli aydınlatma ve elektrik planları tasarlamak.", service_4_title: "Ticari ve Konut Planlama", service_4_desc: "Kullanımı en üst düzeye çıkarmak için ticari ve konut alanları için uzman planlama.", service_5_title: "Proje Yönetimi ve B2B", service_5_desc: "Stratejik B2B danışmanlığı ve uçtan uca proje yönetimi sağlamak.", service_6_title: "Akıllı Ev Çözümleri", service_6_desc: "Akıllı ve güvenli evler yaratmak için en son teknolojiyi entegre etmek.",
            process_title: "Çalışma Metodolojimiz", process_1_title: "Danışmanlık ve Bilgilendirme", process_1_desc: "Vizyonunuzu, gereksinimlerinizi ve hedeflerinizi anlamak.", process_2_title: "Konsept ve Tasarım", process_2_desc: "İlk konseptleri, eskizleri ve alan planlamasını geliştirmek.", process_3_title: "3D Görselleştirme", process_3_desc: "İnceleme ve iyileştirme için gerçekçi 3D modeller oluşturmak.", process_4_title: "Uygulama ve Teslimat", process_4_desc: "Kaliteyi ve zamanında tamamlanmayı sağlamak için projeyi yönetmek.",
            portfolio_title: "Portfolyomuz", filter_all: "Tümü", filter_residential: "Konut", filter_commercial: "Ticari", filter_render: "3D Render",
            testimonials_title: "Müşterilerimiz Ne Diyor", testimonial_1_text: "\"Antonio'nun ekibi, inanılmaz bir detay gözüyle ve markamızı derinlemesine anlayarak mekanımızı dönüştürdü. 3D görseller oyunun kurallarını değiştirdi.\"", testimonial_1_author: "- CEO, Tech Innovators Inc.", testimonial_2_text: "\"Akıllı ev entegrasyonu kusursuzdu ve evimizi deneyimleme şeklimizi temelden değiştirdi. Baştan sona gerçekten profesyonel.\"", testimonial_2_author: "- J. Anderson, Özel Konut",
            contact_title: "Birlikte İnşa Edelim", contact_info_title: "İletişime Geçin", contact_info_desc: "Aklınızda bir proje mi var veya danışmanlığa mı ihtiyacınız var? Size yardımcı olmak için buradayız.", contact_form_name: "Adınız", contact_form_email: "E-posta Adresiniz", contact_form_message: "Mesajınız", contact_form_submit: "Mesaj Gönder", custom_apps_text: "Sizin ve işiniz için bir web sitesi oluşturabiliriz.", footer_text: `© ${new Date().getFullYear()} Müh. Antonio GITHOP. Tüm Hakları Saklıdır.`,
        }
    };

    // --- Language Switcher ---
    const langSelector = document.querySelector('.language-selector');
    const langDropdown = document.querySelector('.lang-dropdown');
    const currentLangSpan = document.getElementById('current-lang');
    
    langSelector.addEventListener('click', (e) => {
        e.stopPropagation();
        langSelector.classList.toggle('active')
    });
    langDropdown.addEventListener('click', e => {
        if (e.target.tagName === 'LI') {
            setLanguage(e.target.dataset.lang);
            langSelector.classList.remove('active');
        }
    });
    document.addEventListener('click', () => langSelector.classList.remove('active'));

    function setLanguage(lang) {
        document.documentElement.lang = lang;
        currentLangSpan.textContent = lang.toUpperCase();
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
            const key = el.dataset.langPlaceholder;
            if (translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });
    }

    // --- Header Scroll Effect ---
    const header = document.querySelector('.header');
    const mainContainer = document.getElementById('main-container');
    mainContainer.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', mainContainer.scrollTop > 50);
    });

    // --- Custom Cursor ---
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const hoverElements = document.querySelectorAll('a, button, .service-card, .portfolio-item, .lang-dropdown li, .filter-btn');
    
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        follower.style.left = e.clientX + 'px';
        follower.style.top = e.clientY + 'px';
    });
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('cursor-grow'));
        el.addEventListener('mouseleave', () => follower.classList.remove('cursor-grow'));
    });

    // --- Scroll Animations ---
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.2, root: mainContainer });
    document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));
    
    // --- Active Nav Link on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href').substring(1) === entry.target.id);
                });
            }
        });
    }, { root: mainContainer, rootMargin: '-40% 0px -60% 0px' });
    sections.forEach(sec => navObserver.observe(sec));
    
    // --- Portfolio Filter ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            portfolioItems.forEach(item => {
                item.classList.remove('show');
                item.classList.add('hide');
                if (filter === 'all' || item.dataset.category === filter) {
                    setTimeout(() => {
                        item.classList.remove('hide');
                        item.classList.add('show');
                    }, 10);
                }
            });
        });
    });

    // --- Contact Form ---
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        alert('Thank you for your message! This is a demo form.');
        contactForm.reset();
    });

    // --- Initial Language Set ---
    setLanguage('en');
});