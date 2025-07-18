import * as THREE from "https://cdn.skypack.dev/three@0.129.0";
import meImg from "./assets/images/me.png";
import educationImg from "./assets/images/education.png";
import projectImg from "./assets/images/project.png";
import catImg from "./assets/images/cat.png";
import guitarImg from "./assets/images/neckillusions.png";
import orthoImg from "./assets/images/ortho.jpg";
import lynkUpImg from "./assets/images/lynk-up.jpg";
import dripImg from "./assets/images/drip.png";
import goldImg from "./assets/images/gold.png";
import sandboxImg from "./assets/images/sandbox.png";
import spazImg from "./assets/images/spaz.png";
import xImg from "./assets/images/x.png";
import goatImg from "./assets/images/goat.png";
import agentsImg from "./assets/images/agents.png";
import universityImg from "./assets/images/university.jpeg";
import ideaImg from "./assets/images/idea.png";
import visionImg from "./assets/images/vision.png";
import novaImg from "./assets/images/me.png";
import motionImg from "./assets/images/motion.png";
import soloImg from "./assets/images/solo.png";
import twaImg from "./assets/images/twa.png";
import volitionImg from "./assets/images/volition.png";
// Main Scene (for the cubes)
const scene = new THREE.Scene();

// The "background" scene (for the shader)
const bgScene = new THREE.Scene();

// Camera for the main scene
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 8;

// A separate, orthographic camera for the background.
const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
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
    u_resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
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
  "https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-x.jpg",
  "https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-x.jpg",
  "https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-y.jpg",
  "https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-y.jpg",
  "https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-z.jpg",
  "https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-z.jpg",
]);
scene.environment = environmentMap;

// --- Image URLs (You can still define these, but the logic below will override for the last cube) ---
const imageUrls = [
  meImg, // Use the imported variable
  educationImg, // Use the imported variable
  projectImg, // Use the imported variable
  catImg, // Use the imported variable
  guitarImg, // Use the imported variable
  orthoImg, // Use the imported variable
  lynkUpImg, // Use the imported variable
  goatImg, // Use the imported variable
  agentsImg,
  universityImg,
  // Keep the full URLs as strings
  ideaImg,
  visionImg,
  "https://placehold.co/800x800/C2B2B2/333?text=X+Synthesizer",
  "https://placehold.co/800x800/B2C8DF/333?text=Drip+VST",
  "https://placehold.co/800x800/C4D7E0/333?text=Spaz+VST",
  "https://placehold.co/800x800/E2D5D5/333?text=Sandbox+Synth",
  "https://placehold.co/800x800/D7C0AE/333?text=Lynk+Up+VST",
  "https://placehold.co/800x800/968C83/333?text=Ortho+Insight+3D",
  "https://placehold.co/800x800/A1BE95/333?text=Top+Shelf+Herbs",
  "https://placehold.co/800x800/E2703A/333?text=Border+Protection+Portal",
];

function createCubeWithMultipleFaces(images) {
  const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5); // A basic cube geometry

  const materials = [];

  images.forEach(imagePath => {
      const texture = textureLoader.load(imagePath);
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      materials.push(new THREE.MeshStandardMaterial({ map: texture }));
  });

  const cube = new THREE.Mesh(geometry, materials);
  cube.position.x = 3.5; // Center the cube
  return cube;
}

// Main objects
const projects = document.querySelectorAll("main section");
const cubes = [];
const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);

projects.forEach((section, index) => {
  let cube;

  // Check if it's the last section
  const isLastSection = index === projects.length - 1;

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
  } 
  else if (index == 5 ) {
    const images = [orthoImg, orthoImg, motionImg, motionImg, orthoImg, orthoImg];
    cube = createCubeWithMultipleFaces(images);
  }
  else if (index == 6 ) {
    const images = [lynkUpImg, lynkUpImg, soloImg, soloImg, lynkUpImg, lynkUpImg];
    cube = createCubeWithMultipleFaces(images);
  }
  else if (index == 7 ) {
    const images = [dripImg, goldImg, twaImg, twaImg, xImg, sandboxImg];
    cube = createCubeWithMultipleFaces(images);
  } 
  else if (index == 8 ) {
    const images = [agentsImg, agentsImg, volitionImg, volitionImg, agentsImg, agentsImg];
    cube = createCubeWithMultipleFaces(images);
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

// --- Shooting Stars and Meteor Showers ---
const shootingStars = [];
const SHOOTINg_STAR_CHANCE = 0.0005; // Chance per frame for a shower
const SHOOTING_STAR_COUNT = 5; // Max simultaneous shooting stars
const METEOR_SHOWER_CHANCE = 0.000005; // Chance per frame for a shower
const METEOR_SHOWER_COUNT = 10; // Number of meteors in a shower

class ShootingStar {
  constructor() {
    const points = [];
    // Start slightly above the top of the screen
    this.x = (Math.random() - 0.5) * 25; // Random X within view
    this.y = (Math.random() * 5) + 8; // Start high up, above the camera's view
    this.z = (Math.random() * -10) - 5; // Random Z depth behind cubes
    this.speed = Math.random() * 0.2 + 0.1; // Speed of the star
    this.length = Math.random() * 1.5 + 0.5; // Length of the tail

    // Direction (down-left bias)
    this.directionX = -0.5 - Math.random() * 0.5;
    this.directionY = -0.5 - Math.random() * 0.5;
    this.directionZ = Math.random() * 0.5 - 0.25; // Some Z movement

    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 1,
      transparent: true,
      blending: THREE.AdditiveBlending, // Makes them glow
    });

    points.push(new THREE.Vector3(this.x, this.y, this.z));
    points.push(new THREE.Vector3(this.x + this.directionX * this.length, this.y + this.directionY * this.length, this.z + this.directionZ * this.length));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.mesh = new THREE.Line(geometry, material);
    scene.add(this.mesh);

    this.life = 1.0; // From 1.0 (full opacity) to 0.0 (faded)
    this.initialY = this.y;
    this.speedMultiplier = 1.0; // For meteor showers
  }

  update(deltaTime) {
    // Move the star
    this.x += this.directionX * this.speed * this.speedMultiplier;
    this.y += this.directionY * this.speed * this.speedMultiplier;
    this.z += this.directionZ * this.speed * this.speedMultiplier;

    // Update geometry positions for the moving tail
    const positions = this.mesh.geometry.attributes.position.array;
    positions[0] = this.x;
    positions[1] = this.y;
    positions[2] = this.z;
    positions[3] = this.x + this.directionX * this.length;
    positions[4] = this.y + this.directionY * this.length;
    positions[5] = this.z + this.directionZ * this.length;
    this.mesh.geometry.attributes.position.needsUpdate = true;

    // Fade out
    this.life -= deltaTime * (0.5 + Math.random() * 0.5); // Faster fade
    this.mesh.material.opacity = Math.max(0, this.life);

    // Remove if off screen or faded
    if (this.life <= 0 || this.y < -8) { // If it goes below the screen or fades
      scene.remove(this.mesh);
      return false; // Indicate it should be removed from the array
    }
    return true; // Keep in the array
  }
}

function spawnShootingStar() {
  if (shootingStars.length < SHOOTING_STAR_COUNT) {
    shootingStars.push(new ShootingStar());
  }
}

function spawnMeteorShower() {
    for (let i = 0; i < METEOR_SHOWER_COUNT; i++) {
        const star = new ShootingStar();
        // Give meteors in a shower a similar, more pronounced direction
        star.directionX = -1.0 - Math.random() * 0.5;
        star.directionY = -1.0 - Math.random() * 0.5;
        star.directionZ = Math.random() * 0.5 - 0.25;
        star.speedMultiplier = 1.5 + Math.random() * 1.0; // Faster
        star.length = Math.random() * 2.0 + 1.0; // Longer tails
        // Stagger their starting positions slightly for a "shower" effect
        star.x = (Math.random() - 0.5) * 30 + (Math.random() * 10);
        star.y = (Math.random() * 10) + 10;
        star.z = (Math.random() * -15) - 5;
        star.life = 0.5 + Math.random() * 0.5; // Shorter initial life, more varied fade
        star.mesh.material.color.setRGB(Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1.0); // Slightly bluish tint for meteors
        shootingStars.push(star);
    }
}


const clock = new THREE.Clock();

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // --- FIX 1: Calculate deltaTime ---
  const deltaTime = clock.getDelta();
  // Update the background shader's time uniform
  backgroundMaterial.uniforms.u_time.value += deltaTime;
  // --- Shooting Star Logic ---
  // Periodically try to spawn a single shooting star
  if (Math.random() < SHOOTINg_STAR_CHANCE) { // Adjust this value for frequency
    spawnShootingStar();
  }

  // Random chance for a meteor shower
  if (Math.random() < METEOR_SHOWER_CHANCE) {
    spawnMeteorShower();
  }


  // Update and clean up shooting stars
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    if (!shootingStars[i].update(deltaTime)) {
      shootingStars.splice(i, 1);
    }
  }

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
  renderer.clearDepth(); // This is crucial for rendering shooting stars AND cubes on top of the background.
  renderer.render(scene, camera);
}

animate();

// Handle Window Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  backgroundMaterial.uniforms.u_resolution.value.set(
    window.innerWidth,
    window.innerHeight,
  );
});