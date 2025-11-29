import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    // Match the off-white background of the app for seamless blending
    scene.background = new THREE.Color('#fdfbf7');
    // Fog adds depth and softens the distant objects
    scene.fog = new THREE.Fog('#fdfbf7', 15, 60);

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(20, 20, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xE6F0FF, 0.5); // Blue tint light
    dirLight2.position.set(-20, -10, 10);
    scene.add(dirLight2);

    // --- Geometries (Floating Shapes) ---
    const shapes: THREE.Mesh[] = [];
    
    // Low-poly geometric shapes fit the clean aesthetic
    const geometries = [
      new THREE.IcosahedronGeometry(2, 0),
      new THREE.OctahedronGeometry(1.5, 0),
      new THREE.TorusGeometry(1.5, 0.5, 16, 50),
      new THREE.SphereGeometry(1.2, 32, 32)
    ];
    
    // Pastel Palette: Blue, Peach, Cream, Light Indigo
    const colors = [0xE6F0FF, 0xFFF0E6, 0xFFFDD0, 0xE0E7FF];

    // Create scattered shapes
    for (let i = 0; i < 25; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshStandardMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        roughness: 0.4,
        metalness: 0.1,
        flatShading: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      
      // Random positions spread out in a cloud
      mesh.position.x = (Math.random() - 0.5) * 50;
      mesh.position.y = (Math.random() - 0.5) * 40;
      mesh.position.z = (Math.random() - 0.5) * 30 - 5;
      
      // Random initial rotation
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      
      const scale = 0.5 + Math.random() * 1.5;
      mesh.scale.set(scale, scale, scale);

      // Custom properties for animation stored in userData
      (mesh as any).userData = {
         rotSpeedX: (Math.random() - 0.5) * 0.003,
         rotSpeedY: (Math.random() - 0.5) * 0.003,
         floatSpeed: 0.005 + Math.random() * 0.01,
         yOffset: Math.random() * Math.PI * 2,
         originalY: mesh.position.y
      };

      scene.add(mesh);
      shapes.push(mesh);
    }

    // --- Animation Loop ---
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;

      shapes.forEach((mesh) => {
        // Rotate
        mesh.rotation.x += (mesh as any).userData.rotSpeedX;
        mesh.rotation.y += (mesh as any).userData.rotSpeedY;
        
        // Gentle floating (Bobbing up and down)
        mesh.position.y = (mesh as any).userData.originalY + Math.sin(time + (mesh as any).userData.yOffset) * 1.5;
      });

      renderer.render(scene, camera);
    };
    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometries.forEach(g => g.dispose());
      renderer.dispose();
    };
  }, []);

  // Opacity 0.6 to keep it subtle behind text
  return <div ref={mountRef} className="absolute inset-0 z-0 opacity-60 pointer-events-none" />;
};
