'use strict';
// ==================================================================================================
// --- 1. Three.js 3D Scene Logic (Hero) ---
// ==================================================================================================
let scene, camera, renderer, controls, clock, particleSystem, neonMeshes = [], hvacMeshes = [];
let animationFrameId;
const threeJsContainer = document.getElementById('scene-container');
const threeJsLoadingOverlay = document.getElementById('loading-overlay');
const threeJsInstructionBox = document.querySelector('.instruction-box');
const materials = {};

function setupMaterials() {
    materials.concrete = new THREE.MeshStandardMaterial({ color: 0x9e9e9e, roughness: 0.9, metalness: 0.1 });
    materials.steel = new THREE.MeshStandardMaterial({ color: 0x4f4f4f, roughness: 0.4, metalness: 0.8 });
    materials.wood = new THREE.MeshStandardMaterial({ color: 0xa08c6a, roughness: 0.6, metalness: 0.05 });
    materials.glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0, opacity: 0.2, transparent: true, transmission: 0.95, reflectivity: 0.8 });
    materials.neonBlue = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x00ffff, emissiveIntensity: 1.5 });
    materials.neonOrange = new THREE.MeshStandardMaterial({ color: 0xffa500, emissive: 0xffa500, emissiveIntensity: 0.5, roughness: 0.2 });
    materials.warmLight = new THREE.MeshBasicMaterial({ color: 0xffd700, emissive: 0xffd700, emissiveIntensity: 1.0 });
    materials.sofa = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8, metalness: 0.0 });
}
function createBuildingStructure(width, height, depth, floors) {
    const group = new THREE.Group();
    const floorHeight = height / floors;
    const slabGeometry = new THREE.BoxGeometry(width, 0.2, depth);
    for (let i = 0; i <= floors; i++) {
        const slab = new THREE.Mesh(slabGeometry, materials.concrete);
        slab.position.y = i * floorHeight;
        slab.castShadow = true;
        slab.receiveShadow = true;
        group.add(slab);
    }
    const columnGeometry = new THREE.BoxGeometry(0.2, height, 0.2);
    const positions = [[-width / 2 + 0.1, height / 2, -depth / 2 + 0.1], [width / 2 - 0.1, height / 2, -depth / 2 + 0.1], [-width / 2 + 0.1, height / 2, depth / 2 - 0.1], [width / 2 - 0.1, height / 2, depth / 2 - 0.1]];
    positions.forEach(pos => { const column = new THREE.Mesh(columnGeometry, materials.steel); column.position.set(...pos); column.castShadow = true; group.add(column); });
    return group;
}
function createTechnicalSystems(width, height, depth, floors) {
    const group = new THREE.Group();
    const floorHeight = height / floors;
    const systemScale = 0.05;
    neonMeshes.length = 0;
    hvacMeshes.length = 0;
    for (let i = 0; i < floors; i++) {
        const floorY = i * floorHeight + 0.1;
        const offsetZ = depth / 2 - 0.1;
        const numConduits = 5;
        for (let j = 0; j < numConduits; j++) {
            const conduitLength = floorHeight * 0.8;
            const conduitGeometry = new THREE.CylinderGeometry(systemScale * 0.7, systemScale * 0.7, conduitLength, 8);
            const conduitV = new THREE.Mesh(conduitGeometry, materials.neonOrange);
            conduitV.position.set(-width / 2 + 0.5 + j * 0.5, floorY + conduitLength / 2, offsetZ);
            conduitV.castShadow = true;
            group.add(conduitV);
            hvacMeshes.push(conduitV);
            const wireLength = 1.0;
            const wireGeometry = new THREE.CylinderGeometry(systemScale * 0.4, systemScale * 0.4, wireLength, 6);
            const wireH = new THREE.Mesh(wireGeometry, materials.neonBlue);
            wireH.rotation.z = Math.PI / 2;
            wireH.position.set(conduitV.position.x + wireLength / 2, floorY + 0.5, offsetZ - 0.1);
            group.add(wireH);
            neonMeshes.push(wireH); 
            const boxGeometry = new THREE.BoxGeometry(systemScale * 5, systemScale * 5, systemScale * 1);
            const junctionBox = new THREE.Mesh(boxGeometry, materials.steel);
            junctionBox.position.set(wireH.position.x + wireLength / 2, wireH.position.y, offsetZ - 0.1);
            junctionBox.castShadow = true;
            group.add(junctionBox);
            hvacMeshes.push(junctionBox);
        }
        const ductGeometry = new THREE.BoxGeometry(2.0, 0.4, 0.4);
        const duct = new THREE.Mesh(ductGeometry, materials.steel);
        duct.position.set(width / 2 - 2, floorY + floorHeight - 0.3, offsetZ);
        duct.castShadow = true;
        group.add(duct);
        hvacMeshes.push(duct);
    }
    return group;
}
function createInteriorSpace(floorY, width, depth) {
    const group = new THREE.Group();
    const floorGeometry = new THREE.PlaneGeometry(width - 0.1, depth - 0.1);
    const floorMesh = new THREE.Mesh(floorGeometry, materials.wood);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = floorY + 0.1;
    floorMesh.receiveShadow = true;
    group.add(floorMesh);
    const sofaGeometry = new THREE.BoxGeometry(2.5, 0.4, 1.0);
    const sofa = new THREE.Mesh(sofaGeometry, materials.sofa);
    sofa.position.set(width * 0.2, floorY + 0.3, depth * 0.1);
    sofa.castShadow = true;
    group.add(sofa);
    const tableGeometry = new THREE.BoxGeometry(1.2, 0.2, 0.8);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.1, metalness: 0.0 });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(sofa.position.x - 1.0, floorY + 0.3, sofa.position.z + 0.5);
    table.castShadow = true;
    group.add(table);
    const diningTable = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 0.8), materials.wood);
    diningTable.position.set(-width * 0.2, floorY + 0.5, depth * 0.1);
    diningTable.castShadow = true;
    group.add(diningTable);
    const chairGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.4);
    const chair1 = new THREE.Mesh(chairGeometry, materials.wood);
    chair1.position.set(-width * 0.2 - 0.5, floorY + 0.3, depth * 0.1);
    chair1.castShadow = true;
    group.add(chair1);
    const lightFixtureGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 6);
    const fixture = new THREE.Mesh(lightFixtureGeometry, materials.warmLight);
    fixture.position.set(diningTable.position.x, floorY + 2.5, diningTable.position.z);
    fixture.rotation.x = Math.PI / 2;
    group.add(fixture);
    const interiorLight = new THREE.PointLight(0xffd700, 5, 5);
    interiorLight.position.set(fixture.position.x, fixture.position.y, fixture.position.z);
    interiorLight.castShadow = true;
    group.add(interiorLight);
    return group;
}
function createScaffolding(width, height, depth) {
    const group = new THREE.Group();
    const tubeRadius = 0.03;
    const tubeGeometry = new THREE.CylinderGeometry(tubeRadius, tubeRadius, height, 8);
    const horizontalBeam = new THREE.CylinderGeometry(tubeRadius, tubeRadius, width, 8);
    const scaffoldingX = -width / 2;
    const scaffoldingZ = -depth / 2;
    for (let i = 0; i <= 5; i++) {
        const column = new THREE.Mesh(tubeGeometry, materials.steel);
        column.position.set(scaffoldingX, height / 2, scaffoldingZ + i * 0.5);
        group.add(column);
    }
    const numLevels = 3;
    for (let j = 1; j < numLevels; j++) {
        const yPos = j * (height / numLevels);
        const beam = new THREE.Mesh(horizontalBeam, materials.steel);
        beam.rotation.z = Math.PI / 2;
        beam.position.set(scaffoldingX, yPos, scaffoldingZ + 1.2);
        group.add(beam);
    }
    group.position.x -= 0.1;
    return group;
}
function createParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const boundsX = 5;
    const boundsY = 8;
    const boundsZ = 5;
    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() * boundsX) - boundsX / 2;
        const y = Math.random() * boundsY;
        const z = (Math.random() * boundsZ) - boundsZ / 2;
        positions.push(x, y, z);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({ color: 0xeeeeee, size: 0.02, sizeAttenuation: true, transparent: true, opacity: 0.7 });
    particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);
}
window.toggleNeonGlow = function(enable) {
    if (!materials.neonBlue || !materials.neonOrange) return; 
    const blueIntensity = enable ? 1.5 : 0.01; 
    const blueColor = enable ? 0x00ffff : 0x008888;
    neonMeshes.forEach(mesh => {
        if (mesh.material === materials.neonBlue) {
            mesh.material.emissive.setHex(blueColor);
            mesh.material.emissiveIntensity = blueIntensity;
            mesh.material.needsUpdate = true;
        }
    });
    const orangeIntensity = enable ? 0.5 : 0.01; 
    const orangeColor = enable ? 0xffa500 : 0x884400; 
     hvacMeshes.forEach(mesh => {
        if (mesh.material === materials.neonOrange) {
            mesh.material.emissive.setHex(orangeColor);
            mesh.material.emissiveIntensity = orangeIntensity;
            mesh.material.needsUpdate = true;
        }
    });
}
window.toggleHVACHiding = function(enable) {
    hvacMeshes.forEach(mesh => { if (mesh) mesh.visible = enable; });
}
function disposeThreeJs() {
    if (animationFrameId) { cancelAnimationFrame(animationFrameId); }
    if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        const canvas = renderer.domElement;
        if (canvas && canvas.parentNode) { canvas.parentNode.removeChild(canvas); }
    }
    scene = camera = renderer = controls = clock = particleSystem = null;
    neonMeshes = [];
    hvacMeshes = [];
}
function initThreeJs() {
    if (!threeJsContainer) return;
    disposeThreeJs();
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    clock = new THREE.Clock();
    const aspectRatio = threeJsContainer.clientWidth / threeJsContainer.clientHeight;
    camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 100);
    camera.position.set(10, 6, 12);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(threeJsContainer.clientWidth, threeJsContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    threeJsContainer.appendChild(renderer.domElement);
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(0, 4, 0);
    } else { console.error("THREE.OrbitControls not found. The control functionality will be limited."); }
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(15, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;
    scene.add(dirLight);
    const ambientLight = new THREE.AmbientLight(0x404040, 1.0);
    scene.add(ambientLight);
    const backLight = new THREE.DirectionalLight(0xeeeeff, 0.5);
    backLight.position.set(-10, 5, -15);
    scene.add(backLight);
    setupMaterials();
    const buildingWidth = 8;
    const buildingHeight = 10;
    const buildingDepth = 6;
    const numFloors = 4;
    const floorHeight = buildingHeight / numFloors;
    const structure = createBuildingStructure(buildingWidth, buildingHeight, buildingDepth, numFloors);
    scene.add(structure);
    const systems = createTechnicalSystems(buildingWidth, buildingHeight, buildingDepth, numFloors);
    scene.add(systems);
    const interiorSpace = createInteriorSpace(floorHeight * 2, buildingWidth / 2, buildingDepth);
    interiorSpace.position.x = buildingWidth / 4;
    scene.add(interiorSpace);
    const glassWallGeometry = new THREE.BoxGeometry(0.1, floorHeight, buildingDepth);
    const glassWall = new THREE.Mesh(glassWallGeometry, materials.glass);
    glassWall.position.set(0.0, floorHeight * 2 + floorHeight / 2, 0.0);
    glassWall.castShadow = true;
    scene.add(glassWall);
    const scaffolding = createScaffolding(1.0, buildingHeight, buildingDepth * 0.5);
    scaffolding.position.z = -buildingDepth / 2 - 0.1;
    scene.add(scaffolding);
    createParticles();
    window.removeEventListener('resize', onWindowResize); 
    window.addEventListener('resize', onWindowResize);
    const neonToggle = document.getElementById('neonToggle');
    const hvacToggle = document.getElementById('hvacToggle');
    neonToggle.checked = true; 
    hvacToggle.checked = true; 
    toggleNeonGlow(true);
    toggleHVACHiding(true);
    threeJsLoadingOverlay.style.opacity = '0';
    setTimeout(() => {
        threeJsLoadingOverlay.style.display = 'none';
        threeJsInstructionBox.classList.remove('hidden');
    }, 500);
    animateThreeJs();
}
function onWindowResize() {
    if (camera && renderer) {
        camera.aspect = threeJsContainer.clientWidth / threeJsContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(threeJsContainer.clientWidth, threeJsContainer.clientHeight);
    }
}
function animateThreeJs() {
    animationFrameId = requestAnimationFrame(animateThreeJs);
    const delta = clock.getDelta();
    if (particleSystem) {
        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] += delta * 0.05;
            if (positions[i] > 10) { positions[i] = 0; }
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
    }
    if (controls) { controls.update(); }
    if (renderer && scene && camera) { renderer.render(scene, camera); }
}
// --- END Three.js 3D Scene Logic (Hero) ---

// ==================================================================================================
// --- 2. Methodology Canvas Animations (FIXED) ---
// ==================================================================================================

// ===== PARTICLE SYSTEM (Background) =====
const particleCanvas = document.getElementById('particleCanvas');
let pCtx;

function resizeParticleCanvas() {
    if (!particleCanvas) return;
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}
  
function initBackgroundParticles() {
    if (!particleCanvas) return;
    pCtx = particleCanvas.getContext('2d');
    resizeParticleCanvas();
    animateBackgroundParticles();
}
  
function animateBackgroundParticles() {
    if (!pCtx || !particleCanvas) {
        requestAnimationFrame(animateBackgroundParticles);
        return;
    }
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    pCtx.strokeStyle = 'rgba(212, 175, 55, 0.1)';
    pCtx.lineWidth = 1;

    let bgTime = Date.now() / 1000; 

    const lines = 30;
    const centerX = particleCanvas.width / 2;
    const centerY = particleCanvas.height / 2;
    const maxDimension = Math.max(particleCanvas.width, particleCanvas.height);

    for (let i = 0; i < lines; i++) {
        const angle = (i / lines) * Math.PI * 2 + bgTime * 0.005; 
        const length = maxDimension * 0.8;
        const x1 = centerX + Math.cos(angle) * length;
        const y1 = centerY + Math.sin(angle) * length;
        const x2 = centerX - Math.cos(angle) * length;
        const y2 = centerY - Math.sin(angle) * length;
        pCtx.beginPath();
        pCtx.moveTo(x1, y1);
        pCtx.lineTo(x2, y2);
        pCtx.stroke();
    }
    requestAnimationFrame(animateBackgroundParticles);
}

// Step 1: Cinematic Blueprint/Sketch
function animateStep1(canvas) {
    const ctx = canvas.getContext('2d');
    let time = 0;
    const canvasSize = Math.min(canvas.width, canvas.height);
    const scaleFactor = canvasSize / 300;
    
    function draw() {
        if (!canvas.isConnected || !canvas.width) { requestAnimationFrame(draw); return; }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.scale(scaleFactor, scaleFactor);
        
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#d4af37';
        ctx.shadowBlur = 8;
        
        const paths = [
            'M 50 250 L 50 80 L 150 30 L 250 80 L 250 250', // Outer shell
            'M 50 250 L 250 250', // Base line
            'M 80 250 L 80 100 L 220 100 L 220 250', // Inner walls
            'M 120 100 L 120 150 L 180 150 L 180 100' // Room
        ];
        
        paths.forEach((path, index) => {
            const p = new Path2D(path);
            ctx.setLineDash([1000, 1000]);
            const progress = Math.max(0, Math.min(1, (time - index * 20) / 200));
            ctx.lineDashOffset = 1000 - progress * 1000;
            ctx.stroke(p);
        });

        ctx.restore();
        time++;
        requestAnimationFrame(draw);
    }
    draw();
}

// Step 2: 3D Wireframe Evolution
function animateStep2(canvas) {
    const ctx = canvas.getContext('2d');
    let time2 = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = Math.min(canvas.width, canvas.height) * 0.3;

    function draw() {
        if (!canvas.isConnected || !canvas.width) { requestAnimationFrame(draw); return; }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const angle = time2 * 0.003;
        
        const basePoints = [
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ];
        
        const projected = basePoints.map((p) => {
            let x = p[0], y = p[1], z = p[2];
            let tempX = x * Math.cos(angle) - z * Math.sin(angle);
            z = x * Math.sin(angle) + z * Math.cos(angle);
            x = tempX;
            tempX = y * Math.cos(angle*0.5) - z * Math.sin(angle*0.5);
            z = y * Math.sin(angle*0.5) + z * Math.cos(angle*0.5);
            y = tempX;
            
            const perspective = 1.5 / (1.5 + z);
            return [centerX + x * size * perspective, centerY + y * size * perspective, z];
        });

        const progress = (Math.sin(time2 * 0.01) + 1) / 2;
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.5;
        ctx.fillStyle = `rgba(212, 175, 55, ${progress * 0.15})`;
        ctx.shadowColor = '#d4af37';
        ctx.shadowBlur = 15;
        
        for(let i=0; i<4; i++) {
            // Connect function inline to maintain scope
            ctx.beginPath();
            ctx.moveTo(projected[i][0], projected[i][1]);
            ctx.lineTo(projected[(i+1)%4][0], projected[(i+1)%4][1]);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(projected[i+4][0], projected[i+4][1]);
            ctx.lineTo(projected[(i+1)%4 + 4][0], projected[(i+1)%4 + 4][1]);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(projected[i][0], projected[i][1]);
            ctx.lineTo(projected[i+4][0], projected[i+4][1]);
            ctx.stroke();
        }

        time2++;
        requestAnimationFrame(draw);
    }
    draw();
}

// Step 3: Cinematic Render
function animateStep3(canvas) {
    const ctx = canvas.getContext('2d');
    let time3 = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    function draw() {
        if (!canvas.isConnected || !canvas.width) { requestAnimationFrame(draw); return; }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const t = time3 * 0.002;
        
        const layers = 5;
        for(let i=0; i < layers; i++) {
            const radius = canvas.width * 0.2 + i * 15;
            const y = centerY + Math.sin(t + i) * 10;
            const alpha = 0.8 - (i / layers) * 0.7;

            const gradient = ctx.createRadialGradient(centerX, y, radius*0.8, centerX, y, radius);
            gradient.addColorStop(0, `rgba(212, 175, 55, ${alpha * 0.5})`);
            gradient.addColorStop(1, `rgba(212, 175, 55, 0)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.ellipse(centerX, y, radius, radius * 0.4, 0, 0, 2 * Math.PI);
            ctx.fill();
        }

        const glintX = centerX + 80 * Math.cos(t * 2);
        const glintY = centerY + 30 * Math.sin(t * 1.5);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(glintX, glintY, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;

        time3++;
        requestAnimationFrame(draw);
    }
    draw();
}

// Step 4: Final Building with "Lights On"
const lights = Array(50).fill().map(() => ({
    x: 50 + Math.random() * 200,
    y: 100 + Math.random() * 140,
    delay: Math.random() * 200 + 100,
    radius: Math.random() * 2 + 1,
    opacity: 0
}));

function animateStep4(canvas) {
    const ctx = canvas.getContext('2d');
    let time4 = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) / 300;

    function draw() {
        if (!canvas.isConnected || !canvas.width) { requestAnimationFrame(draw); return; }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const revealProgress = Math.min(1, time4 / 150);

        ctx.save();
        ctx.scale(scale, scale);
        ctx.translate(centerX/scale - 150, centerY/scale - 150);

        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#d4af37';
        ctx.shadowBlur = 25;

        const p = new Path2D('M 40 250 L 40 90 L 150 20 L 260 90 L 260 250 L 40 250');
        ctx.globalAlpha = revealProgress;
        ctx.setLineDash([1200, 1200]);
        ctx.lineDashOffset = 1200 - revealProgress * 1200;
        ctx.stroke(p);

        if(revealProgress === 1) {
            ctx.fillStyle = 'rgba(212, 175, 55, 0.1)';
            ctx.fill(p);
            lights.forEach(light => {
                if(time4 > light.delay) {
                    light.opacity = Math.min(1, light.opacity + 0.05);
                }
                ctx.beginPath();
                
                const drawX = light.x; 
                const drawY = light.y;
                
                ctx.fillStyle = `rgba(255, 220, 150, ${light.opacity})`;
                ctx.shadowColor = `rgba(255, 220, 150, ${light.opacity})`;
                ctx.shadowBlur = 15 * light.opacity;
                ctx.arc(drawX, drawY, light.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });
        }
        ctx.restore();
        time4++;
        requestAnimationFrame(draw);
    }
    draw();
}

// ===== SCROLL ANIMATIONS (CSS Visibility and Line Progress) =====
const steps = document.querySelectorAll('.methodology-step');
const lineProgress = document.getElementById('lineProgress');

function checkStepsVisibility() {
    const windowHeight = window.innerHeight;

    steps.forEach((step) => {
        const rect = step.getBoundingClientRect();
        const stepOffset = rect.top; 

        if (stepOffset < windowHeight * 0.7) {
            step.classList.add('visible');
        }
    });

    // Update connecting line progress
    if (steps.length > 0 && lineProgress) {
        const stepsContainer = document.querySelector('.steps-container');
        if(!stepsContainer) return;
        
        const stepsContainerRect = stepsContainer.getBoundingClientRect();
        const totalHeight = stepsContainerRect.height;
        
        const startOffset = stepsContainerRect.top - windowHeight;
        const endOffset = stepsContainerRect.bottom - (windowHeight * 0.2); 
        
        const scrolledDistance = -startOffset;
        const scrollableRange = endOffset - startOffset;

        const scrollProgress = Math.min(1, Math.max(0, scrolledDistance / scrollableRange));
        
        lineProgress.style.height = `${scrollProgress * totalHeight}px`;
    }
}
  
function initializeCanvases() {
    // Resize handler for step canvases
    const resizeStepCanvases = () => {
        const canvasElements = document.querySelectorAll('.step-canvas');
        canvasElements.forEach(canvas => {
            if (canvas) {
                const parent = canvas.closest('.visual-container');
                canvas.width = parent.offsetWidth;
                canvas.height = parent.offsetHeight;
            }
        });
    };

    resizeStepCanvases();
    window.addEventListener('resize', resizeStepCanvases);

    // Start animations
    const canvas1 = document.getElementById('canvas1');
    const canvas2 = document.getElementById('canvas2');
    const canvas3 = document.getElementById('canvas3');
    const canvas4 = document.getElementById('canvas4');

    if (canvas1) animateStep1(canvas1);
    if (canvas2) animateStep2(canvas2);
    if (canvas3) animateStep3(canvas3);
    if (canvas4) animateStep4(canvas4);
}


// ==================================================================================================
// --- 3. Main Initialization Logic (Revised) ---
// ==================================================================================================
  
let scroll; // Global scope for locomotive scroll instance
  
document.addEventListener('DOMContentLoaded', () => {

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
    const scrollContainer = document.querySelector('[data-scroll-container]');
    
    // NEW: Get the logo follower element
    const logoFollower = document.querySelector('.logo-follower');
    
    // --- Translations Data (Updated with form status messages) ---
    const translations = {
        en: {
            logo: "Eng.r Antonio GITHOP", nav_services: "Services", nav_process: "Process", nav_portfolio: "Portfolio", nav_testimonials: "Testimonials", nav_contact: "Contact", hero_title: "Masterful Designs, Meticulously Crafted.", hero_subtitle: "We specialize in bespoke architectural and interior solutions, transforming your vision into a timeless reality with hyper-realistic 3D visualization and unparalleled attention to detail.", hero_cta_drive: "View More on Google Drive", hero_cta_portfolio: "See Our Portfolio", services_title: "Core", service_1_title: "Architectural & Interior Design", service_1_desc: "Creating functional and aesthetic spaces that reflect your unique identity.", service_2_title: "3D Visualization & Rendering", service_2_desc: "Bringing concepts to life with hyper-realistic 3D models and interactive renderings.", service_3_title: "Smart Lighting & Electrical", service_3_desc: "Designing intelligent and efficient lighting and electrical plans for modern living.", service_4_title: "Commercial & Residential Planning", service_4_desc: "Expert planning for both commercial and residential spaces to maximize utility.", service_5_title: "Project Management & B2B", service_5_desc: "Providing strategic B2B consulting and end-to-end project management.", service_6_title: "Smart Home Solutions", service_6_desc: "Integrating cutting-edge technology to create intelligent and secure homes.", service_7_title: "Business Setup Consultant", service_7_desc: "Expert advice for new ventures and business expansions.", service_8_title: "Lighting Electrical Planner", service_8_desc: "Efficient and compliant electrical system and lighting planning.", process_title: "Our Methodology", process_1_title: "Consultation & Briefing", process_1_desc: "Understanding your vision, requirements, and goals. This stage involves deep client consultation, site analysis, and defining the precise scope and aesthetic direction of the project.", process_2_title: "Concept & Design", process_2_desc: "Developing initial concepts, sketches, and space planning. We iterate on floor plans, architectural structure, material palettes, and core design elements until the perfect concept emerges.", process_3_title: "3D Visualization", process_3_desc: "Creating hyper-realistic 3D models and interactive walk-throughs for client review and refinement. This ensures the final vision is perfectly aligned before construction begins, minimizing errors.", process_4_title: "Execution & Delivery", process_4_desc: "Managing the project to ensure quality and timely completion. This includes coordination with contractors, site supervision, and final installation and quality checks to hand over the finished space.", portfolio_title: "Our Portfolio", testimonials_title: "What Our Clients Say", testimonial_1_text: "\"Antonio's team transformed our space with an incredible eye for detail. The 3D visualizations were a game-changer.\"", testimonial_1_author: "- CEO, Tech Innovators Inc.", testimonial_2_text: "\"The smart home integration was seamless and has fundamentally changed how we experience our home. Truly professional.\"", testimonial_2_author: "- J. Anderson, Private Residence", contact_title: "Let's Build Together", contact_info_title: "Get in Touch", contact_info_desc: "Have a project in mind or need a consultation? We are here to help you.", custom_apps_text: "We can build a website for you and your business.", contact_form_name: "Your Name", contact_form_email: "Your Email", contact_form_message: "Your Message", contact_form_submit: "Send Message", footer_text: `© ${new Date().getFullYear()} Eng.r Antonio GITHOP. All Rights Reserved.`, toggle_neon: "Toggle Neon Glow (Electric)", toggle_hvac: "Toggle Piping/HVAC Systems", hero_instructions: "Use your mouse/touch to orbit and explore the scene.", loading_methodology_text: "Initializing Methodology Visuals...", loading_3d_text: "Loading 3D Architectural Scene...", loading_3d_note: "(This is a complex scene and may take a moment)", form_status_sending: "Sending...", form_status_success: "Message sent successfully!", form_status_error: "An error occurred. Please try again.",
        },
        ar: {
            logo: "م. أنطونيو جيثوب", nav_services: "خدماتنا", nav_process: "منهجيتنا", nav_portfolio: "أعمالنا", nav_testimonials: "آراء العملاء", nav_contact: "اتصل بنا", hero_title: "تصاميم بارعة، منفذة بإتقان.", hero_subtitle: "نحن متخصصون في الحلول المعمارية والداخلية المخصصة، نحول رؤيتك إلى واقع خالد من خلال تصورات ثلاثية الأبعاد فائقة الواقعية واهتمام لا مثيل له بالتفاصيل.", hero_cta_drive: "شاهد المزيد على Google Drive", hero_cta_portfolio: "تصفح أعمالنا", services_title: "خبراتنا", service_1_title: "التصميم المعماري والداخلي", service_1_desc: "نصنع مساحات وظيفية وجمالية تعكس هويتك الفريدة.", service_2_title: "التصور والعرض ثلاثي الأبعاد", service_2_desc: "نُحيي المفاهيم بنماذج ثلاثية الأبعاد واقعية وعروض تفاعلية.", service_3_title: "الإضاءة الذكية والكهرباء", service_3_desc: "نصمم خطط إضاءة وكهرباء ذكية وفعالة للمعيشة العصرية.", service_4_title: "التخطيط التجاري والسكني", service_4_desc: "تخطيط احترافي للمساحات التجارية والسكنية لتعظيم الاستفادة منها.", service_5_title: "إدارة المشاريع و B2B", service_5_desc: "نقدم استشارات استراتيجية بين الشركات وإدارة شاملة للمشاريع.", service_6_title: "حلول المنزل الذكي", service_6_desc: "ندمج أحدث التقنيات لإنشاء منازل ذكية وآمنة.", service_7_title: "استشاري تأسيس أعمال", service_7_desc: "نصائح الخبراء للمشاريع الجديدة وتوسعات الأعمال.", service_8_title: "مخطط كهرباء وإضاءة", service_8_desc: "تخطيط فعال ومتوافق للأنظمة الكهربائية والإضاءة.", process_title: "منهجيتنا", process_1_title: "الاستشارة والتعريف", process_1_desc: "فهم رؤيتك ومتطلباتك وأهدافك. تتضمن هذه المرحلة استشارة عميقة للعميل، وتحليل الموقع، وتحديد النطاق الدقيق والاتجاه الجمالي للمشروع.", process_2_title: "المفهوم والتصميم", process_2_desc: "تطوير المفاهيم الأولية والرسومات وتخطيط المساحات. نكرر العمل على مخططات الطوابق، والهيكل المعماري، ولوحات المواد، وعناصر التصميم الأساسية حتى يظهر المفهوم المثالي.", process_3_title: "التصور ثلاثي الأبعاد", process_3_desc: "إنشاء نماذج ثلاثية الأبعاد فائقة الواقعية وعروض تفاعلية للمراجعة والتعديل من قبل العميل. يضمن ذلك توافق الرؤية النهائية تمامًا قبل بدء التنفيذ، مما يقلل الأخطاء.", process_4_title: "التنفيذ والتسليم", process_4_desc: "إدارة المشروع لضمان الجودة والإنجاز في الوقت المحدد. يشمل ذلك التنسيق مع المقاولين، والإشراف على الموقع، والتركيب النهائي وفحوصات الجودة لتسليم المساحة النهائية.", portfolio_title: "معرض أعمالنا", testimonials_title: "ماذا يقول عملاؤنا", testimonial_1_text: "\"فريق أنطونيو حوّل مساحتنا بعين لا تصدق للتفاصيل. التصورات ثلاثية الأبعاد كانت نقلة نوعية.\"", testimonial_1_author: "- الرئيس التنفيذي، Tech Innovators Inc.", testimonial_2_text: "\"تكامل المنزل الذكي كان سلسًا وغيّر بشكل جذري طريقة تجربتنا لمنزلنا. احترافية حقيقية.\"", testimonial_2_author: "- ج. أندرسون، إقامة خاصة", contact_title: "لنبنِ معًا", contact_info_title: "تواصل معنا", contact_info_desc: "هل لديك مشروع في ذهنك أو تحتاج إلى استشارة؟ نحن هنا لمساعدتك.", custom_apps_text: "يمكننا بناء موقع إلكتروني لك ولعملك.", contact_form_name: "اسمك", contact_form_email: "بريدك الإلكتروني", contact_form_message: "رسالتك", contact_form_submit: "إرسال الرسالة", footer_text: `© ${new Date().getFullYear()} م. أنطونيو جيثوب. جميع الحقوق محفوظة.`, toggle_neon: "تبديل توهج النيون (كهرباء)", toggle_hvac: "تبديل أنظمة الأنابيب/التكييف", hero_instructions: "استخدم الماوس/اللمس للدوران واستكشاف المشهد.", loading_methodology_text: "تهيئة العروض البصرية للمنهجية...", loading_3d_text: "تحميل المشهد المعماري ثلاثي الأبعاد...", loading_3d_note: "(هذا مشهد معقد وقد يستغرق لحظات)", form_status_sending: "جاري الإرسال...", form_status_success: "تم إرسال الرسالة بنجاح!", form_status_error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
        },
        tr: { /* Placeholder values */ logo: "Antonio GITHOP", nav_services: "Hizmetler", nav_process: "Süreç", nav_portfolio: "Portföy", nav_testimonials: "Referanslar", nav_contact: "İletişim", hero_title: "Ustalıkla Hazırlanmış Tasarımlar.", hero_subtitle: "Hyper-realistic 3D görselleştirme ve detaylara benzersiz dikkat ile vizyonunuzu zamansız bir gerçeğe dönüştüren ısmarlama mimari ve iç mekan çözümlerinde uzmanız.", hero_cta_drive: "Google Drive'da Daha Fazlasını Gör", hero_cta_portfolio: "Portföyümüzü Gör", services_title: "Temel", service_1_title: "Mimari & İç Tasarım", service_1_desc: "Eşsiz kimliğinizi yansıtan işlevsel ve estetik alanlar yaratma.", service_2_title: "3D Görselleştirme & Modelleme", service_2_desc: "Konseptleri hiper-gerçekçi 3D modeller ve etkileşimli render'lar ile hayata geçirme.", service_3_title: "Akıllı Aydınlatma & Elektrik", service_3_desc: "Modern yaşam için akıllı ve verimli aydınlatma ve elektrik planları tasarlama.", service_4_title: "Ticari & Konut Planlaması", service_4_desc: "Kullanımı en üst düzeye çıkarmak için hem ticari hem de konut alanları için uzman planlama.", service_5_title: "Proje Yönetimi & B2B", service_5_desc: "Stratejik B2B danışmanlığı ve uçtan uca proje yönetimi sağlama.", service_6_title: "Akıllı Ev Çözümleri", service_6_desc: "Akıllı ve güvenli evler oluşturmak için en son teknolojiyi entegre etme.", service_7_title: "İş Kurulum Danışmanı", service_7_desc: "Yeni girişimler ve iş genişletmeleri için uzman tavsiyesi.", service_8_title: "Aydınlatma Elektrik Planlayıcısı", service_8_desc: "Verimli ve uyumlu elektrik sistemi ve aydınlatma planlaması.", process_title: "Metodolojimiz", process_1_title: "Danışma & Brifing", process_1_desc: "Vizyonunuzu, gereksinimlerinizi ve hedeflerinizi anlama. Bu aşama derin müşteri danışmanlığı, saha analizi ve projenin kesin kapsamı ile estetik yönünün belirlenmesini içerir.", process_2_title: "Konsept & Tasarım", process_2_desc: "İlk konseptleri, eskizleri ve alan planlamasını geliştirme. Mükemmel konsept ortaya çıkana kadar kat planları, mimari yapı, malzeme paletleri ve temel tasarım unsurları üzerinde yineleme yaparız.", process_3_title: "3D Görselleştirme", process_3_desc: "Müşteri incelemesi ve düzeltmesi için hiper-gerçekçi 3D modeller ve etkileşimli gezintiler oluşturma. Bu, inşaat başlamadan önce nihai vizyonun mükemmel şekilde hizalanmasını sağlayarak hataları en aza indirir.", process_4_title: "Uygulama & Teslimat", process_4_desc: "Kalite ve zamanında tamamlanmasını sağlamak için projeyi yönetme. Bu, yüklenicilerle koordinasyon, saha denetimi ve bitmiş alanın teslim edilmesi için son kurulum ve kalite kontrollerini içerir.", portfolio_title: "Portföyümüz", testimonials_title: "Müşterilerimiz Ne Diyor", testimonial_1_text: "\"Antonio'nun ekibi, inanılmaz bir detay hassasiyetiyle mekanımızı dönüştürdü. 3D görselleştirmeler ezber bozucuydu.\"", testimonial_1_author: "- CEO, Tech Innovators Inc.", testimonial_2_text: "\"Akıllı ev entegrasyonu kusursuzdu ve evimizi deneyimleme şeklimizi temelden değiştirdi. Gerçekten profesyonel.\"", testimonial_2_author: "- J. Anderson, Özel Konut", contact_title: "Birlikte İnşa Edelim", contact_info_title: "İletişime Geçin", contact_info_desc: "Aklınızda bir proje mi var yoksa bir danışmanlığa mı ihtiyacınız var? Size yardım etmek için buradayız.", custom_apps_text: "Sizin ve işiniz için bir web sitesi oluşturabiliriz.", contact_form_name: "Adınız", contact_form_email: "E-postanız", contact_form_message: "Mesajınız", contact_form_submit: "Mesaj Gönder", footer_text: `© ${new Date().getFullYear()} Eng.r Antonio GITHOP. Tüm Hakları Saklıdır.`, toggle_neon: "Neon Parıltısını Aç/Kapa (Elektrik)", toggle_hvac: "Boru/HVAC Sistemlerini Aç/Kapa", hero_instructions: "Sahneyi yörüngede döndürmek ve keşfetmek için farenizi/dokunuşunuzu kullanın.", loading_methodology_text: "Metodoloji Görselleri Başlatılıyor...", loading_3d_text: "3D Mimari Sahne Yükleniyor...", loading_3d_note: "(Bu karmaşık bir sahne olup biraz zaman alabilir)", form_status_sending: "Gönderiliyor...", form_status_success: "Mesaj başarıyla gönderildi!", form_status_error: "Bir hata oluştu. Lütfen tekrar deneyin.",
        },
        fr: { /* Placeholder values */ logo: "Eng.r Antonio GITHOP", nav_services: "Services", nav_process: "Processus", nav_portfolio: "Portfolio", nav_testimonials: "Témoignages", nav_contact: "Contact", hero_title: "Designs Magistraux, Méticuleusement Conçus.", hero_subtitle: "Nous sommes spécialisés dans les solutions architecturales et intérieures sur mesure, transformant votre vision en une réalité intemporelle grâce à une visualisation 3D hyper-réaliste et une attention inégalée aux détails.", hero_cta_drive: "Voir Plus sur Google Drive", hero_cta_portfolio: "Voir Notre Portfolio", services_title: "Expertise", service_1_title: "Conception Architecturale & Intérieure", service_1_desc: "Créer des espaces fonctionnels et esthétiques qui reflètent votre identité unique.", service_2_title: "Visualisation & Rendu 3D", service_2_desc: "Donner vie aux concepts avec des modèles 3D hyper-réalistes et des rendus interactifs.", service_3_title: "Éclairage & Électricité Intelligents", service_3_desc: "Concevoir des plans d'éclairage et électriques intelligents et efficaces pour la vie moderne.", service_4_title: "Planification Commerciale & Résidentielle", service_4_desc: "Planification experte pour les espaces commerciaux et résidentiels afin de maximiser l'utilité.", service_5_title: "Gestion de Projet & B2B", service_5_desc: "Fournir des conseils stratégiques B2B et une gestion de projet de bout en bout.", service_6_title: "Solutions de Maison Intelligente", service_6_desc: "Intégrer une technologie de pointe pour créer des maisons intelligentes et sécurisées.", service_7_title: "Consultant en Création d'Entreprise", service_7_desc: "Conseils d'experts pour les nouvelles entreprises et les extensions d'activité.", service_8_title: "Planificateur Électrique et d'Éclairage", service_8_desc: "Planification efficace et conforme des systèmes électriques et d'éclairage.", process_title: "Notre Méthodologie", process_1_title: "Consultation & Briefing", process_1_desc: "Comprendre votre vision, vos exigences et vos objectifs. Cette étape implique une consultation approfondie du client, une analyse du site et la définition du champ d'application précis et de la direction esthétique du projet.", process_2_title: "Concept & Design", process_2_desc: "Développement des concepts initiaux, des esquisses et de la planification spatiale. Nous itérons sur les plans d'étage, la structure architecturale, les palettes de matériaux et les éléments de conception de base jusqu'à ce que le concept parfait émerge.", process_3_title: "Visualisation 3D", process_3_desc: "Création de modèles 3D hyper-réalistes et de visites virtuelles interactives pour examen et affinement par le client. Cela garantit que la vision finale est parfaitement alignée avant le début de la construction, minimisant les erreurs.", process_4_title: "Exécution & Livraison", process_4_desc: "Gérer le projet pour assurer la qualité et l'achèvement dans les délais. Cela comprend la coordination avec les entrepreneurs, la supervision du site et l'installation finale ainsi que les contrôles de qualité pour livrer l'espace fini.", portfolio_title: "Notre Portfolio", testimonials_title: "Ce que disent nos Clients", testimonial_1_text: "\"L'équipe d'Antonio a transformé notre espace avec un sens incroyable du détail. Les visualisations 3D ont changé la donne.\"", testimonial_1_author: "- PDG, Tech Innovators Inc.", testimonial_2_text: "\"L'intégration de la maison intelligente a été transparente et a fondamentalement changé la façon dont nous vivons notre maison. Vraiment professionnel.\"", testimonial_2_author: "- J. Anderson, Résidence Privée", contact_title: "Construisons Ensemble", contact_info_title: "Prenez Contact", contact_info_desc: "Vous avez un projet en tête ou besoin d'une consultation ? Nous sommes là pour vous aider.", custom_apps_text: "Nous pouvons créer un site web pour vous et votre entreprise.", contact_form_name: "Votre Nom", contact_form_email: "Votre E-mail", contact_form_message: "Votre Message", contact_form_submit: "Envoyer le Message", footer_text: `© ${new Date().getFullYear()} Eng.r Antonio GITHOP. Tous Droits Réservés.`, toggle_neon: "Basculer l'Éclairage Néon (Électrique)", toggle_hvac: "Basculer les Systèmes de Tuyauterie/CVC", hero_instructions: "Utilisez votre souris/tactile pour faire pivoter et explorer la scène.", loading_methodology_text: "Initialisation des Visuels de la Méthodologie...", loading_3d_text: "Chargement de la Scène Architecturale 3D...", loading_3d_note: "(Ceci est une scène complexe et peut prendre un moment)", form_status_sending: "Envoi...", form_status_success: "Message envoyé avec succès !", form_status_error: "Une erreur s'est produite. Veuillez réessayer.",
        },
        es: { /* Placeholder values */ logo: "Eng.r Antonio GITHOP", nav_services: "Servicios", nav_process: "Proceso", nav_portfolio: "Portafolio", nav_testimonials: "Testimonios", nav_contact: "Contacto", hero_title: "Diseños Magistrales, Meticulosamente Elaborados.", hero_subtitle: "Nos especializamos en soluciones arquitectónicas y de interiores a medida, transformando su visión en una realidad atemporal con visualización 3D hiperrealista y una atención al detalle inigualable.", hero_cta_drive: "Ver Más en Google Drive", hero_cta_portfolio: "Ver Nuestro Portafolio", services_title: "Experiencia", service_1_title: "Diseño Arquitectónico y de Interiores", service_1_desc: "Creando espacios funcionales y estéticos que reflejan su identidad única.", service_2_title: "Visualización y Renderizado 3D", service_2_desc: "Dando vida a los conceptos con modelos 3D hiperrealistas y renders interactivos.", service_3_title: "Iluminación y Electricidad Inteligente", service_3_desc: "Diseño de planes de iluminación y eléctricos inteligentes y eficientes para la vida moderna.", service_4_title: "Planificación Comercial y Residencial", service_4_desc: "Planificación experta para espacios comerciales y residenciales para maximizar la utilidad.", service_5_title: "Gestión de Proyectos y B2B", service_5_desc: "Ofreciendo consultoría estratégica B2B y gestión de proyectos de principio a fin.", service_6_title: "Soluciones de Hogar Inteligente", service_6_desc: "Integrando tecnología de vanguardia para crear hogares inteligentes y seguros.", service_7_title: "Consultor de Creación de Empresas", service_7_desc: "Asesoramiento experto para nuevas empresas y expansiones de negocios.", service_8_title: "Planificador Eléctrico de Iluminación", service_8_desc: "Planificación eficiente y conforme de sistemas eléctricos y de iluminación.", process_title: "Nuestra Metodología", process_1_title: "Consulta e Información", process_1_desc: "Comprender su visión, requisitos y objetivos. Esta etapa implica una consulta profunda con el cliente, análisis del sitio y definición del alcance preciso y la dirección estética del proyecto.", process_2_title: "Concepto y Diseño", process_2_desc: "Desarrollo de conceptos iniciales, bocetos y planificación del espacio. Iteramos en planos de planta, estructura arquitectónica, paletas de materiales y elementos de diseño centrales hasta que emerge el concepto perfecto.", process_3_title: "Visualización 3D", process_3_desc: "Creación de modelos 3D hiperrealistas y recorridos interactivos para la revisión y el perfeccionamiento del cliente. Esto asegura que la visión final esté perfectamente alineada antes de que comience la construcción, minimizando errores.", process_4_title: "Ejecución y Entrega", process_4_desc: "Gestión del proyecto para garantizar la calidad y la finalización a tiempo. Esto incluye la coordinación con contratistas, la supervisión del sitio y la instalación final y los controles de calidad para entregar el espacio terminado.", portfolio_title: "Nuestro Portafolio", testimonials_title: "Lo que Dicen Nuestros Clientes", testimonial_1_text: "\"El equipo de Antonio transformó nuestro espacio con una increíble atención al detalle. Las visualizaciones 3D fueron un cambio de juego.\"", testimonial_1_author: "- CEO, Tech Innovators Inc.", testimonial_2_text: "\"La integración del hogar inteligente fue perfecta y ha cambiado fundamentalmente la forma en que experimentamos nuestro hogar. Verdaderamente profesional.\"", testimonial_2_author: "- J. Anderson, Residencia Privada", contact_title: "Construyamos Juntos", contact_info_title: "Póngase en Contacto", contact_info_desc: "¿Tiene un proyecto en mente o necesita una consulta? Estamos aquí para ayudarle.", custom_apps_text: "Podemos crear un sitio web para usted y su negocio.", contact_form_name: "Su Nombre", contact_form_email: "Su Correo Electrónico", contact_form_message: "Su Mensaje", contact_form_submit: "Enviar Mensaje", footer_text: `© ${new Date().getFullYear()} Eng.r Antonio GITHOP. Todos los Derechos Reservados.`, toggle_neon: "Activar/Desactivar Resplandor Neón (Eléctrico)", toggle_hvac: "Activar/Desactivar Sistemas de Tuberías/HVAC", hero_instructions: "Use su ratón/táctil para orbitar y explorar la escena.", loading_methodology_text: "Inicializando Visuales de Metodología...", loading_3d_text: "Cargando Escena Arquitectónica 3D...", loading_3d_note: "(Esta es una escena compleja y puede tardar un momento)", form_status_sending: "Enviando...", form_status_success: "¡Mensaje enviado con éxito!", form_status_error: "Ocurrió un error. Por favor, inténtelo de nuevo.",
        }
    };

    const applyLanguage = (lang) => {
        const langData = translations[lang];
        document.documentElement.lang = lang; 
        const isRTL = lang === 'ar';
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        
        // 1. Update text content
        document.querySelectorAll('[data-lang-key]').forEach(el => { 
            const key = el.getAttribute('data-lang-key'); 
            if (langData[key]) {
                // Special handling for the shimmer title: only update the non-accented text
                if (el.closest('.section-title-premium')) {
                    const accentSpan = el.querySelector('.gold-accent');
                    const parent = el.closest('.section-title-premium');
                    if (parent) {
                        // Find the text node or inner element that needs updating
                        let textNode = [...parent.childNodes].find(node => node.nodeType === 3 && node.textContent.trim().length > 0) || parent.querySelector('span:not(.gold-accent)');
                        if (textNode && textNode.nodeType === 3) {
                            textNode.textContent = langData[key];
                        } else if (textNode) {
                            textNode.textContent = langData[key];
                        }
                    }
                } else {
                    el.textContent = langData[key]; 
                }
            }
        });
        
        // 2. Update placeholders
        document.querySelectorAll('[data-lang-placeholder]').forEach(el => { 
            const key = el.getAttribute('data-lang-placeholder'); 
            if (langData[key]) el.placeholder = langData[key]; 
        });
        
        // 3. Update Three.js Control Labels (which are inside a generic div/span)
        document.querySelector('[data-lang-key="toggle_neon"]').textContent = langData['toggle_neon'];
        document.querySelector('[data-lang-key="toggle_hvac"]').textContent = langData['toggle_hvac'];
        
        // 4. Update span element content, like the logo text and year.
        currentLangSpan.textContent = lang.toUpperCase(); 
        footerYear.textContent = new Date().getFullYear(); // Year update is outside the language data map, re-run for safety.
        
        // NEW: Update Logo Follower text
        if (logoFollower) {
            logoFollower.textContent = langData['logo'] || "Eng.r Antonio GITHOP";
        }

        localStorage.setItem('language', lang);
        
        // 5. CRITICAL: Refresh scroll layout after changing direction/font
        if (scroll) scroll.update();
        ScrollTrigger.refresh();
    };
    
    const currentLanguage = localStorage.getItem('language') || 'en';

    // --- Locomotive Scroll Init ---
    try {
        scroll = new LocomotiveScroll({
            el: scrollContainer,
            smooth: true,
            lerp: 0.1, 
            tablet: { smooth: true },
            smartphone: { smooth: true }
        });

        gsap.registerPlugin(ScrollTrigger);

        // CRITICAL FIX: SCROLLTRIGGER PROXY SYNC
        scroll.on('scroll', ScrollTrigger.update);
        ScrollTrigger.scrollerProxy(scrollContainer, {
            scrollTop(value) {
                return arguments.length ? scroll.scrollTo(value, { duration: 0, disableLerp: true }) : scroll.scroll.instance.scroll.y;
            },
            getBoundingClientRect() { return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }; },
            pinType: scrollContainer.style.transform ? "transform" : "fixed"
        });
        
        scroll.on('ready', () => ScrollTrigger.refresh());

    } catch (error) {
        console.error("Locomotive Scroll or GSAP ScrollTrigger initialization failed:", error);
        document.documentElement.style.scrollBehavior = 'smooth';
        scrollContainer.removeAttribute('data-scroll-container');
        scroll = { on: () => {}, update: () => {}, scrollTo: (target) => { document.querySelector(target).scrollIntoView({ behavior: 'smooth' }); } };
        ScrollTrigger.scrollerProxy(document.body, {}); 
        ScrollTrigger.refresh();
    }

    // --- Page Load and Animations ---
    const initPage = () => {
        loader.classList.add('hidden');
        
        if (scroll) {
            scroll.update(); 
            ScrollTrigger.refresh();
        }

        initBackgroundParticles();
        initializeCanvases();
        checkStepsVisibility(); 
        
        document.getElementById('loadingOverlay').classList.add('hidden');

        const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.2 } });
        tl.to(header, { y: '0%', duration: 1, ease: 'power2.out' }, 0.5)
            .from('.hero-title', { opacity: 0, y: 40 }, 0.8)
            .from('.hero-subtitle', { opacity: 0, y: 40 }, '-=0.9')
            .from('.hero-buttons > *', { opacity: 0, y: 40, stagger: 0.15 }, '-=0.8');

        initScrollAnimations();
        initPremiumServicesAnimations();
        
        if (typeof THREE.OrbitControls !== 'undefined') {
            initThreeJs();
        } else {
            console.warn("Waiting for OrbitControls to load for Three.js initialization...");
            const checkThree = setInterval(() => {
                if (typeof THREE.OrbitControls !== 'undefined') {
                    clearInterval(checkThree);
                    initThreeJs();
                }
            }, 100);
        }
    };

    let loaded = false;
    window.addEventListener('load', () => {
        if (!loaded) {
            initPage();
            loaded = true;
        }
    });
    setTimeout(() => { if (!loaded) initPage(); }, 4000);


    // --- Scroll Animations (GSAP for non-fixed elements) ---
    const initScrollAnimations = () => {
        const scroller = scroll ? scrollContainer : window;
        
        // General Section Titles
        document.querySelectorAll('.section-title, .section-title-premium').forEach(title => {
            gsap.from(title, { scrollTrigger: { trigger: title, scroller: scroller, start: 'top 85%', toggleActions: 'play none none none', refreshPriority: 1 }, opacity: 0, y: 50, duration: 0.8, ease: 'power2.out' });
        });
        
        // Methodology Steps (Initial GSAP trigger for the container entry - visibility is handled by JS)
        gsap.from('.methodology-container', { scrollTrigger: { trigger: '#process', scroller: scroller, start: 'top bottom', end: 'top center', scrub: true, refreshPriority: 1 }, opacity: 1, duration: 1 });
        
        // Portfolio Items
        gsap.from('.portfolio-item', { scrollTrigger: { trigger: '.portfolio-grid', scroller: scroller, start: 'top 80%', toggleActions: 'play none none none', refreshPriority: 1 }, opacity: 0, y: 50, stagger: 0.15, duration: 1, ease: 'power3.out' });

        // Testimonials
        gsap.from('.testimonial-card', { scrollTrigger: { trigger: '.testimonials-grid', scroller: scroller, start: 'top 80%', toggleActions: 'play none none none', refreshPriority: 1 }, opacity: 0, y: 50, stagger: 0.2, duration: 0.7 });
        
        // Footer
        gsap.from('.footer-content > *', { scrollTrigger: { trigger: '.footer', scroller: scroller, start: 'top 95%', toggleActions: 'play none none none', refreshPriority: 1 }, opacity: 0, y: 40, stagger: 0.2, duration: 0.8 });
    };

    // --- Utility Functions ---
    if (footerYear) footerYear.textContent = new Date().getFullYear();

    // Native scroll listener for fixed elements and back-to-top
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
        backToTopBtn.classList.toggle('show', window.scrollY > window.innerHeight);
        checkStepsVisibility(); 
    });
    
    // If Locomotive Scroll is active, also trigger visibility checks on its scroll event
    if (scroll && typeof scroll.on === 'function') {
        scroll.on('scroll', (instance) => {
            checkStepsVisibility();
        });
    }


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

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        if (formData.get('website')) return;
        const object = { access_key: "YOUR_ACCESS_KEY_HERE", ...Object.fromEntries(formData) }; //
        const json = JSON.stringify(object);
        
        formStatus.textContent = translations[currentLanguage].form_status_sending || "Sending...";
        formStatus.style.color = 'var(--primary)';
        
        try {
            const res = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: json });
            const result = await res.json();
            
            if (result.success) {
                formStatus.textContent = translations[currentLanguage].form_status_success || "Message sent successfully!";
                formStatus.style.color = 'green';
                contactForm.reset();
            } else { throw new Error(result.message); }
        } catch (error) {
            formStatus.textContent = translations[currentLanguage].form_status_error || "An error occurred. Please try again.";
            formStatus.style.color = 'red';
        } finally {
            setTimeout(() => formStatus.textContent = "", 5000);
        }
    };

    // --- Cursor and Hover Effects ---
    const setupCursor = () => {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        const logoFollower = document.querySelector('.logo-follower'); // New element selection
        
        document.querySelectorAll('a, button, .service-card-premium, .portfolio-item').forEach(el => {
            el.addEventListener('mouseenter', () => { gsap.to(follower, { duration: 0.3, scale: 1.5, backgroundColor: 'rgba(205, 164, 94, 0.2)' }); });
            el.addEventListener('mouseleave', () => { gsap.to(follower, { duration: 0.3, scale: 1, backgroundColor: 'transparent' }); });
        });
        
        // NEW: Mousemove logic for the logo follower
        window.addEventListener('mousemove', e => {
            gsap.to(cursor, { duration: 0.2, x: e.clientX, y: e.clientY });
            gsap.to(follower, { duration: 0.6, x: e.clientX, y: e.clientY, ease: 'power2.out' });
            // Added subtle lag for the logo follower
            gsap.to(logoFollower, { duration: 1.5, x: e.clientX, y: e.clientY, ease: 'expo.out' });
        });
    };
    
    // --- Service Card Animations ---
    const initPremiumServicesAnimations = () => {
        const servicesSection = document.querySelector('.services-section-premium');
        if (!servicesSection) return;

        gsap.registerPlugin({
            name: "drawSVG",
            init(target, value) {
                let path = target.querySelector("path") || target;
                if (!path.getTotalLength) return;
                let length = path.getTotalLength();
                path.style.strokeDasharray = length;
                this.add(path.style, "strokeDashoffset", length, (value === true || value === "100%") ? 0 : (value === false || value === "0%") ? length : gsap.utils.clamp(0, length, parseFloat(value)));
            }
        });

        const scroller = scroll ? scrollContainer : window;
        const tl = gsap.timeline({ scrollTrigger: { trigger: servicesSection, scroller: scroller, start: 'top 70%', toggleActions: 'play none none none', refreshPriority: 1 } });
        tl.from(".section-title-premium", { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' })
            .from(".section-title-premium .shimmer", { x: '-150%', duration: 1.2, ease: 'power2.inOut' }, "-=0.8");

        gsap.from(".service-card-premium", { scrollTrigger: { trigger: ".services-grid-premium", scroller: scroller, start: "top 80%", refreshPriority: 1 }, opacity: 0, y: 50, scale: 0.95, duration: 0.6, stagger: 0.15, ease: 'power3.out' });

        const icons = {
            arch: document.querySelector('#icon-arch svg'), '3d': document.querySelector('#icon-3d svg'), light: document.querySelector('#icon-light svg'), plan: document.querySelector('#icon-plan svg'),
            manage: document.querySelector('#icon-manage svg'), smart: document.querySelector('#icon-smart svg'), business: document.querySelector('#icon-business svg'), electric: document.querySelector('#icon-electric svg'),
        };
        const addHoverAnimation = (icon, animation) => {
            if(icon) {
                const parentCard = icon.closest('.service-card-premium');
                parentCard.addEventListener('mouseenter', () => animation.play());
                parentCard.addEventListener('mouseleave', () => animation.reverse());
            }
        };
        
        if (icons.arch) addHoverAnimation(icons.arch, gsap.to(icons.arch.querySelectorAll('path'), { drawSVG: true, duration: 1, ease: 'power2.inOut', paused: true, stagger: 0.2 }));
        if (icons['3d']) addHoverAnimation(icons['3d'], gsap.to(icons['3d'], { rotateZ: 360, duration: 1.5, ease: 'power2.inOut', paused: true, transformOrigin: "center center", onReverseComplete: () => gsap.set(icons['3d'], {clearProps: "transformOrigin, rotateZ"}) }));
        if(icons.light) { const anim = gsap.to(icons.light, { scale: 1.2, filter: 'drop-shadow(0 0 10px #d4af37)', duration: 0.5, yoyo: true, repeat: -1, ease: 'power1.inOut' }).pause(); icons.light.closest('.service-card-premium').addEventListener('mouseenter', () => anim.play()); icons.light.closest('.service-card-premium').addEventListener('mouseleave', () => { anim.pause(); gsap.to(icons.light, { scale: 1, filter: 'none', duration: 0.3 }); }); }
        if(icons.plan) addHoverAnimation(icons.plan, gsap.to(icons.plan.querySelectorAll('path'), { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power2.out', paused: true, onStart: () => gsap.set(icons.plan.querySelectorAll('path'), { y: 10, opacity: 0 }) }));
        if(icons.manage) addHoverAnimation(icons.manage, gsap.to(icons.manage, { scale: 1.1, rotate: 5, duration: 0.3, ease: 'back.out(2)', paused: true }));
        if(icons.smart) addHoverAnimation(icons.smart, gsap.to(icons.smart.querySelector('path:last-child'), { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', paused: true, onStart: () => gsap.set(icons.smart.querySelector('path:last-child'), { transformOrigin: 'center center', scale: 0.8, opacity: 0 }) }));
        if(icons.business) addHoverAnimation(icons.business, gsap.to(icons.business, { scale: 1.1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', paused: true, onStart: () => gsap.set(icons.business, { scale: 0.9, opacity: 0 }) }));
        if(icons.electric) { const anim = gsap.to(icons.electric, { filter: 'drop-shadow(0 0 8px #d4af37)', repeat: -1, yoyo: true, duration: 0.7, ease: 'power1.inOut' }).pause(); icons.electric.closest('.service-card-premium').addEventListener('mouseenter', () => anim.play()); icons.electric.closest('.service-card-premium').addEventListener('mouseleave', () => { anim.pause(); gsap.to(icons.electric, { filter: 'none', duration: 0.3 }); }); }
    };

    // --- Event Listeners and Initial Setup ---
    if (menuToggle) menuToggle.addEventListener('click', toggleMobileMenu);
    if (navbar) navbar.addEventListener('click', (e) => { if (e.target.matches('.nav-link')) closeMobileMenu(); });
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (langSelector) {
        langSelector.addEventListener('click', (e) => { e.stopPropagation(); const isOpen = langSelector.classList.toggle('open'); gsap.to(langChevron, { rotation: isOpen ? 180 : 0, duration: 0.3 }); });
        langDropdown.addEventListener('click', (e) => { 
            if (e.target.matches('[data-lang]')) { 
                applyLanguage(e.target.dataset.lang); 
                closeMobileMenu(); // Close menu after selection
                langSelector.classList.remove('open'); // Close dropdown
                gsap.to(langChevron, { rotation: 0, duration: 0.3 }); // Reset chevron
            } 
        });
    }
    document.addEventListener('click', () => { if (langSelector && langSelector.classList.contains('open')) { langSelector.classList.remove('open'); gsap.to(langChevron, { rotation: 0, duration: 0.3 }); } });
    if (contactForm) contactForm.addEventListener('submit', handleFormSubmit);
    
    // Back-to-Top
    if (backToTopBtn) backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                if (scroll && typeof scroll.scrollTo === 'function') {
                    scroll.scrollTo(targetElement);
                } else {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
                if (navbar.classList.contains('open')) closeMobileMenu();
            }
        });
    });

    applyTheme(currentTheme);
    // APPLY LANGUAGE IS CALLED HERE ONCE TO INIT CORRECT TEXTS AND DIR ATTRIBUTES
    applyLanguage(currentLanguage); 
    setupCursor();
});

// Boids Simulation script removed for stability as instructed.
