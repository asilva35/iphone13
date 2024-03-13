import * as THREE from 'three';

export class Debug {
  constructor(options) {
    if (typeof dat === 'undefined') return;

    const that = this;

    this.model = options.model;

    this.gui = new dat.GUI();

    // /**Debug Background */
    this.guiBgFolder = this.gui.addFolder('BG');
    this.guiBgFolder
      .addColor(that.model.debugObject, 'clearColor')
      .onChange((value) => {
        that.model.scene.background = new THREE.Color(value);
        //that.model.scene.fog = new THREE.Fog(new THREE.Color(that.model.debugObject.clearColor), that.model.debugObject.fogNear , that.model.debugObject.fogFar);
      });

    // this.guiBgFolder.add(that.model.debugObject,'fogNear',1,5).onChange((value)=>{
    //     that.model.scene.fog = new THREE.Fog(new THREE.Color(that.model.debugObject.clearColor), that.model.debugObject.fogNear , that.model.debugObject.fogFar);
    // })

    // this.guiBgFolder.add(that.model.debugObject,'fogFar',5,100).onChange((value)=>{
    //     that.model.scene.fog = new THREE.Fog(new THREE.Color(that.model.debugObject.clearColor), that.model.debugObject.fogNear , that.model.debugObject.fogFar);
    // })

    /**Debug Camera */
    this.guiFolderCamera = this.gui.addFolder('Camera');
    this.guiFolderCamera
      .add(that.model.camera.position, 'x', -10, 10, 0.1)
      .name('Position X');
    this.guiFolderCamera
      .add(that.model.camera.position, 'y', -10, 10, 0.1)
      .name('Position Y');
    this.guiFolderCamera
      .add(that.model.camera.position, 'z', -10, 30, 0.1)
      .name('Position z');

    this.guiFolderCamera
      .add(that.model.debugObject.camera_lookat, 'x', -5, 5, 0.001)
      .name('LookAt X')
      .onChange(() => {
        that.model.controls.enabled = false;
        that.model.camera.lookAt(
          new THREE.Vector3(
            this.model.debugObject.camera_lookat.x,
            this.model.debugObject.camera_lookat.y,
            this.model.debugObject.camera_lookat.z
          )
        );
        that.model.controls.target.set(
          this.model.debugObject.camera_lookat.x,
          this.model.debugObject.camera_lookat.y,
          this.model.debugObject.camera_lookat.z
        );
        that.model.controls.enabled = true;
      });
    this.guiFolderCamera
      .add(that.model.debugObject.camera_lookat, 'y', -5, 5, 0.001)
      .name('LookAt Y')
      .onChange(() => {
        that.model.controls.enabled = false;
        that.model.camera.lookAt(this.model.debugObject.camera_lookat);
        that.model.controls.target.set(
          this.model.debugObject.camera_lookat.x,
          this.model.debugObject.camera_lookat.y,
          this.model.debugObject.camera_lookat.z
        );
        that.model.controls.enabled = true;
      });
    this.guiFolderCamera
      .add(that.model.debugObject.camera_lookat, 'z', -5, 5, 0.001)
      .name('LookAt Z')
      .onChange(() => {
        that.model.controls.enabled = false;
        that.model.camera.lookAt(this.model.debugObject.camera_lookat);
        that.model.controls.target.set(
          this.model.debugObject.camera_lookat.x,
          this.model.debugObject.camera_lookat.y,
          this.model.debugObject.camera_lookat.z
        );
        that.model.controls.enabled = true;
      });
    this.guiFolderCamera.add(
      {
        getPositionCamera: function () {
          console.log('Camera Position: ');
          console.log(that.model.camera.position);
          var tempVector = new THREE.Vector3(0, 0, 0);
          that.model.camera.getWorldPosition(tempVector);
          console.log('Camera Look At: ');
          console.log(that.model.controls.target);
        },
      },
      'getPositionCamera'
    );

    this.guiFolderCamera.close();

    /**Debug Lights */
    this.guiFolderLights = this.gui.addFolder('Lights');

    this.guiFolderLight_01 = this.guiFolderLights.addFolder('Light 01');
    this.guiFolderLight_01
      .add(that.model.lights[0], 'intensity', 0, 5, 0.05)
      .name('Intensity');
    this.guiFolderLight_01
      .add(that.model.lights[0].position, 'x', -10, 10, 0.1)
      .name('Position X');
    this.guiFolderLight_01
      .add(that.model.lights[0].position, 'y', -10, 10, 0.1)
      .name('Position Y');
    this.guiFolderLight_01
      .add(that.model.lights[0].position, 'z', -10, 10, 0.1)
      .name('Position Z');
    this.guiFolderLight_01
      .add(that.model.lights[0].scale, 'x', 0, 5, 0.1)
      .name('Scale X');
    this.guiFolderLight_01
      .add(that.model.lights[0].scale, 'y', 0, 5, 0.1)
      .name('Scale Y');
    this.guiFolderLight_01
      .add(that.model.lights[0].scale, 'z', 0, 5, 0.1)
      .name('Scale Z');
    this.guiFolderLight_01
      .add(that.model.lights[0].rotation, 'x', -Math.PI, Math.PI, 0.1)
      .name('Rotate X');
    this.guiFolderLight_01
      .add(that.model.lights[0].rotation, 'y', -Math.PI, Math.PI, 0.1)
      .name('Rotate Y');
    this.guiFolderLight_01
      .add(that.model.lights[0].rotation, 'z', -Math.PI, Math.PI, 0.1)
      .name('Rotate Z');
    this.guiFolderLight_01.close();

    this.guiFolderLight_02 = this.guiFolderLights.addFolder('Light 02');
    this.guiFolderLight_02
      .add(that.model.lights[1], 'intensity', 0, 5, 0.05)
      .name('Intensity');
    this.guiFolderLight_02
      .add(that.model.lights[1].position, 'x', -10, 10, 0.1)
      .name('Position X');
    this.guiFolderLight_02
      .add(that.model.lights[1].position, 'y', -10, 10, 0.1)
      .name('Position Y');
    this.guiFolderLight_02
      .add(that.model.lights[1].position, 'z', -10, 10, 0.1)
      .name('Position Z');
    this.guiFolderLight_02
      .add(that.model.lights[1].scale, 'x', 0, 5, 0.1)
      .name('Scale X');
    this.guiFolderLight_02
      .add(that.model.lights[1].scale, 'y', 0, 5, 0.1)
      .name('Scale Y');
    this.guiFolderLight_02
      .add(that.model.lights[1].scale, 'z', 0, 5, 0.1)
      .name('Scale Z');
    this.guiFolderLight_02
      .add(that.model.lights[1].rotation, 'x', -Math.PI, Math.PI, 0.1)
      .name('Rotate X');
    this.guiFolderLight_02
      .add(that.model.lights[1].rotation, 'y', -Math.PI, Math.PI, 0.1)
      .name('Rotate Y');
    this.guiFolderLight_02
      .add(that.model.lights[1].rotation, 'z', -Math.PI, Math.PI, 0.1)
      .name('Rotate Z');
    this.guiFolderLight_02.close();

    this.guiFolderLight_03 = this.guiFolderLights.addFolder('Light 03');
    this.guiFolderLight_03
      .add(that.model.lights[2], 'intensity', 0, 5, 0.05)
      .name('Intensity');
    this.guiFolderLight_03
      .add(that.model.lights[2].position, 'x', -10, 10, 0.1)
      .name('Position X');
    this.guiFolderLight_03
      .add(that.model.lights[2].position, 'y', -10, 10, 0.1)
      .name('Position Y');
    this.guiFolderLight_03
      .add(that.model.lights[2].position, 'z', -10, 10, 0.1)
      .name('Position Z');
    this.guiFolderLight_03
      .add(that.model.lights[2].scale, 'x', 0, 5, 0.1)
      .name('Scale X');
    this.guiFolderLight_03
      .add(that.model.lights[2].scale, 'y', 0, 5, 0.1)
      .name('Scale Y');
    this.guiFolderLight_03
      .add(that.model.lights[2].scale, 'z', 0, 5, 0.1)
      .name('Scale Z');
    this.guiFolderLight_03
      .add(that.model.lights[2].rotation, 'x', -Math.PI, Math.PI, 0.1)
      .name('Rotate X');
    this.guiFolderLight_03
      .add(that.model.lights[2].rotation, 'y', -Math.PI, Math.PI, 0.1)
      .name('Rotate Y');
    this.guiFolderLight_03
      .add(that.model.lights[2].rotation, 'z', -Math.PI, Math.PI, 0.1)
      .name('Rotate Z');
    this.guiFolderLight_03.close();

    this.guiFolderLights.close();

    this.guiFolderEnvironment = this.gui.addFolder('Environment');
    this.guiFolderEnvironment
      .add(that.model.debugObject, 'renderer_env_map_intensity', 0, 20, 0.05)
      .name('Map Intensity')
      .onChange((value) => {
        that.model.updateAllMaterials();
      });
    this.guiFolderEnvironment.close();

    this.gui.close();
  }
}
