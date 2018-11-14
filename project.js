
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100000);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//update viewport on resize
window.addEventListener('resize', function () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
})

//controls
controls = new THREE.OrbitControls(camera, renderer.domElement);


//////////////////////////////////////////////////////////////////////////////////
/////////////////////////// SKYBOX ///////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
let geometrySky = new THREE.CubeGeometry(100000,100000,100000);
let skyMaterials = [
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./Skybox/BloodValley/front.png"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./Skybox/BloodValley/back.png"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./Skybox/BloodValley/up.png"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./Skybox/BloodValley/down.png"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./Skybox/BloodValley/right.png"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./Skybox/BloodValley/left.png"), side: THREE.DoubleSide}),
];
//let material2 = new THREE.MeshFaceMaterial(cube2materials);
let skyCube = new THREE.Mesh(geometrySky, skyMaterials);
scene.add(skyCube);

//////////////////////////////////////////////////////////////////////////////////
////////////////////// MODEL OF THE ROOM AND COMPONENTS //////////////////////////
//////////////////////////////////////////////////////////////////////////////////
// Instantiate a loader
let loader = new THREE.GLTFLoader();

// Load a glTF resource
loader.load(
    // resource URL
    './3dModel/Room/scene.gltf',
    // called when the resource is loaded
    function ( gltf ) {

        scene.add( gltf.scene );

      /*  gltf.animations; // Array<THREE.AnimationClip>
       gltf.scene; // THREE.Scene
       gltf.scenes; // Array<THREE.Scene>
       gltf.cameras; // Array<THREE.Camera>
       gltf.asset; // Object*/

    },

);

//shape
let geometry = new THREE.BoxGeometry(1, 1, 1);

//textures & colors
let cube1materials = [

    new THREE.MeshPhongMaterial({color: 0x458000, side: THREE.DoubleSide}),// right side
    new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
        side: THREE.DoubleSide
    }),// left side
    new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide}),// top side
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('imgs/TestTextureMetal.jpg'),
        side: THREE.DoubleSide
    }),// bottom side
    new THREE.MeshPhongMaterial({color: 0x0080FF, side: THREE.DoubleSide}),// front side
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('imgs/TestTextureWater.jpg'),
        side: THREE.DoubleSide
    })// back side
];

//Cube1 white
// let material = new THREE.MeshFaceMaterial(cube1materials);
let cube = new THREE.Mesh(geometry, cube1materials);
scene.add(cube);

//Cube2 red
let geometry2 = new THREE.BoxGeometry(0.05, 0.05, 0.05);

//textures & colorss
let cube2materials = [
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('imgs/Maia.jpg'), side: THREE.FrontSide}),// right side
    new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('imgs/HugoF.jpg'), side: THREE.DoubleSide}),// left side
    new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('imgs/Filipe.jpg'), side: THREE.DoubleSide}),// top side
    new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('imgs/HugoC.jpg'), side: THREE.DoubleSide}),// bottom side
    new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('imgs/Marco.jpg'), side: THREE.DoubleSide}),// front side
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('imgs/Berto.jpg'), side: THREE.DoubleSide})// back side
];

//Cube2 red

//let material2 = new THREE.MeshFaceMaterial(cube2materials);
let cube2 = new THREE.Mesh(geometry2, cube2materials);
scene.add(cube2);

camera.position.z = 250;
camera.position.y = 250;
camera.position.x = 0;
camera.rotation.x -= 0.3;


//Wallway

//Floor
let floorGeometry = new THREE.CubeGeometry(100, 10, 100);
let floorMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});
let floorCube = new THREE.Mesh(floorGeometry, floorMaterial);
floorCube.position.y = 5;
scene.add(floorCube);

//Ceiling
let ceilingGeometry = new THREE.CubeGeometry(100, 10, 100);
let ceilingMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});
let ceilingCube = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceilingCube.position.y = 95;
scene.add(ceilingCube);

//Left Wall
let leftWallGeometry = new THREE.CubeGeometry(10, 100, 100);
let leftWallMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});
let leftWallCube = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
leftWallCube.position.x = 45;
leftWallCube.position.y = 50;
scene.add(leftWallCube);

//Right Wall
let rightWallGeometry = new THREE.CubeGeometry(10, 100, 100);
let rightWallMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});
let rightWallCube = new THREE.Mesh(rightWallGeometry, rightWallMaterial);
rightWallCube.position.x = -45;
rightWallCube.position.y = 50;
scene.add(rightWallCube);

//Back Wall
let backWallGeometry = new THREE.CubeGeometry(100, 100, 10);
let backWallMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});
let backWallCube = new THREE.Mesh(backWallGeometry, backWallMaterial);
backWallCube.position.z = -45;
backWallCube.position.y = 50;
scene.add(backWallCube);


//Lights
let ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(ambientLight);

let light1 = new THREE.PointLight(0xFF0040, 4, 50);
//scene.add(light1);

//let directionalLight = new THREE.DirectionalLight(0x6BFA6B, 4, 50);
//scene.add(directionalLight);

//RED SPOTLIGHT
let spotlight1 = new THREE.SpotLight(0xFFFFFF, 6.5, 150);
spotlight1.position.y = 150;
spotlight1.position.z = 160;
scene.add(spotlight1);

//WHITE SPOTLIGHT
let spotlight2 = new THREE.SpotLight(0xFFFFFF, 6.5, 150);
spotlight2.position.y = 150;
spotlight2.position.z =-160;
scene.add(spotlight2);

//ORANGE SPOTLIGHT
let spotlight3 = new THREE.SpotLight(0xFFFFFF, 6.5, 150);
spotlight3.position.y = 150;
spotlight3.position.x = 160;
scene.add(spotlight3);

//GREEN SPOTLIGHT
let spotlight4 = new THREE.SpotLight(0xFFFFFF, 6.5, 150);
spotlight4.position.y = 150;
spotlight4.position.x =-160;
scene.add(spotlight4);

//Spheres for the lights
/*let geometryS1 = new THREE.SphereGeometry(0.75, 32, 32);
let materialS1 = new THREE.MeshBasicMaterial({color: 0xffCC00});
let sphereS1 = new THREE.Mesh(geometryS1, materialS1);
scene.add(sphereS1);*/


//RED SPOTLIGHT
let geometryC1 = new THREE.BoxGeometry(0.5,0.5,0.75);
let materialC1 = new THREE.MeshLambertMaterial({color:0xFF0000});
let cubeC1 = new THREE.Mesh(geometryC1,materialC1);
cubeC1.position.x = spotlight1.position.x;
cubeC1.position.y = spotlight1.position.y;
cubeC1.position.z = spotlight1.position.z;
cubeC1.rotation.x-=0.5;
scene.add(cubeC1);

//WHITE SPOTLIGHT
let geometryC2 = new THREE.BoxGeometry(0.5,0.5,0.75);
let materialC2 = new THREE.MeshLambertMaterial({color:0xFFFFFF});
let cubeC2 = new THREE.Mesh(geometryC2,materialC2);
cubeC2.position.x = spotlight2.position.x;
cubeC2.position.y = spotlight2.position.y;
cubeC2.position.z = spotlight2.position.z;
cubeC2.rotation.x+=0.5;
scene.add(cubeC2);

//ORANGE SPOTLIGHT
let geometryC3 = new THREE.BoxGeometry(0.75,0.5,0.5);
let materialC3 = new THREE.MeshLambertMaterial({color:0xFFAA32});
let cubeC3 = new THREE.Mesh(geometryC3,materialC3);
cubeC3.position.x = spotlight3.position.x;
cubeC3.position.y = spotlight3.position.y;
cubeC3.position.z = spotlight3.position.z;
cubeC3.rotation.z+=0.5;
scene.add(cubeC3);

//GREEN SPOTLIGHT
let geometryC4 = new THREE.BoxGeometry(0.75,0.5,0.5);
let materialC4 = new THREE.MeshLambertMaterial({color:0x00FF00});
let cubeC4 = new THREE.Mesh(geometryC4,materialC4);
cubeC4.position.x = spotlight4.position.x;
cubeC4.position.y = spotlight4.position.y;
cubeC4.position.z = spotlight4.position.z;
cubeC4.rotation.z-=0.5;
scene.add(cubeC4);

/*
let geometryC6 = new THREE.SphereGeometry(0.75, 32, 32);
let materialC6 = new THREE.MeshBasicMaterial({color: 0xffCC00});
let sphereC6 = new THREE.Mesh(geometryC6, materialC6);
sphereC6.position.y= spotlight4.position.y;
sphereC6.position.x = spotlight4.position.x;
scene.add(sphereC6);*/


function posFigure(figure, posX, posY, rotX, rotY) {
    figure.position.x = posX;
    figure.position.y = posY;
    figure.rotation.x += rotX;
    figure.rotation.y += rotY;
}

//draw scene
let render = function () {
    renderer.render(scene, camera);
}

//updates the scene before render
let update = function () {
    // posFigure(cube, 1, 0, 0.01, 0.01);
    // posFigure(cube2, 0, 0, -0.05, -0.05);

    // let time = Date.now() * 0.0005;

    /*  light1.position.x = Math.sin(time = 0.7) * 15;
      light1.position.y = Math.sin(time = 0.4) * 26;
      light1.position.z = Math.cos(time = 0.3) * 30;

      directionalLight.position.x = Math.cos(time = 0.5)*20;
      directionalLight.position.y = Math.cos(time = 0.5)*20;
      directionalLight.position.z = Math.cos(time = 0.5)*20;

      spotlight1.position.x = Math.cos(time = 0.5)*20;
      spotlight1.position.y = Math.cos(time = 0.5)*20;
      spotlight1.position.z = Math.cos(time = 0.5)*20;

      spotlight1.position.x = Math.cos(time = 0.5)*20;
      spotlight1.position.y = Math.cos(time = 0.5)*20;
      spotlight1.position.z = Math.cos(time = 0.5)*20;

      spotlight1.position.x = Math.cos(time = 0.5)*20;
      spotlight1.position.y = Math.cos(time = 0.5)*20;
      spotlight1.position.z = Math.cos(time = 0.5)*20;*/

}

//runs the program
let loop = function () {
    requestAnimationFrame(loop);

    update();
    render();
}

loop();

