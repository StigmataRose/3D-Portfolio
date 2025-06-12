import*as o from"https://cdn.skypack.dev/three@0.129.0";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const c of t.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function r(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(e){if(e.ep)return;e.ep=!0;const t=r(e);fetch(e.href,t)}})();const j="/assets/me-B0POtYJS.png",S="/assets/education-6bRzp5Pn.jpg",M="/assets/project-CyvuVmsN.jpg",C="/assets/cat-D3-BaHgu.png",L="/assets/guitar-DDPhzZZM.jpg",z="/assets/ortho-DVtec-Bx.jpg",B="/assets/lynk-up-B3njfBjo.jpg",T="/assets/goat-xxRswLjG.gif",l=new o.Scene,h=new o.Scene,d=new o.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3);d.position.z=8;const D=new o.OrthographicCamera(-1,1,1,-1,0,1),a=new o.WebGLRenderer({canvas:document.querySelector("#bg"),alpha:!0,antialias:!0});a.setSize(window.innerWidth,window.innerHeight);a.shadowMap.enabled=!0;a.shadowMap.type=o.PCFSoftShadowMap;a.autoClear=!1;const O=`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,P=`
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
`,m=new o.ShaderMaterial({vertexShader:O,fragmentShader:P,uniforms:{u_time:{value:0},u_resolution:{value:new o.Vector2(window.innerWidth,window.innerHeight)}},depthWrite:!1}),E=new o.PlaneGeometry(2,2),I=new o.Mesh(E,m);h.add(I);const H=new o.AmbientLight(16777215,.5);l.add(H);const f=new o.DirectionalLight(16777215,1);f.position.set(10,10,10);f.castShadow=!0;l.add(f);const A=new o.TextureLoader,F=new o.CubeTextureLoader,R=F.load(["https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-x.jpg","https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-x.jpg","https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-y.jpg","https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-y.jpg","https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-z.jpg","https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-z.jpg"]);l.environment=R;const u=[j,S,M,C,L,z,B,T,"https://placehold.co/800x800/967E76/333?text=One+Buck+Compressor","https://placehold.co/800x800/C2B2B2/333?text=X+Synthesizer","https://placehold.co/800x800/B2C8DF/333?text=Drip+VST","https://placehold.co/800x800/C4D7E0/333?text=Spaz+VST","https://placehold.co/800x800/E2D5D5/333?text=Sandbox+Synth","https://placehold.co/800x800/D7C0AE/333?text=Lynk+Up+VST","https://placehold.co/800x800/968C83/333?text=Ortho+Insight+3D","https://placehold.co/800x800/A1BE95/333?text=Top+Shelf+Herbs","https://placehold.co/800x800/E2703A/333?text=Border+Protection+Portal"],g=document.querySelectorAll("main section"),v=[],p=new o.BoxGeometry(2.5,2.5,2.5);g.forEach((i,n)=>{let r;if(n===0){const s=new o.MeshPhysicalMaterial({color:16777215,metalness:0,roughness:0,ior:1.5,transparent:!0,opacity:.3,transmission:0});r=new o.Mesh(p,s);const e=new o.EdgesGeometry(p),t=new o.LineBasicMaterial({color:16777215}),c=new o.LineSegments(e,t);r.add(c)}else{const s=u[n]||u[u.length-1],e=A.load(s);e.anisotropy=a.capabilities.getMaxAnisotropy(),e.minFilter=o.LinearMipmapLinearFilter,e.magFilter=o.LinearFilter;const t=new o.MeshStandardMaterial({map:e});r=new o.Mesh(p,t)}r.castShadow=!0,r.receiveShadow=!0,r.position.x=3.5,l.add(r),v.push(r)});const _=new o.Clock;function x(){requestAnimationFrame(x);const i=_.getDelta();m.uniforms.u_time.value+=i,v.forEach((n,r)=>{const e=g[r].getBoundingClientRect(),t=window.innerHeight,c=e.top+e.height/2,y=t/2,w=(c-y)*.015,b=1-Math.exp(-4*i);n.position.z+=(w-n.position.z)*b,n.rotation.x+=.2*i,n.rotation.y+=.3*i}),a.clear(),a.render(h,D),a.clearDepth(),a.render(l,d)}x();window.addEventListener("resize",()=>{d.aspect=window.innerWidth/window.innerHeight,d.updateProjectionMatrix(),a.setSize(window.innerWidth,window.innerHeight),m.uniforms.u_resolution.value.set(window.innerWidth,window.innerHeight)});
