import { useEffect, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export type CinematicState = { progress: number; paused: boolean; reduced: boolean };

function dialTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(500, 430, 50, 512, 512, 650);
  grad.addColorStop(0, "#30342e");
  grad.addColorStop(0.5, "#20241f");
  grad.addColorStop(1, "#101510");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 720; i++) {
    const a = (i * Math.PI) / 360;
    ctx.strokeStyle = i % 2 ? "rgba(230,230,200,.022)" : "rgba(0,0,0,.1)";
    ctx.beginPath();
    ctx.moveTo(512, 512);
    ctx.lineTo(512 + Math.cos(a) * 510, 512 + Math.sin(a) * 510);
    ctx.stroke();
  }
  ctx.strokeStyle = "#85867a";
  ctx.lineWidth = 1;
  for (const r of [415, 449]) {
    ctx.beginPath();
    ctx.arc(512, 512, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    ctx.strokeStyle = i % 5 === 0 ? "#b7baa8" : "#858977";
    ctx.lineWidth = i % 5 === 0 ? 3 : 2;
    ctx.beginPath();
    ctx.moveTo(512 + Math.sin(a) * 425, 512 - Math.cos(a) * 425);
    ctx.lineTo(
      512 + Math.sin(a) * (i % 5 === 0 ? 447 : 438),
      512 - Math.cos(a) * (i % 5 === 0 ? 447 : 438),
    );
    ctx.stroke();
  }
  ctx.textAlign = "center";
  ctx.fillStyle = "#d1d1ba";
  ctx.font = "36px Georgia";
  ctx.fillText("M E R I D I A N", 512, 337);
  ctx.font = "13px Arial";
  ctx.fillText("O B J E C T S   O F   T I M E", 512, 369);
  ctx.font = "italic 28px Georgia";
  ctx.fillText("Automatic", 512, 680);
  ctx.font = "14px Arial";
  ctx.fillText("S E R I E S   0 1", 512, 715);
  ctx.fillStyle = "#e6e3d8";
  ctx.fillRect(784, 492, 65, 43);
  ctx.fillStyle = "#20221c";
  ctx.font = "25px Arial";
  ctx.fillText("16", 817, 522);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createGear(radius: number, teeth: number, material: THREE.Material) {
  const shape = new THREE.Shape();
  for (let i = 0; i <= teeth * 4; i++) {
    const angle = (i / (teeth * 4)) * Math.PI * 2;
    const r = radius * (i % 4 === 1 || i % 4 === 2 ? 1 : 0.87);
    if (i === 0) shape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    else shape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  const hole = new THREE.Path();
  hole.absarc(0, 0, radius * 0.32, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  for (let i = 0; i < 6; i++) {
    const angle = i * Math.PI / 3;
    const aperture = new THREE.Path();
    aperture.absarc(Math.cos(angle) * radius * 0.59, Math.sin(angle) * radius * 0.59, radius * 0.145, 0, Math.PI * 2, true);
    shape.holes.push(aperture);
  }
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.09,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 1,
    steps: 1,
  });
  return new THREE.Mesh(geo, material);
}

export default function WatchScene({ state }: { state: MutableRefObject<CinematicState> }) {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const el = host.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      setFailed(true);
      return;
    }
    const gl = renderer.getContext();
    const debug = gl.getExtension("WEBGL_debug_renderer_info");
    const gpu = debug ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : "";
    const software = /swiftshader|llvmpipe|software/i.test(gpu);
    renderer.setPixelRatio(software ? 0.65 : Math.min(devicePixelRatio, 1.4));
    renderer.setClearColor("#171816");
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !software;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.shadowMap.autoUpdate = false;
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#171816", 0.017);
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 120);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    room.dispose();
    const silver = new THREE.MeshStandardMaterial({
      color: "#b5b4a9",
      metalness: 0.95,
      roughness: 0.24,
      envMapIntensity: 1.4,
    });
    const polished = new THREE.MeshStandardMaterial({
      color: "#d2d4c9",
      metalness: 1,
      roughness: 0.12,
      envMapIntensity: 1.8,
    });
    const darkMetal = new THREE.MeshStandardMaterial({
      color: "#343932",
      metalness: 0.87,
      roughness: 0.38,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: "#ad8050",
      metalness: 0.86,
      roughness: 0.29,
    });
    const lume = new THREE.MeshStandardMaterial({
      color: "#eee9cd",
      metalness: 0.3,
      roughness: 0.38,
    });
    const red = new THREE.MeshStandardMaterial({
      color: "#bd4c2b",
      metalness: 0.6,
      roughness: 0.3,
    });
    const watch = new THREE.Group();
    scene.add(watch);
    const layers: THREE.Group[] = [];
    function layer(z: number) {
      const g = new THREE.Group();
      g.position.z = z;
      g.userData.base = z;
      watch.add(g);
      layers.push(g);
      return g;
    }
    function cylinder(r: number, depth: number, mat: THREE.Material) {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, depth, 96), mat);
      m.rotation.x = Math.PI / 2;
      m.castShadow = true;
      m.receiveShadow = true;
      return m;
    }
    function ring(r: number, tube: number, mat: THREE.Material) {
      const m = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 12, 128), mat);
      m.castShadow = true;
      return m;
    }
    function box(w: number, h: number, d: number, mat: THREE.Material) {
      const mesh = new THREE.Mesh(
        new RoundedBoxGeometry(w, h, d, 1, Math.min(w, h, d) * 0.18),
        mat,
      );
      mesh.castShadow = true;
      return mesh;
    }
    const base = layer(0);
    base.add(cylinder(2.18, 0.45, silver));
    const back = ring(2.13, 0.075, polished);
    back.position.z = -0.24;
    base.add(back);
    const crown = cylinder(0.27, 0.36, polished);
    crown.rotation.y = Math.PI / 2;
    crown.position.set(2.3, 0, 0.06);
    base.add(crown);
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2;
      const notch = box(0.025, 0.09, 0.025, darkMetal);
      notch.position.set(2.32, Math.sin(a) * 0.27, Math.cos(a) * 0.27);
      base.add(notch);
    }
    for (const sign of [-1, 1]) {
      for (const side of [-1, 1]) {
        const lug = box(0.4, 0.8, 0.32, silver);
        lug.position.set(side * 1.15, sign * 2.04, -0.08);
        lug.rotation.z = sign * side * -0.22;
        base.add(lug);
      }
      for (let i = 0; i < 9; i++) {
        const link = new THREE.Group();
        link.position.set(0, sign * (2.38 + i * 0.37), -0.09 - i * i * 0.025);
        for (const side of [-1, 1]) {
          const end = box(0.57, 0.33, 0.24, silver);
          end.position.x = side * 0.79;
          link.add(end);
        }
        const center = box(0.95, 0.315, 0.29, polished);
        center.position.z = 0.035;
        link.add(center);
        link.rotation.x = sign * (0.025 + i * 0.055);
        base.add(link);
      }
    }
    const mechanics = layer(0.15);
    mechanics.add(cylinder(1.97, 0.12, darkMetal));
    const gears: THREE.Mesh[] = [];
    const gearSpecs = [
      [0, 0, 0.73, 32],
      [0.94, 0.35, 0.57, 26],
      [-0.88, 0.65, 0.61, 28],
      [-0.71, -0.8, 0.74, 32],
      [0.75, -0.83, 0.52, 24],
      [0.05, 1.23, 0.39, 20],
    ];
    for (const [x, y, r, t] of gearSpecs) {
      const g = createGear(r!, t!, gold);
      g.position.set(x!, y!, 0.09);
      gears.push(g);
      mechanics.add(g);
      const axle = cylinder(0.055, 0.19, polished);
      axle.position.set(x!, y!, 0.19);
      mechanics.add(axle);
    }
    for (let i = 0; i < 8; i++) {
      const screw = cylinder(0.055, 0.04, polished);
      const a = (i * Math.PI) / 4;
      screw.position.set(Math.cos(a) * 1.78, Math.sin(a) * 1.78, 0.14);
      mechanics.add(screw);
    }
    const balance = ring(0.41, 0.04, polished);
    balance.position.set(-0.75, -0.8, 0.15);
    mechanics.add(balance);
    for (let i = 0; i < 4; i++) {
      const spiral = ring(0.08 + i * 0.075, 0.008, gold);
      spiral.position.copy(balance.position);
      mechanics.add(spiral);
    }
    const face = layer(0.32);
    const dial = cylinder(1.93, 0.08, darkMetal);
    // A circle mapped in the dial plane preserves the printed typography.
    dial.material = darkMetal;
    face.add(dial);
    const printed = new THREE.Mesh(
      new THREE.CircleGeometry(1.925, 96),
      new THREE.MeshStandardMaterial({
        map: dialTexture(),
        color: "#859574",
        metalness: 0.12,
        roughness: 0.58,
        envMapIntensity: 0.2,
      }),
    );
    printed.position.z = 0.048;
    face.add(printed);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const marker = box(0.095, i === 0 ? 0.31 : 0.25, 0.055, polished);
      marker.position.set(Math.sin(a) * 1.59, Math.cos(a) * 1.59, 0.08);
      marker.rotation.z = -a;
      face.add(marker);
      const inset = box(0.038, 0.17, 0.015, lume);
      inset.position.copy(marker.position);
      inset.position.z += 0.036;
      inset.rotation.z = -a;
      face.add(inset);
    }
    const hands = layer(0.46);
    function hand(length: number, width: number, angle: number, mat: THREE.Material, z: number) {
      const pivot = new THREE.Group();
      const h = box(width, length, 0.035, mat);
      h.position.y = length / 2 - 0.14;
      pivot.add(h);
      const inner = box(width * 0.38, length * 0.73, 0.008, lume);
      inner.position.set(0, length / 2 - 0.12, 0.023);
      pivot.add(inner);
      pivot.rotation.z = angle;
      pivot.position.z = z;
      hands.add(pivot);
      return pivot;
    }
    hand(1.05, 0.12, Math.PI / 3, polished, 0);
    hand(1.48, 0.078, -Math.PI / 3, polished, 0.045);
    const second = hand(1.72, 0.021, -2.3, red, 0.08);
    const cap = cylinder(0.09, 0.085, polished);
    cap.position.z = 0.13;
    hands.add(cap);
    const bezel = layer(0.42);
    bezel.add(ring(2.02, 0.12, polished));
    bezel.add(ring(1.92, 0.023, gold));
    for (let i = 0; i < 120; i++) {
      const a = (i / 120) * Math.PI * 2;
      const ridge = box(0.021, 0.07, 0.042, silver);
      ridge.position.set(Math.sin(a) * 2.08, Math.cos(a) * 2.08, 0.032);
      ridge.rotation.z = -a;
      bezel.add(ridge);
    }
    // Monumental concentric architecture, each ring independently choreographed.
    const architecture = new THREE.Group();
    architecture.position.set(2.5, 0, -4.5);
    scene.add(architecture);
    const arches: THREE.Group[] = [];
    for (let j = 0; j < 4; j++) {
      const g = new THREE.Group();
      g.position.z = -j * 2.1;
      architecture.add(g);
      arches.push(g);
      const r = 5.15 + j * 0.76;
      const metal = new THREE.MeshStandardMaterial({
        color: j % 2 ? "#45453d" : "#67685a",
        metalness: 0.8,
        roughness: 0.5,
      });
      g.add(ring(r, 0.075, metal));
      g.add(ring(r + 0.19, 0.016, gold));
      // Heavy segmented observatory arches frame the finer concentric mechanism.
      for (let k = 0; k < 3; k++) {
        const arch = new THREE.Mesh(new THREE.TorusGeometry(r + 0.4, 0.16, 8, 48, 1.25), metal);
        arch.rotation.z = (k * Math.PI * 2) / 3 + j * 0.2;
        arch.position.z = -0.3;
        g.add(arch);
      }
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        const rib = box(0.025, 0.44, 0.28, metal);
        rib.position.set(Math.sin(a) * r, Math.cos(a) * r, 0);
        rib.rotation.z = -a;
        g.add(rib);
      }
    }
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(140, 140),
      new THREE.MeshStandardMaterial({
        color: "#11130f",
        metalness: 0.15,
        roughness: 0.85,
        envMapIntensity: 0.2,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -6.6;
    floor.receiveShadow = true;
    scene.add(floor);
    // Bake each static assembly to a handful of material batches, rather than hundreds of draw calls.
    function batch(group: THREE.Group) {
      group.updateMatrixWorld(true);
      const inverse = group.matrixWorld.clone().invert();
      const buckets = new Map<THREE.Material, THREE.BufferGeometry[]>();
      group.traverse((o) => {
        if (o instanceof THREE.Mesh && !Array.isArray(o.material)) {
          const geometry = (
            o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone()
          ).applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, o.matrixWorld));
          const bucket = buckets.get(o.material) || [];
          bucket.push(geometry);
          buckets.set(o.material, bucket);
          o.geometry.dispose();
        }
      });
      group.clear();
      buckets.forEach((geometries, material) => {
        const geo = mergeGeometries(geometries, false);
        geometries.forEach((g) => g.dispose());
        if (geo) {
          const m = new THREE.Mesh(geo, material);
          m.castShadow = true;
          m.receiveShadow = true;
          group.add(m);
        }
      });
    }
    batch(base);
    batch(face);
    batch(bezel);
    arches.forEach(batch);
    scene.add(new THREE.HemisphereLight("#dfdfcb", "#151711", 0.45));
    const key = new THREE.SpotLight("#fff0d2", 45, 45, 0.48, 0.8, 1.2);
    key.position.set(-3, 9, 9);
    key.target = watch;
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    const rim = new THREE.PointLight("#d8dce0", 35, 28, 1.6);
    rim.position.set(8, 3, -1);
    scene.add(rim);
    const warm = new THREE.PointLight("#c77b47", 18, 20, 1.7);
    warm.position.set(0, -3, 4);
    scene.add(warm);
    // Layered translucent cones suggest light suspended in a hazy observatory.
    const beams = new THREE.Group();
    scene.add(beams);
    for (let i = 0; i < 3; i++) {
      const beam = new THREE.Mesh(
        new THREE.ConeGeometry(2.8, 18, 32, 1, true),
        new THREE.MeshBasicMaterial({
          color: "#dfd4af",
          transparent: true,
          opacity: 0.017,
          depthWrite: false,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        }),
      );
      beam.position.set(1 + i * 3, 2, -4 - i * 3);
      beam.rotation.z = -0.4;
      beams.add(beam);
    }
    const positions = new Float32Array(330 * 3);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 25;
      positions[i + 1] = (Math.random() - 0.5) * 17;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({
        color: "#c9b58b",
        size: 0.018,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      }),
    );
    scene.add(particles);
    let width = el.clientWidth,
      height = el.clientHeight,
      visible = true,
      raf = 0,
      time = 0,
      last = 0,
      rendered = false,
      shadowProgress = -1,
      shadowTime = -1,
      lastReduced = state.current.reduced;
    const mouse = new THREE.Vector2();
    const mouseNow = new THREE.Vector2();
    function pointer(e: PointerEvent) {
      mouse.set((e.clientX / width - 0.5) * 2, (e.clientY / height - 0.5) * 2);
    }
    window.addEventListener("pointermove", pointer, { passive: true });
    const resize = new ResizeObserver(() => {
      width = el.clientWidth;
      height = el.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      rendered = false;
    });
    resize.observe(el);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry!.isIntersecting;
      },
      { rootMargin: "150px" },
    );
    observer.observe(el);
    const ease = (a: number, b: number, p: number) =>
      THREE.MathUtils.lerp(a, b, THREE.MathUtils.smoothstep(p, 0, 1));
    function animate(now: number) {
      raf = requestAnimationFrame(animate);
      const dt = Math.min((now - last) / 1000, 1);
      last = now;
      if (!visible || document.hidden) return;
      const s = state.current;
      if (s.reduced !== lastReduced) {
        rendered = false;
        lastReduced = s.reduced;
      }
      if ((s.paused || s.reduced) && rendered) return;
      time += dt;
      const p = s.reduced ? 0 : s.progress;
      const intro = s.reduced ? 1 : THREE.MathUtils.smoothstep(time, 0, 2.6);
      const mobile = width < 760;
      // The camera sweeps from the dial into the exploded movement, then pulls back.
      const explore = THREE.MathUtils.smoothstep(p, 0.14, 0.37);
      const reveal = THREE.MathUtils.smoothstep(p, 0.54, 0.79);
      const outro = THREE.MathUtils.smoothstep(p, 0.82, 1);
      const explosion = Math.sin(THREE.MathUtils.smoothstep(p, 0.19, 0.77) * Math.PI);
      mouseNow.lerp(mouse, 0.025);
      const baseX = mobile ? 0 : 2.75;
      watch.position.set(ease(baseX, 0, explore) * (1 - reveal) + baseX * reveal, -0.05, 0);
      watch.rotation.set(
        ease(-0.13, 0.1, explore) - reveal * 0.23,
        ease(-0.36, 0.65, explore) - reveal * 1 + (1 - intro) * 0.65,
        ease(-0.32, 0.1, explore) - reveal * 0.3 + (1 - intro) * 0.2,
      );
      if (!s.reduced) {
        watch.rotation.y += Math.sin(time * 0.25) * 0.023 + mouseNow.x * 0.022;
        watch.rotation.x += mouseNow.y * 0.014;
      }
      const scale = mobile ? 0.77 : 1;
      watch.scale.setScalar(scale * (1 - outro * 0.14));
      layers.forEach((g, i) => {
        g.position.z = g.userData.base + explosion * (i - 1) * 1.35;
        g.rotation.z = explosion * (i === 1 ? -0.28 : i * 0.06);
      });
      face.position.y = explosion * 2.2;
      face.position.x = explosion * 0.8;
      camera.position.set(
        ease(0, -1.2, explore) + reveal * 1.2 - (1 - intro) * 3,
        ease(0.1, 1.1, explore),
        ease(mobile ? 16 : 15, 12, explore) + outro * 4 + (1 - intro) * 4,
      );
      camera.lookAt(mobile ? 0 : 0.4, 0, explosion * 1.5);
      camera.fov = ease(36, 30, explore) + reveal * 6;
      camera.updateProjectionMatrix();
      architecture.rotation.z = -0.12 + explore * 0.25 - reveal * 0.4;
      architecture.position.x = ease(2.5, 0, explore);
      architecture.position.z = -4.5 + explore * 2 - reveal * 2;
      arches.forEach((g, i) => {
        g.rotation.z = (i % 2 ? 1 : -1) * (explore * 0.22 + time * 0.003);
        g.rotation.y = explosion * (i - 1.5) * 0.16;
      });
      gears.forEach((g, i) => {
        g.rotation.z = time * (i % 2 ? -0.13 : 0.1);
      });
      second.rotation.z = -2.3 - time * 0.015;
      particles.rotation.y = time * 0.008;
      particles.position.y = Math.sin(time * 0.06) * 0.3;
      rim.intensity = 35 + explosion * 20;
      warm.intensity = 18 + explosion * 12;
      if (Math.abs(p - shadowProgress) > 0.006 || time - shadowTime > 1) {
        renderer.shadowMap.needsUpdate = true;
        shadowProgress = p;
        shadowTime = time;
      }
      renderer.render(scene, camera);
      rendered = true;
    }
    raf = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      observer.disconnect();
      window.removeEventListener("pointermove", pointer);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Points) {
          o.geometry.dispose();
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => {
            if ("map" in m && m.map instanceof THREE.Texture) m.map.dispose();
            m.dispose();
          });
        }
      });
      environment.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [state]);
  return (
    <div
      ref={host}
      className="watch-canvas"
      aria-label="Interactive three-dimensional Meridian watch, with an exploded mechanical movement"
    >
      {failed && (
        <div className="webgl-fallback">
          <span>MERIDIAN</span>
          <p>
            A world of precision.
            <br />
            Explore our collection below.
          </p>
        </div>
      )}
    </div>
  );
}
