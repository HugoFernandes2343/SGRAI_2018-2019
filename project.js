
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 100000);

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
});

//controls
controls = new THREE.OrbitControls(camera, renderer.domElement);
//controls.maxPolarAngle = 0.9 * Math.PI / 2; //impedir que a camera além do chao
//controls.minDistance = 50; //Cannot enter inside object
//controls.maxDistance = 420; // Cannot get out of the house


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
        gltf.scene.translateY(-1);
      //  glft.scene.position.y = -2;
      /*  gltf.animations; // Array<THREE.AnimationClip>
       gltf.scene; // THREE.Scene
       gltf.scenes; // Array<THREE.Scene>
       gltf.cameras; // Array<THREE.Camera>
       gltf.asset; // Object*/

    },

);

//shape

//credits
let geometryCredits1 = new THREE.BoxGeometry(50, 50, 0.5);
let geometryCredits2 = new THREE.BoxGeometry(50, 50, 0.5);
let geometryCredits3 = new THREE.BoxGeometry(50, 50, 0.5);
let geometryCredits4 = new THREE.BoxGeometry(50, 50, 0.5);

//textures & colorss
let creditMaterial1 = new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('imgs/HugoF.jpg'), side: THREE.SingleSide});
let creditMaterial2 = new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('imgs/Marco.jpg'), side: THREE.SingleSide});
let creditMaterial3 = new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('imgs/Berto.jpg'), side: THREE.SingleSide});
let creditMaterial4 = new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('imgs/HugoC.jpg'), side: THREE.SingleSide});

let credits1 = new THREE.Mesh(geometryCredits1, creditMaterial1);
credits1.position.y = 26;
credits1.position.z = -580;
credits1.position.x = -30;


let credits2 = new THREE.Mesh(geometryCredits2, creditMaterial2);
credits2.position.y = 26;
credits2.position.z = -580;
credits2.position.x = 30;


let credits3 = new THREE.Mesh(geometryCredits3, creditMaterial3);
credits3.position.y = 26;
credits3.position.z = -580;
credits3.position.x = -90;


let credits4 = new THREE.Mesh(geometryCredits4, creditMaterial4);
credits4.position.y = 26;
credits4.position.z = -580;
credits4.position.x = 90;



scene.add(credits1);
scene.add(credits2);
scene.add(credits3);
scene.add(credits4);

camera.position.z = 100;
camera.position.y = 150;
camera.position.x = 0;
camera.rotation.x -= 0.3;





//Movel 1

//Floor
let floorGeometry = new THREE.CubeGeometry(77.5, 5, 35);
let floorMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});
let floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = 1.5;
scene.add(floor);

//Ceiling
let ceilingGeometry = new THREE.CubeGeometry(77.5, 2.5, 35);
let ceilingMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});
let ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceiling.position.y = 199.75;
scene.add(ceiling);

//Left Wall
let leftWallGeometry = new THREE.CubeGeometry(2.5,202,35);
let leftWallMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});
let leftWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
leftWall.position.x = 40;
leftWall.position.y = 100;
scene.add(leftWall);

//Right Wall
let rightWallGeometry = new THREE.CubeGeometry(2.5, 202, 35);
let rightWallMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});
let rightWall = new THREE.Mesh(rightWallGeometry, rightWallMaterial);
rightWall.position.x = -40;
rightWall.position.y = 100;
scene.add(rightWall);

//Back Wall
let backWallGeometry = new THREE.CubeGeometry(77.5, 200, 2);
let backWallMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});
let backWall = new THREE.Mesh(backWallGeometry, backWallMaterial);
backWall.position.z = -15;
backWall.position.y = 100;
scene.add(backWall);

//Shelf1
let shelf1Geometry = new THREE.CubeGeometry(77.5, 2, 31.5);
let shelf1Material = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});
let shelf1 = new THREE.Mesh(shelf1Geometry, shelf1Material);
shelf1.position.z = 1.75;
shelf1.position.y = 164;
scene.add(shelf1);

//Shelf2
let shelf2Geometry = new THREE.CubeGeometry(77.5, 2, 31.5);
let shelf2Material = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});
let shelf2 = new THREE.Mesh(shelf2Geometry, shelf2Material);
shelf2.position.z = 1.75;
shelf2.position.y = 137;
scene.add(shelf2);

//shelf 3
let shelf3Geometry = new THREE.CubeGeometry(77.5, 2, 31.5);
let shelf3Material = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});
let shelf3 = new THREE.Mesh(shelf3Geometry, shelf3Material);
shelf3.position.z = 1.75;
shelf3.position.y = 110;
scene.add(shelf3);

//shelf 4
let shelf4Geometry = new THREE.CubeGeometry(77.5, 2, 31.5);
let shelf4Material = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});
let shelf4 = new THREE.Mesh(shelf4Geometry, shelf4Material);
shelf4.position.z = 1.75;
shelf4.position.y = 75;
scene.add(shelf4);

//GLASS
let shelfGlassGeometry = new THREE.CubeGeometry(77.5, 1, 31.5);
//refractCubeCamera = new THREE.CubeCamera(0.1,10000,128);
//scene.add(refractCubeCamera);

/*
var urls  = [

    "./Skybox/BloodValley/front.png","./Skybox/BloodValley/back.png",
    "./Skybox/BloodValley/up.png","./Skybox/BloodValley/down.png",
    "./Skybox/BloodValley/right.png","./Skybox/BloodValley/left.png"
];*/


//let textureCube = new THREE.CubeTextureLoader().load(urls);
//textureCube.mapping = THREE.CubeRefractionMapping;
//refractCubeCamera.renderTarget.mapping=

var refractGlassMaterial = new THREE.MeshBasicMaterial( {
    color: 0xA8CCD7,
    refractionRatio: 0.5,
    reflectivity: 0.99
} );

refractGlassMaterial.transparent = true;
refractGlassMaterial.opacity =0.4;
let shelfGlass = new THREE.Mesh(shelfGlassGeometry, refractGlassMaterial);
shelfGlass.position.z = 1.75;
shelfGlass.position.y = 45;
//refractCubeCamera.position = shelfGlass.position;
scene.add(shelfGlass);

/*
var sphereGeom =  new THREE.SphereGeometry( 80, 64, 32 );
refractSphereCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
scene.add( refractSphereCamera );

refractSphereCamera.renderTarget.mapping = new THREE.CubeRefractionMapping();

var refractMaterial = new THREE.MeshBasicMaterial( {
    color: 0xccccff,
    envMap: refractSphereCamera.renderTarget,
    refractionRatio: 0.985,
    reflectivity: 0.9
} );

refractSphere = new THREE.Mesh( sphereGeom, refractMaterial );
refractSphere.position.set(0,50,0);
refractSphereCamera.position = refractSphere.position;
scene.add(refractSphere);*/
//DOORS

//top part
//wood
let woodStripR1Geometry  = new THREE.CubeGeometry(8,127, 2);
let woodStripR1Material =new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});

let woodStripR1 = new THREE.Mesh(woodStripR1Geometry, woodStripR1Material);
woodStripR1.position.z=18.5;
woodStripR1.position.y=137.5;
woodStripR1.position.x=-20;
woodStripR1.rotation.y = Math.PI/2;
woodStripR1.position.z+=3;
woodStripR1.position.x-=20;

scene.add(woodStripR1);


let woodStripR2Geometry  = new THREE.CubeGeometry(5,127, 2);
let woodStripR2Material =new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});

let woodStripR2 = new THREE.Mesh(woodStripR2Geometry, woodStripR2Material);
woodStripR2.position.z=18.5;
woodStripR2.position.y=137.5;
woodStripR2.position.x=-20;
woodStripR2.rotation.y = Math.PI/2;
woodStripR2.position.z+=36;
woodStripR2.position.x-=20;

scene.add(woodStripR2);


let woodStripR3Geometry  = new THREE.CubeGeometry(26.5,2, 2);
let woodStripR3Material =new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});

let woodStripR3 = new THREE.Mesh(woodStripR3Geometry, woodStripR3Material);
woodStripR3.position.z=18.5;
woodStripR3.position.y=200;
woodStripR3.position.x=-20;
woodStripR3.rotation.y = Math.PI/2;
woodStripR3.position.z+=20.25;
woodStripR3.position.x-=20;

scene.add(woodStripR3);


//LEFT

let woodStripL1Geometry  = new THREE.CubeGeometry(8,127, 2);
let woodStripL1Material =new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});

let woodStripL1 = new THREE.Mesh(woodStripL1Geometry, woodStripL1Material);
woodStripL1.position.z=18.5;
woodStripL1.position.y=137.5;
woodStripL1.position.x=35.75;
//woodStripL1.rotation.y = Math.PI/2;
//woodStripL1.position.z+=3;
//woodStripL1.position.x-=20;

scene.add(woodStripL1);


let woodStripL2Geometry  = new THREE.CubeGeometry(5,127, 2);
let woodStripL2Material =new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});

let woodStripL2 = new THREE.Mesh(woodStripL2Geometry, woodStripL2Material);
woodStripL2.position.z=18.5;
woodStripL2.position.y=137.5;
woodStripL2.position.x=2.75;
//woodStripL2.rotation.y = Math.PI/2;
//woodStripL2.position.z+=36;
//woodStripL2.position.x-=20;

scene.add(woodStripL2);


let woodStripL3Geometry  = new THREE.CubeGeometry(26.5,2, 2);
let woodStripL3Material =new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});

let woodStripL3 = new THREE.Mesh(woodStripL3Geometry, woodStripL3Material);
woodStripL3.position.z=18.5;
woodStripL3.position.y=200;
woodStripL3.position.x=18.5;
//woodStripL3.rotation.y = Math.PI/2;
//woodStripL3.position.z+=20.25;
//woodStripL3.position.x-=20;

scene.add(woodStripL3);


//Glass strip Right

let glassStripRGeometry  = new THREE.CubeGeometry(26.5,125, 1);
let glassStripRMaterial = new THREE.MeshBasicMaterial( {
    color: 0xA8CCD7,
    refractionRatio: 0.5,
    reflectivity: 0.99
} );

glassStripRMaterial.transparent = true;
glassStripRMaterial.opacity =0.4;
let glassStripR = new THREE.Mesh(glassStripRGeometry, glassStripRMaterial);
glassStripR.position.z=18.5;
glassStripR.position.y=136.5;
glassStripR.position.x=-20;
glassStripR.rotation.y = Math.PI/2;
glassStripR.position.z+=20.25;
glassStripR.position.x-=20;

scene.add(glassStripR);


//Glass strip Left

let glassStripLGeometry  = new THREE.CubeGeometry(26.5,125, 1);
let glassStripLMaterial = new THREE.MeshBasicMaterial( {
    color: 0xA8CCD7,
    refractionRatio: 0.5,
    reflectivity: 0.99
} );

glassStripLMaterial.transparent = true;
glassStripLMaterial.opacity =0.4;
let glassStripL = new THREE.Mesh(glassStripLGeometry, glassStripLMaterial);
glassStripL.position.z=18.5;
glassStripL.position.y=136.5;
glassStripL.position.x=18.5;
//glassStripL.rotation.y = Math.PI/2;
//glassStripL.position.z+=20.25;
//glassStripL.position.x-=20;

scene.add(glassStripL);


//lower part
let door1DGeometry = new THREE.CubeGeometry(39.5,71, 2);
let door1DMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});
let door1D = new THREE.Mesh(door1DGeometry, door1DMaterial);
door1D.position.z = 18.5;
door1D.position.y = 38.5;
door1D.position.x = -20;
door1D.rotation.y = Math.PI/2;
door1D.position.z +=18.75;
door1D.position.x-=20;
scene.add(door1D);

let door2DGeometry = new THREE.CubeGeometry(39.5, 71, 2);
let door2DMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});
let door2D = new THREE.Mesh(door2DGeometry, door2DMaterial);
door2D.position.z = 18.5;
door2D.position.y = 38.5;
door2D.position.x = 20;
scene.add(door2D);

//door knobs





/*//Middle Wall
let midWallGeometry = new THREE.CubeGeometry(5, 198, 98);
let midWallMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});
let midWallCube = new THREE.Mesh(midWallGeometry, midWallMaterial);
midWallCube.position.z = 1;
midWallCube.position.y = 100;
scene.add(midWallCube);
*/
/*
var geometry = new THREE.CylinderGeometry( 100, 20, 100, 32,1,false,0,Math.PI );
var material = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide
});
var cylinder = new THREE.Mesh( geometry, material );
cylinder.rotation.y = Math.PI / 2;
cylinder.rotation.x = Math.PI / 2;
cylinder.position.y = 300;
scene.add( cylinder );
*/


//Lights
let ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
scene.add(ambientLight);

let light1 = new THREE.PointLight(0xFF0040, 4, 50);
//scene.add(light1);

//let directionalLight = new THREE.DirectionalLight(0x6BFA6B, 4, 50);
//scene.add(directionalLight);

//RED SPOTLIGHT
let spotlight1 = new THREE.SpotLight(0xFFFFFF, 0.5);
spotlight1.position.set(0, 250, 150);
spotlight1.lookAt(0, 0, 0);
scene.add(spotlight1);

//WHITE SPOTLIGHT
let spotlight2 = new THREE.SpotLight(0xFFFFFF, 0.5);
spotlight2.position.set(0, 250, -150);
// spotlight2.position.y = 150;
// spotlight2.position.z =-150;
spotlight2.lookAt(0, 0, 0);
scene.add(spotlight2);

//ORANGE SPOTLIGHT
let spotlight3 = new THREE.SpotLight(0xFFFFFF, 0.5);
spotlight3.position.set(150, 250, 0);
// spotlight3.position.y = 150;
// spotlight3.position.x = 150;
spotlight3.lookAt(0, 0, 0);
scene.add(spotlight3);

//GREEN SPOTLIGHT
let spotlight4 = new THREE.SpotLight(0xFFFFFF, 0.5);
spotlight4.position.set(-150, 250, 0);
// spotlight4.position.y = 150;
// spotlight4.position.x =-150;
spotlight4.lookAt(0, 0, 0);
scene.add(spotlight4);

//RED SPOTLIGHT
//let geometryC1 = new THREE.BoxGeometry(5,5,7.5);
let geometryC1 = new THREE.SphereGeometry(3, 32, 32);
let materialC1 = new THREE.MeshLambertMaterial({color: 0xFF0000});
let bulb1 = new THREE.Mesh(geometryC1, materialC1);
bulb1.position.set(spotlight1.position.x, spotlight1.position.y, spotlight1.position.z);
//bulb1.rotation.x-=0.5;
scene.add(bulb1);

//WHITE SPOTLIGHT
//let geometryC2 = new THREE.BoxGeometry(5,5,7.5);
let geometryC2 = new THREE.SphereGeometry(3, 32, 32);
let materialC2 = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
let bulb2 = new THREE.Mesh(geometryC2, materialC2);
bulb2.position.set(spotlight2.position.x, spotlight2.position.y, spotlight2.position.z);
//bulb2.rotation.x+=0.5;
scene.add(bulb2);

//ORANGE SPOTLIGHT
//let geometryC3 = new THREE.BoxGeometry(5,5,7.5);
let geometryC3 = new THREE.SphereGeometry(3, 32, 32);
let materialC3 = new THREE.MeshLambertMaterial({color: 0xFFAA32});
let bulb3 = new THREE.Mesh(geometryC3, materialC3);
bulb3.position.set(spotlight3.position.x, spotlight3.position.y, spotlight3.position.z);
//bulb3.rotation.z+=0.5;
scene.add(bulb3);

//GREEN SPOTLIGHT
//let geometryC4 = new THREE.BoxGeometry(5,5,7.5);
let geometryC4 = new THREE.SphereGeometry(3, 32, 32);
let materialC4 = new THREE.MeshLambertMaterial({color: 0x00FF00});
let bulb4 = new THREE.Mesh(geometryC4, materialC4);
bulb4.position.set(spotlight4.position.x, spotlight4.position.y, spotlight4.position.z);
//bulb4.rotation.z-=0.5;
scene.add(bulb4);

function posFigure(figure, posX, posY, rotX, rotY) {
    figure.position.x = posX;
    figure.position.y = posY;
    figure.rotation.x += rotX;
    figure.rotation.y += rotY;
}

function rotateLights() {
    let time = Date.now() * 0.0005;

    spotlight1.position.x = -1*Math.cos(time)* 100;
    spotlight1.position.z = Math.sin(time)* 100;
    bulb1.position.set(spotlight1.position.x, spotlight1.position.y, spotlight1.position.z);

    spotlight2.position.x = Math.cos(time)* 100;
    spotlight2.position.z = -1*Math.sin(time)* 100;
    bulb2.position.set(spotlight2.position.x, spotlight2.position.y, spotlight2.position.z);

    spotlight3.position.x = -1*Math.sin(time)* 100;
    spotlight3.position.z = -1*Math.cos(time)* 100;
    bulb3.position.set(spotlight3.position.x, spotlight3.position.y, spotlight3.position.z);

    spotlight4.position.x = Math.sin(time)* 100;
    spotlight4.position.z = Math.cos(time)* 100;
    bulb4.position.set(spotlight4.position.x, spotlight4.position.y, spotlight4.position.z);
}

//draw scene
let render = function () {
    renderer.render(scene, camera);
}

//updates the scene before render
let update = function () {
    // posFigure(cube, 1, 0, 0.01, 0.01);
    // posFigure(cube2, 0, 0, -0.05, -0.05);

    rotateLights();



}

//runs the program
let loop = function () {
    requestAnimationFrame(loop);

    update();
    render();
}

loop();

