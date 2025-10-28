// =================================================================
            // === الحل الجذري للسلاسة (IntersectionObserver Logic) ===
            // =================================================================

            // --- 1. متغيرات لتخزين "حالة" الرسوم المتحركة ---
            let particleAnimationLoopId = null;
            const stepAnimationLoops = {
                canvas1: null, canvas2: null, canvas3: null, canvas4: null
            };
            const stepCanvasElements = {
                canvas1: document.getElementById('canvas1'),
                canvas2: document.getElementById('canvas2'),
                canvas3: document.getElementById('canvas3'),
                canvas4: document.getElementById('canvas4')
            };

            // --- 2. تعديل دوال الـ Canvas لتكون قابلة للإيقاف ---

            // (الخلفية الثابتة)
            function stopBackgroundParticles() {
                if (particleAnimationLoopId) {
                    cancelAnimationFrame(particleAnimationLoopId);
                    particleAnimationLoopId = null;
                }
            }
            // (ملاحظة: دالة animateBackgroundParticles موجودة عندك أصلاً)
            // فقط تأكد من أن السطر الأخير فيها هو:
            // particleAnimationLoopId = requestAnimationFrame(animateBackgroundParticles);
            // بدلاً من:
            // requestAnimationFrame(animateBackgroundParticles);
            // (سأفترض أنك قمت بهذا التعديل)

            // (الخطوات الأربعة)
            // نحتاج لتعديل كل دالة من دوال animateStep
            // هذا مثال لـ animateStep1 (طبق نفس المبدأ على 2, 3, 4)

            /* * اذهب إلى دالة animateStep1(canvas) الأصلية 
             * وعدل السطر الأخير فيها 
             * من: requestAnimationFrame(draw);
             * إلى: stepAnimationLoops.canvas1 = requestAnimationFrame(draw);
            */
           
            // مثال لكيف يجب أن تبدو دالة animateStep1 بعد التعديل:
            /*
            function animateStep1(canvas) {
                const ctx = canvas.getContext('2d');
                let time = 0;
                const canvasSize = Math.min(canvas.width, canvas.height);
                const scaleFactor = canvasSize / 300;
                
                function draw() {
                    if (!canvas.isConnected || !canvas.width) { 
                        stepAnimationLoops.canvas1 = requestAnimationFrame(draw); // استمر إذا كان الكانفاس غير جاهز
                        return; 
                    }
                    // ... (كل كود الرسم الخاص بك) ...
                    
                    time++;
                    // (هام) هذا هو التعديل
                    stepAnimationLoops.canvas1 = requestAnimationFrame(draw); 
                }
                draw();
            }
            // (كرر هذا التعديل لـ animateStep2, animateStep3, animateStep4)
            // animateStep2 -> stepAnimationLoops.canvas2 = requestAnimationFrame(draw);
            // animateStep3 -> stepAnimationLoops.canvas3 = requestAnimationFrame(draw);
            // animateStep4 -> stepAnimationLoops.canvas4 = requestAnimationFrame(draw);
            */

            // دالة عامة لإيقاف أي كانفاس خطوة
            function stopStepAnimation(canvasId) {
                if (stepAnimationLoops[canvasId]) {
                    cancelAnimationFrame(stepAnimationLoops[canvasId]);
                    stepAnimationLoops[canvasId] = null;
                }
            }

            // --- 3. إعداد "المراقب" (IntersectionObserver) ---

            // المراقب الأول: للقسم كاملاً (للخلفيات)
            const processSection = document.getElementById('process');
            const sectionObserver = new IntersectionObserver((entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    // القسم دخل الشاشة
                    processSection.classList.add('is-in-view');
                    if (!particleAnimationLoopId) {
                        animateBackgroundParticles(); // شغّل كانفاس الخلفية
                    }
                } else {
                    // القسم خرج من الشاشة
                    processSection.classList.remove('is-in-view');
                    stopBackgroundParticles(); // أوقف كانفاس الخلفية
                }
            }, {
                threshold: 0.01 // عندما يظهر 1% من القسم
            });

            // ابدأ بمراقبة القسم
            if (processSection) {
                sectionObserver.observe(processSection);
            }

            // المراقب الثاني: لكل "كانفاس" خطوة على حدة
            const canvasObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const canvasId = entry.target.id;
                    if (entry.isIntersecting) {
                        // الكانفاس دخل الشاشة
                        if (!stepAnimationLoops[canvasId]) {
                            // شغّل فقط الكانفاس الذي نراه
                            if (canvasId === 'canvas1') animateStep1(entry.target);
                            if (canvasId === 'canvas2') animateStep2(entry.target);
                            if (canvasId === 'canvas3') animateStep3(entry.target);
                            if (canvasId === 'canvas4') animateStep4(entry.target);
                        }
                    } else {
                        // الكانفاس خرج من الشاشة
                        stopStepAnimation(canvasId); // أوقف الكانفاس الذي لا نراه
                    }
                });
            }, {
                threshold: 0.1 // عندما يظهر 10% من الكانفاس
            });

            // ابدأ بمراقبة الخطوات الأربعة
            Object.values(stepCanvasElements).forEach(canvas => {
                if (canvas) {
                    canvasObserver.observe(canvas);
                }
            });

            // =================================================================
            // === نهاية حل السلاسة ===
            // =================================================================
