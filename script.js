/* ------------------------------------- */
/* 1. Constants (ثوابت التحكم في السلوك) */
/* ------------------------------------- */
const NUM_BOIDS = 100; // عدد الطيور
const MAX_SPEED = 2;   // أقصى سرعة
const MAX_FORCE = 0.05; // أقصى قوة دفع لتغيير الاتجاه
const PERCEPTION_RADIUS = 50; // مدى رؤية الطائر للطيور الأخرى بالبكسل
const SEPARATION_WEIGHT = 1.5; // وزن التباعد (قوة التجنب)
const ALIGNMENT_WEIGHT = 1.0;  // وزن المحاذاة (قوة تقليد الاتجاه)
const COHESION_WEIGHT = 1.0;   // وزن التماسك (قوة التجمع)

/* ------------------------------------- */
/* 2. Vector Class (كلاس المتجهات) */
/* ------------------------------------- */
class Vector {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    add(v) { this.x += v.x; this.y += v.y; return this; }
    sub(v) { this.x -= v.x; this.y -= v.y; return this; }
    mult(n) { this.x *= n; this.y *= n; return this; }
    setMag(n) { return this.normalize().mult(n); }
    normalize() { 
        const m = this.mag();
        if (m > 0) return this.div(m); 
        return this;
    }
    mag() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    div(n) { this.x /= n; this.y /= n; return this; }
    limit(max) {
        if (this.mag() > max) {
            this.setMag(max);
        }
        return this;
    }
    heading() { return Math.atan2(this.y, this.x); }
    static sub(v1, v2) { return new Vector(v1.x - v2.x, v1.y - v2.y); }
    static random2D() { return new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1).normalize(); }
}

/* ------------------------------------- */
/* 3. Boid Class (كلاس الطائر الذكي) */
/* ------------------------------------- */
class Boid {
    constructor(x, y, el) {
        this.position = new Vector(x, y);
        this.velocity = Vector.random2D().mult(Math.random() * MAX_SPEED);
        this.acceleration = new Vector();
        this.element = el;
    }

    // حساب القوة المطلوبة للوصول إلى سرعة معينة (مطلوبة للتماسك)
    seek(target) {
        let desired = Vector.sub(target, this.position);
        desired.setMag(MAX_SPEED);
        let steer = Vector.sub(desired, this.velocity);
        steer.limit(MAX_FORCE);
        return steer;
    }

    // تطبيق قواعد السرب
    flock(boids) {
        let separation = this.separate(boids).mult(SEPARATION_WEIGHT);
        let alignment = this.align(boids).mult(ALIGNMENT_WEIGHT);
        let cohesion = this.cohesion(boids).mult(COHESION_WEIGHT);

        this.acceleration.add(separation).add(alignment).add(cohesion);
    }

    // قاعدة التباعد: تجنب الاصطدام
    separate(boids) {
        let steering = new Vector();
        let count = 0;
        for (let other of boids) {
            let d = Vector.sub(this.position, other.position).mag();
            if (other !== this && d < PERCEPTION_RADIUS) {
                let diff = Vector.sub(this.position, other.position);
                diff.div(d); 
                steering.add(diff);
                count++;
            }
        }
        if (count > 0) {
            steering.div(count);
            steering.setMag(MAX_SPEED);
            steering.sub(this.velocity);
            steering.limit(MAX_FORCE);
        }
        return steering;
    }

    // قاعدة المحاذاة: تطابق السرعة
    align(boids) {
        let avgVelocity = new Vector();
        let count = 0;
        for (let other of boids) {
            let d = Vector.sub(this.position, other.position).mag();
            if (other !== this && d < PERCEPTION_RADIUS) {
                avgVelocity.add(other.velocity);
                count++;
            }
        }
        if (count > 0) {
            avgVelocity.div(count);
            avgVelocity.setMag(MAX_SPEED);
            let steer = Vector.sub(avgVelocity, this.velocity);
            steer.limit(MAX_FORCE);
            return steer;
        }
        return new Vector();
    }

    // قاعدة التماسك: التحرك نحو المركز
    cohesion(boids) {
        let centerOfMass = new Vector();
        let count = 0;
        for (let other of boids) {
            let d = Vector.sub(this.position, other.position).mag();
            if (other !== this && d < PERCEPTION_RADIUS) {
                centerOfMass.add(other.position);
                count++;
            }
        }
        if (count > 0) {
            centerOfMass.div(count);
            return this.seek(centerOfMass);
        }
        return new Vector();
    }

    // التعامل مع حدود الشاشة (يعبر للجانب الآخر)
    edges() {
        if (this.position.x > window.innerWidth) this.position.x = 0;
        else if (this.position.x < 0) this.position.x = window.innerWidth;
        if (this.position.y > window.innerHeight) this.position.y = 0;
        else if (this.position.y < 0) this.position.y = window.innerHeight;
    }

    // التحديث والرسم
    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(MAX_SPEED);
        this.acceleration.mult(0); // مسح التسارع
    }

    show() {
        // تحديث الموضع
        this.element.style.left = `${this.position.x}px`;
        this.element.style.top = `${this.position.y}px`;
        
        // تدوير الطائر ليواجه اتجاه السرعة
        let angle = this.velocity.heading();
        this.element.style.transform = `rotate(${angle}rad)`;
    }
}

/* ------------------------------------- */
/* 4. Main Setup (الإعداد الرئيسي) */
/* ------------------------------------- */
const boids = [];
const container = document.getElementById('boids-container');

// تهيئة الطيور
function setup() {
    for (let i = 0; i < NUM_BOIDS; i++) {
        const el = document.createElement('div');
        el.className = 'boid';
        container.appendChild(el);
        let x = Math.random() * window.innerWidth;
        let y = Math.random() * window.innerHeight;
        boids.push(new Boid(x, y, el));
    }
    animate();
}

// حلقة التحريك الرئيسية
function animate() {
    for (let boid of boids) {
        boid.flock(boids); 
        boid.edges(); 
        boid.update(); 
        boid.show(); 
    }
    requestAnimationFrame(animate); 
}

// البدء بعد تحميل الصفحة
window.addEventListener('load', setup);
