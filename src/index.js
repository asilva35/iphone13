import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Debug } from './Debug.js';
import LocomotiveScroll from 'locomotive-scroll';
//import "splitting/dist/splitting.css";
//import "splitting/dist/splitting-cells.css";
import Splitting from 'splitting';

export default class Main {
  constructor(options) {
    const that = this;

    this.debugObject = {};

    this.debugObject.clearColor = '#e5e5e5';
    this.debugObject.fogNear = 2.2;
    this.debugObject.fogFar = 14;

    this.scene = new THREE.Scene();
    //this.scene.background = new THREE.Color(this.debugObject.clearColor);
    //this.scene.fog = new THREE.Fog(new THREE.Color(this.debugObject.clearColor), this.debugObject.fogNear , this.debugObject.fogFar);

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGL1Renderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.setClearColor(0xfafafa, 0);

    this.currentAnimation = 1;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    this.debugObject.camera_lookat = { x: 0, y: 0, z: 0 };
    this.camera.position.set(0, 0, 2);
    this.camera.lookAt(
      new THREE.Vector3(
        this.debugObject.camera_lookat.x,
        this.debugObject.camera_lookat.y,
        this.debugObject.camera_lookat.z
      )
    );

    //  const axesHelper = new THREE.AxesHelper( 5 );
    //  this.scene.add( axesHelper );

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    //this.controls.target = new THREE.Vector3(0,0,0)
    /* this.controls.minDistance = 5;
        this.controls.maxDistance = 10;
        this.controls.screenSpacePanning = true
        this.controls.enableKeys = false
        this.controls.zoomSpeed = 0.25
        this.controls.enableDamping = true
        this.controls.update();*/

    this.lastTime = 0;
    this.clock = new THREE.Clock();

    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('./draco/');

    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    this.debugObject.renderer_env_map_intensity = 5;

    this.addObjects();
    this.resize();
    this.tick();
    this.setupResize();
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  addObjects() {
    let that = this;

    this.gltfLoader.load('models/apple_iphone_13_pro_max.glb', (gltf) => {
      this.scene.add(gltf.scene);
      this.updateAllMaterials();
      this.animateCamera(1);
      if (this.width <= 1200) gltf.scene.scale.set(0.8, 0.8, 0.8);
    });

    // const geometryFloor = new THREE.PlaneGeometry( 20, 20 );
    // const materialFloor = new THREE.MeshStandardMaterial( {color: this.debugObject.clearColor} );
    // const floor = new THREE.Mesh( geometryFloor, materialFloor );
    // this.scene.add( floor );

    // floor.rotation.x = -Math.PI/2;
    // floor.position.y = -0.51;
    // floor.receiveShadow = true;

    this.addLights();

    this.addCubeTexture();
  }

  addCubeTexture() {
    this.cubeTextLoader = new THREE.CubeTextureLoader();
    this.environmentMap = this.cubeTextLoader.load([
      'textures/6/px.png',
      'textures/6/nx.png',
      'textures/6/py.png',
      'textures/6/ny.png',
      'textures/6/pz.png',
      'textures/6/nz.png',
    ]);
    this.environmentMap.encoding = THREE.sRGBEncoding;
    this.scene.background = this.environmentMap;
    this.scene.environment = this.environmentMap;
  }

  addLights() {
    this.lights = [];

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    this.lights.push(
      this.addDirectionalLight({
        intensity: 1.25,
        position: {
          x: 0,
          y: 0.5,
          z: 5,
        },
        scale: {
          x: 0.1,
          y: 0.1,
          z: 0.1,
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0,
        },
        helper: false,
      })
    );

    this.lights.push(
      this.addDirectionalLight({
        intensity: 1.25,
        position: {
          x: -1,
          y: 1,
          z: 5,
        },
        scale: {
          x: 0.1,
          y: 0.1,
          z: 0.1,
        },
        rotation: {
          x: 0,
          y: Math.PI,
          z: 0,
        },
        helper: false,
      })
    );

    this.lights.push(
      this.addDirectionalLight({
        intensity: 3.15,
        position: {
          x: 1,
          y: 0.5,
          z: -5,
        },
        scale: {
          x: 0.1,
          y: 0.1,
          z: 0.1,
        },
        rotation: {
          x: 0,
          y: Math.PI,
          z: 0,
        },
        helper: false,
      })
    );
  }

  addDirectionalLight(options) {
    const directionalLight = new THREE.DirectionalLight(
      0xffffff,
      options.intensity
    );
    this.scene.add(directionalLight);
    directionalLight.castShadow = true;
    directionalLight.shadow.bias = 1;

    directionalLight.position.set(
      options.position.x,
      options.position.y,
      options.position.z
    );
    directionalLight.scale.set(
      options.scale.x,
      options.scale.y,
      options.scale.z
    );
    directionalLight.rotation.set(
      options.rotation.x,
      options.rotation.y,
      options.rotation.z
    );

    if (options.helper) {
      const directionalLightHelper = new THREE.DirectionalLightHelper(
        directionalLight,
        1
      );
      this.scene.add(directionalLightHelper);

      // const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
      // this.scene.add(directionalLightCameraHelper);
    }

    return directionalLight;
  }

  deg2Rad(degrees) {
    return (degrees * Math.PI) / 180;
  }

  updateAllMaterials() {
    this.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        child.material.envMapIntensity =
          this.debugObject.renderer_env_map_intensity;
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  animateCamera(animation) {
    const that = this;
    let cam_pos, cam_lookat;
    this.currentAnimation = animation;
    //animation = 7;
    if (animation == 1) {
      //Object { x: 0.49298934266671074, y: 0.2047278125515013, z: -0.7569708628325679, _gsap: {…} }
      //Object { x: 0.7400000000000017, y: 0.1600000000000013, z: -1.9, _gsap: {…} }
      cam_pos = { x: 0.74, y: 0.16, z: -1.9 };
      cam_lookat = new THREE.Vector3(-0.15, 0.25, 0);

      if (this.width >= 1200) {
        cam_pos = { x: 0.74, y: 0.16, z: -1.4 };
        cam_lookat = new THREE.Vector3(0.2, 0.25, 0);
      }
    }

    if (animation == 2) {
      //Object { x: -0.07253396751482682, y: 0.30150183724429547, z: -0.7663372608134684, _gsap: {…} }
      cam_pos = { x: -0.073, y: 0.3, z: -1.9 };
      cam_lookat = new THREE.Vector3(-0.16, 0.35, 0);

      if (this.width >= 1200) {
        cam_pos = { x: -0.073, y: 0.3, z: -0.77 };
        cam_lookat = new THREE.Vector3(0.2, 0.35, 0);
      }
    }

    if (animation == 3) {
      //Object { x: 0.2604662168561813, y: 0.09060287995540123, z: -0.5372595595385945, _gsap: {…} }
      cam_pos = { x: -0.073, y: 0.3, z: -1.5 };
      cam_lookat = new THREE.Vector3(0, 0.35, 0);

      if (this.width >= 1200) {
        cam_pos = { x: 0.26, y: 0.09, z: -0.54 };
        cam_lookat = new THREE.Vector3(0.2, 0.1, 0);
      }
    }

    if (animation == 4) {
      //Object { x: 1.6653345369377348e-16, y: 0.10000000000000012, z: 1.6000000000000003, _gsap: {…} }
      //Object { x: -0.986, y: 0.117, z: -0.545 }
      cam_pos = { x: 1.67, y: 0.1, z: 1.6 };
      cam_lookat = new THREE.Vector3(0.006, 0.337, 0);

      if (this.width >= 1200) {
        cam_pos = { x: -0.5, y: 0.1, z: 1.17 };
        cam_lookat = new THREE.Vector3(0.2, 0.2, 0);
      }
    }

    if (animation == 5) {
      //Object { x: -1.0671443561627574, y: 0.5912801829198822, z: -0.33188100141322624
      cam_pos = { x: -1.07, y: 0.59, z: -0.33 };
      cam_lookat = new THREE.Vector3(0, 0.25, 0);

      if (this.width >= 1200) {
        cam_pos = { x: -1.07, y: 0.59, z: -0.33 };
        cam_lookat = new THREE.Vector3(0, 0.2, 0);
      }
    }

    if (animation == 6) {
      //Object { x: 0.20000000000000057, y: -1.100000000000004, z: -0.5999999999999954
      cam_pos = { x: 0.2, y: -1.1, z: -0.6 };
      cam_lookat = new THREE.Vector3(-0.435, 3.5, 1.55);

      if (this.width >= 1200) {
        cam_pos = { x: 0.2, y: -1.1, z: -0.6 };
        cam_lookat = new THREE.Vector3(-0.435, 2.102, 1.55);
      }
    }

    if (animation == 7) {
      //Object { x: 0.1270095028187394, y: -0.046002496631140866, z: -1.68080873789202,
      cam_pos = { x: 0.1, y: 0, z: -1.7 };
      cam_lookat = new THREE.Vector3(0.04, 0.227, 1.55);

      if (this.width >= 1200) {
        cam_pos = { x: 0.1, y: 0, z: -1.7 };
        cam_lookat = new THREE.Vector3(0.227, 0.227, 1.55);
      }
    }

    return gsap.to(that.camera.position, {
      duration: 1,
      x: cam_pos.x,
      y: cam_pos.y,
      z: cam_pos.z,
      onStart: function () {
        that.controls.enabled = false;
      },
      onUpdate: function () {
        that.camera.lookAt(cam_lookat);
        that.controls.target.set(cam_lookat.x, cam_lookat.y, cam_lookat.z);
      },
      onComplete: function () {
        that.controls.enabled = true;
      },
    });
  }

  tick() {
    const elapsedTime = this.clock.getElapsedTime();

    if (this.lastTime < Math.round(elapsedTime)) {
      this.lastTime = Math.round(elapsedTime);
      if (this.lastTime % 2 == 0) {
        // if(Math.round(Math.random()*10)>1)
      }
    }

    this.renderer.render(this.scene, this.camera);
    if (this.controls.enabled) this.controls.update();

    requestAnimationFrame(this.tick.bind(this));
  }
}

const model = new Main({
  dom: document.getElementById('canvas-container'),
});

window.onload = function () {
  if (typeof dat !== 'undefined') {
    setTimeout(() => {
      new Debug({
        model: model,
      });
    }, 1000);
  }

  gsap.registerPlugin(ScrollTrigger);

  const splitting = Splitting();

  splitting.forEach((split) => {
    let stagger = 0.05;
    if (typeof split.el.dataset.stagger !== 'undefined') {
      stagger = split.el.dataset.stagger;
    }
    gsap.from(split.chars, {
      scrollTrigger: {
        scroller: '.content-wrapper',
        trigger: split.el,
      },
      duration: 0.5,
      stagger: stagger,
      //scale:3,
      autoAlpha: 0,
      //rotation:90
    });
  });

  ScrollTrigger.create({
    trigger: '#section-1',
    start: 'top center',
    end: 'center center',
    scroller: '.content-wrapper',
    //markers:true,
    onToggle: (self) => {
      if (self.isActive) {
        model.animateCamera(2);
      } else if (self.progress !== 1) {
        model.animateCamera(1);
      }
    },
  });

  ScrollTrigger.create({
    trigger: '#section-2',
    start: 'top center',
    end: 'center center',
    scroller: '.content-wrapper',
    //markers:true,
    onToggle: (self) => {
      if (self.isActive) {
        model.animateCamera(3);
      } else if (self.progress !== 1) {
        model.animateCamera(2);
      }
    },
  });

  ScrollTrigger.create({
    trigger: '#section-3',
    start: 'top center',
    end: 'center center',
    scroller: '.content-wrapper',
    //markers:true,
    onToggle: (self) => {
      if (self.isActive) {
        model.animateCamera(4);
      } else if (self.progress !== 1) {
        model.animateCamera(3);
      }
    },
  });

  ScrollTrigger.create({
    trigger: '#section-4',
    start: 'top center',
    end: 'center center',
    scroller: '.content-wrapper',
    //markers:true,
    onToggle: (self) => {
      if (self.isActive) {
        model.animateCamera(5);
      } else if (self.progress !== 1) {
        model.animateCamera(4);
      }
    },
  });

  ScrollTrigger.create({
    trigger: '#section-5',
    start: 'top center',
    end: 'center center',
    scroller: '.content-wrapper',
    //markers:true,
    onToggle: (self) => {
      if (self.isActive) {
        model.animateCamera(6);
      } else if (self.progress !== 1) {
        model.animateCamera(5);
      }
    },
  });

  ScrollTrigger.create({
    trigger: '#section-6',
    start: 'top center',
    end: 'center center',
    scroller: '.content-wrapper',
    //markers:true,
    onToggle: (self) => {
      if (self.isActive) {
        model.animateCamera(7);
      } else if (self.progress !== 1) {
        model.animateCamera(6);
      }
    },
  });
};
