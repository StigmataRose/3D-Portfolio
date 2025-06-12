import * as THREE from 'https://cdn.skypack.dev/three@0.129.0';
import meImg from './assets/images/me.png';
import educationImg from './assets/images/education.jpg';
import projectImg from './assets/images/project.jpg';
import catImg from './assets/images/cat.png';
import guitarImg from './assets/images/guitar.jpg';
import orthoImg from './assets/images/ortho.jpg';
import lynkUpImg from './assets/images/lynk-up.jpg';
import goatImg from './assets/images/goat.gif';
import novaImg from './assets/images/nova.png';
// Main Scene (for the cubes)
const scene = new THREE.Scene();

// The "background" scene (for the shader)
const bgScene = new THREE.Scene();

// Camera for the main scene
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 8;

// A separate, orthographic camera for the background.
const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);


// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  alpha: true,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// **CRITICAL:** Turn off auto-clearing so we can render two scenes on top of each other.
renderer.autoClear = false;


// --- Shader Background ---

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// --- NEW FRAGMENT SHADER ---
const fragmentShader = `
  // Uniforms passed from Three.js
  uniform vec2 u_resolution;
  uniform float u_time;
  
  // Varying from vertex shader
  varying vec2 vUv;

  // Shadertoy compatibility defines
  #define iResolution vec3(u_resolution, 1.0)
  #define iTime u_time

  // --- All functions from the "Night Sky" shader go here ---

  // Hashes https://www.shadertoy.com/view/4djSRW
  float hash11(float p) {
      p = fract(p * 0.1031);
      p *= p + 33.33;
      p *= p + p;
      return fract(p);
  }

  float hash12(vec2 pos) {
      vec3 p3  = fract(vec3(pos.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
  }

  float hash13(vec3 p3) {
      p3 = fract(p3 * 0.1031);
      p3 += dot(p3, p3.zyx + 31.32);
      return fract((p3.x + p3.y) * p3.z);
  }

  vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
      p3 += dot(p3, p3.yxz + 33.33);
      return fract((p3.xxy + p3.yxx) * p3.zyx);
  }

  float noise(vec2 n) {
      vec4 b = vec4(floor(n), ceil(n)); 
      vec2 f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
      return mix(mix(hash12(b.xy), hash12(b.zy), f.x), mix(hash12(b.xw), hash12(b.zw), f.x), f.y);
  }

  // Atmospheric Distortion "Twinkling"
  float noise(vec2 coord, float n) {
      float componenta = hash13(vec3(coord, round(n - 0.5)));
      float componentb = hash13(vec3(coord, round(n + 0.5)));
      float componentc = mix(componenta, componentb, mod(n, 1.0));
      return componentc;
  }

  // FBM Terrain Line
  float noise(float coord) {
      float componenta = hash11(round(coord - 0.5));
      float componentb = hash11(round(coord + 0.5));
      return mix(componenta, componentb, mod(coord, 1.0));
  }
  
  // Color Offset
  vec3 colorednoise(vec2 coord, float n) {
      vec3 componenta = hash33(vec3(coord, round(n - 0.5)));
      vec3 componentb = hash33(vec3(coord, round(n + 0.5)));
      vec3 componentc = mix(componenta, componentb, mod(n, 1.0));
      return componentc;
  }

  // FBM
  #define octaves 8
  float fbm(vec2 x) {
      float v = 0.0;
      float a = 0.4;
      for(int i = 0; i < octaves; i++) {
          v += a * noise(x);
          x  = x * 2.0;
          a *= 0.6;
      }
      return v;
  }

  float fbm(float x) {
      float v = 0.0;
      float a = 0.5;
      for(int i = 0; i < octaves; i++) {
          v += a * noise(x);
          x  = x * 2.0;
          a *= 0.5;
      }
      return v;
  }

  // Blackbody Coloration
  vec3 blackbody(float temperature) {
      vec3 O = vec3(0.0);
      for(float i = 0.0; i < 3.0; i += 0.1) {
          float f = 1.0 + 0.5 * i;
          O[int(i)] += 10.0 * (f * f * f) / (exp((19e3 * f / temperature)) - 1.0);
      }
      return O;
  }

  // Stars
  vec3 stars(vec2 coord) {
      float luminance = max(0.0, (hash12(coord) - 0.985));
      float temperature = (hash12(coord + iResolution.xy) * 6000.0) + 4000.0;
      vec3 colorshift = normalize(colorednoise(coord, float(iTime * 16.0)));
      return (luminance * noise(coord, iTime * 4.0)) * blackbody(temperature) * 4.0 * (colorshift * 0.5 + 1.0);
  }

  // Galaxy
  float galaxygas(vec2 coord) {
      return max(0.0, fbm((coord * 4.0) + fbm(coord * 4.0)) - 0.35);
  }

  float galaxydust(vec2 coord) {
      return max(0.0, fbm((coord * 2.0) + fbm(coord * 2.0) + vec2(4.0, 4.0)) - 0.5);
  }

  // Nebula
  float nebula(vec2 coord) {
      float gas0 = max(0.0, fbm((coord * 2.0) + fbm(coord * 2.0) + vec2(4.0, 4.0)) - length(coord));
      float gas1 = max(0.0, fbm((coord * 4.0) + fbm(coord * 2.0) + vec2(4.0, 4.0)) - length(coord * 1.01));
      return max(0.0, gas0 - gas1);
  }

  // Original Main Image function from Shadertoy
  void mainImage(out vec4 fragColor, vec2 fragCoord){
      vec2 uv = 2.0 * (fragCoord - 0.5 * iResolution.xy) / max(iResolution.x, iResolution.y);

      if(fbm((uv.x + 4.0) * 4.0) > (uv.y + 0.5) * 4.0) {
          fragColor = vec4(0.0, 0.0, 0.0, 1.0);
          return;
      }

      vec3 star = stars(fragCoord);
      float gas = galaxygas(uv);
      vec3 dust = galaxydust(uv) * vec3(0.500, 0.400, 0.300);
      vec3 nebulae = nebula(uv)  * vec3(0.600, 0.500, 0.750);
      vec3 color = star + mix(vec3(gas), dust * 0.5, 0.75) + nebulae;

      fragColor = vec4(color, 1.0);
  }
  
  // --- Main entry point for Three.js ---
  void main() {
    // Call the original main function, passing the output variable and pixel coordinates
    mainImage(gl_FragColor, vUv * u_resolution);
  }
`;


const backgroundMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    u_time: { value: 0.0 },
    u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  },
  depthWrite: false,
});

const backgroundGeometry = new THREE.PlaneGeometry(2, 2);
const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
bgScene.add(backgroundMesh);


// Lights (belong in the main scene)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// --- Texture Loader ---
const textureLoader = new THREE.TextureLoader();

// Add an environment map for reflections
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMap = cubeTextureLoader.load([
    'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-x.jpg',
    'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-x.jpg',
    'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-y.jpg',
    'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-y.jpg',
    'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-z.jpg',
    'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-z.jpg',
]);
scene.environment = environmentMap;



// --- Image URLs (You can still define these, but the logic below will override for the last cube) ---
const imageUrls = [
    meImg,          // Use the imported variable
    educationImg,   // Use the imported variable
    projectImg,     // Use the imported variable
    catImg,         // Use the imported variable
    guitarImg,      // Use the imported variable
    orthoImg,       // Use the imported variable
    lynkUpImg,      // Use the imported variable
    goatImg,        // Use the imported variable
  
    // Keep the full URLs as strings
    'https://placehold.co/800x800/967E76/333?text=One+Buck+Compressor',
    'https://placehold.co/800x800/C2B2B2/333?text=X+Synthesizer',
    'https://placehold.co/800x800/B2C8DF/333?text=Drip+VST',
    'https://placehold.co/800x800/C4D7E0/333?text=Spaz+VST',
    'https://placehold.co/800x800/E2D5D5/333?text=Sandbox+Synth',
    'https://placehold.co/800x800/D7C0AE/333?text=Lynk+Up+VST',
    'https://placehold.co/800x800/968C83/333?text=Ortho+Insight+3D',
    'https://placehold.co/800x800/A1BE95/333?text=Top+Shelf+Herbs',
    'https://placehold.co/800x800/E2703A/333?text=Border+Protection+Portal'
  ];

// Main objects
const projects = document.querySelectorAll('main section');
const cubes = [];
const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);


projects.forEach((section, index) => {
    let cube;
    
    // Check if it's the last section
    const isLastSection = (index === projects.length - 1);

    if (index === 0) {
        // --- LOGIC FOR THE FIRST (GLASS) CUBE ---
        
        // *** MODIFIED: Use opacity for transparency and keep PBR shine ***
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0,
            roughness: 0,
            ior: 1.5,
            transparent: true,
            opacity: 0.3, // Use opacity for see-through effect
            transmission: 0, // Turn off transmission to avoid blackness
        });

        cube = new THREE.Mesh(geometry, glassMaterial);

        // *** NEW: Create and add white edges ***
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const wireframe = new THREE.LineSegments(edges, lineMaterial);
        cube.add(wireframe); // Add edges as a child of the cube

    } else if (isLastSection) {
        // --- LOGIC FOR THE LAST CUBE (novaImg, centered) ---
        const texture = textureLoader.load(novaImg);
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const material = new THREE.MeshStandardMaterial({ map: texture });
        cube = new THREE.Mesh(geometry, material);
        cube.position.x = 3.5; // Center the cube
    } else {
        // --- ORIGINAL LOGIC FOR ALL OTHER CUBES ---
        const imageUrl = imageUrls[index] || imageUrls[imageUrls.length - 1];
        const texture = textureLoader.load(imageUrl);
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const material = new THREE.MeshStandardMaterial({ map: texture });
        cube = new THREE.Mesh(geometry, material);
        cube.position.x = 3.5; // Maintain original position for others
    }
    
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);
    cubes.push(cube);
});

const clock = new THREE.Clock();

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // --- FIX 1: Calculate deltaTime ---
    const deltaTime = clock.getDelta();

    // Update the background shader's time uniform
    backgroundMaterial.uniforms.u_time.value += deltaTime;

    // --- FIX 2: Use 'cubes' and 'projects' instead of 'objects' and 'sections' ---
    // Animate objects based on scroll position
    cubes.forEach((mesh, index) => {
        const section = projects[index]; // Use 'projects'
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionCenter = rect.top + rect.height / 2;
        const screenCenter = windowHeight / 2;
        const delta = sectionCenter - screenCenter;

        const targetZ = delta * 0.015;
        const smoothingFactor = 4.0;
        const lerpAmount = 1.0 - Math.exp(-smoothingFactor * deltaTime);

        mesh.position.z += (targetZ - mesh.position.z) * lerpAmount;
        mesh.rotation.x += 0.2 * deltaTime;
        mesh.rotation.y += 0.3 * deltaTime;
    });

    // --- Multi-pass Render ---
    renderer.clear();
    renderer.render(bgScene, bgCamera);
    renderer.clearDepth();
    renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    backgroundMaterial.uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
});