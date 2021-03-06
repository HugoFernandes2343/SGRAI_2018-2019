if ( WEBGL.isWebGLAvailable() === false ) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 100000);
/*var views = [
    {
        left: 0.5,
        top: 0.5,
        width: 0.25,
        height: 0.5,
       // background: new THREE.Color( 0.7, 0.5, 0.5 ),
        eye: [ 0, 1800, 0 ],
        up: [ 0, 0, 1 ],
        fov: 45,
        updateCamera: function ( camera, scene, mouseX ) {

            camera.position.x -= mouseX * 0.05;
            camera.position.x = Math.max( Math.min( camera.position.x, 2000 ), - 2000 );
            camera.lookAt( camera.position.clone().setY( 0 ) );

        }
    },
    {
        left: 0,
        top: 0,
        width: 1,
        height: 1,
        //background: new THREE.Color( 0.5, 0.7, 0.7 ),
        eye: [ 1400, 800, 1400 ],
        up: [ 0, 1, 0 ],
        fov: 60,
        updateCamera: function ( camera, scene, mouseX ) {

            camera.position.y -= mouseX * 0.05;
            camera.position.y = Math.max( Math.min( camera.position.y, 1600 ), - 1600 );
            camera.lookAt( scene.position );

        }
    }
];**/

let selectableObjects = [];
let predefinedDimensions = [];
let selectableTextures = [];
let currentlyPickedObject = new THREE.Object3D();
let moduleTypes = ["baseModuleType","doorModuleType","storageModuleType","shelfModuleType"];

var gui = new dat.GUI();
let pickingMode = false;
let editing = false;

let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;


/*rAYCASTER VARIABLES*/
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector3(), INTERSECTED = null;

//update viewport on resize
window.addEventListener('resize', function () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

//////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// SKYBOX ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

let geometrySky = new THREE.SphereGeometry(100000, 25, 25);

let skyMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./Skybox/city.jpg"), side: THREE.BackSide });

let skyGlobe = new THREE.Mesh(geometrySky, skyMaterial);
scene.add(skyGlobe);

//controls
controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = 0.9 * Math.PI / 2; //impedir que a camera além do chao
controls.minDistance = 50; //Cannot enter inside object
controls.maxDistance = 420; // Cannot get out of the house

/**
 * Add Shadows (Casting and Recieving) //avoid for for the scene obj
 * @param object object to add shadows
 */
function addShadowCastingAndReciever(object){
    object.traverse(function (node) { if (node instanceof THREE.Mesh) { node.castShadow = true; node.receiveShadow = true; } });
}

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
    function (gltf) {

        gltf.scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) { node.receiveShadow = true; }
        });

        scene.add(gltf.scene);
        gltf.scene.translateY(-1);
    },

);

camera.position.z = 325;
camera.position.y = 250;
camera.position.x = 0;


//Add a base module
function addBaseModule(xbase, zbase, x, y, z, texture) {
   
    let baseModule = new THREE.Object3D();
    baseModule.name = moduleTypes[0];
    if (texture == -1) {
        return
    }
    let choosenMaterial = chooseMaterial(texture);

    //Floor
    let floorGeometry = new THREE.CubeGeometry(x, 5, z);
    let floor = new THREE.Mesh(floorGeometry, choosenMaterial);
    floor.position.y = 1.5;

    //Ceiling
    let ceilingGeometry = new THREE.CubeGeometry(x, 2.5, z);
    let ceiling = new THREE.Mesh(ceilingGeometry, choosenMaterial);
    ceiling.position.y = y-1.25;

    //Left Wall
    let leftWallGeometry = new THREE.CubeGeometry(2.5, y+2, z);
    let leftWall = new THREE.Mesh(leftWallGeometry, choosenMaterial);
    leftWall.position.x = - x/2 -1;
    leftWall.position.y += y/2 -1;

    //Right Wall
    let rightWallGeometry = new THREE.CubeGeometry(2.5, y+2, z);
    let rightWall = new THREE.Mesh(rightWallGeometry, choosenMaterial);
    rightWall.position.x = x / 2 +1;
    rightWall.position.y += y/2 -1;

    //Back Wall
    let backWallGeometry = new THREE.CubeGeometry(x, y, 2);
    let backWall = new THREE.Mesh(backWallGeometry, choosenMaterial);
    backWall.position.z -= z/2 -1;
    backWall.position.y += y/2 -1;

    baseModule.add(backWall,
        rightWall, leftWall, ceiling, floor);

    baseModule.position.x = xbase;
    baseModule.position.y = 0;
    baseModule.position.z = zbase;

    selectableObjects.push(backWall,
        rightWall, leftWall, ceiling, floor);

    baseModule.traverse(function (node) { if (node instanceof THREE.Mesh) { node.castShadow = true; node.receiveShadow = true; } });
    baseModule.name = moduleTypes[0];
    scene.add(baseModule);

}

//Add a base module
function addPresetBaseModule(size,x,z) {

    if(size==0){
        addBaseModule(x,z,20,50,10,0);
    } else if(size==1){
        addBaseModule(x,z,40,100,20,0);
    }else if(size==2){
        addBaseModule(x,z,60,150,30,0);
    }else if(size==3){
        addBaseModule(x,z,80,200,40,0);
    }else if(size==4){
        addBaseModule(x,z,100,250,50,0);
    }

}
//Movel 1
//Floor
let floorGeometry = new THREE.CubeGeometry(77.5, 5, 35);
let floorMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});
let floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = 1.5;
scene.add(floor);

//Ceiling
let ceilingGeometry = new THREE.CubeGeometry(77.5, 2.5, 35);
let ceilingMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});
let ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceiling.position.y = 199.75;
scene.add(ceiling);

//Left Wall
let leftWallGeometry = new THREE.CubeGeometry(2.5, 202, 35);
let leftWallMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});
let leftWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
leftWall.position.x = 40;
leftWall.position.y = 100;
scene.add(leftWall);

//Right Wall
let rightWallGeometry = new THREE.CubeGeometry(2.5, 202, 35);
let rightWallMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});
let rightWall = new THREE.Mesh(rightWallGeometry, rightWallMaterial);
rightWall.position.x = -40;
rightWall.position.y = 100;
scene.add(rightWall);

//Back Wall
let backWallGeometry = new THREE.CubeGeometry(77.5, 200, 2);
let backWallMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});
let backWall = new THREE.Mesh(backWallGeometry, backWallMaterial);
backWall.position.z = -15;
backWall.position.y = 100;
scene.add(backWall);

//Shelf1
let shelf1Geometry = new THREE.CubeGeometry(77.5, 2, 31.5);
let shelf1Material = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});
let shelf1 = new THREE.Mesh(shelf1Geometry, shelf1Material);
shelf1.position.z = 1.75;
shelf1.position.y = 164;
scene.add(shelf1);

//Shelf2
let shelf2Geometry = new THREE.CubeGeometry(77.5, 2, 31.5);
let shelf2Material = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});
let shelf2 = new THREE.Mesh(shelf2Geometry, shelf2Material);
shelf2.position.z = 1.75;
shelf2.position.y = 137;
scene.add(shelf2);

//shelf 3
let shelf3Geometry = new THREE.CubeGeometry(77.5, 2, 31.5);
let shelf3Material = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});
let shelf3 = new THREE.Mesh(shelf3Geometry, shelf3Material);
shelf3.position.z = 1.75;
shelf3.position.y = 110;
scene.add(shelf3);

//shelf 4
let shelf4Geometry = new THREE.CubeGeometry(77.5, 2, 31.5);
let shelf4Material = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});
let shelf4 = new THREE.Mesh(shelf4Geometry, shelf4Material);
shelf4.position.z = 1.75;
shelf4.position.y = 75;
//scene.add(shelf4);

//GLASS
let shelfGlassGeometry = new THREE.CubeGeometry(77.5, 1, 31.5);
//refractCubeCamera = new THREE.CubeCamera(0.1,10000,128);
//scene.add(refractCubeCamera);

//let textureCube = new THREE.CubeTextureLoader().load(urls);
//textureCube.mapping = THREE.CubeRefractionMapping;
//refractCubeCamera.renderTarget.mapping=

var refractGlassMaterial = new THREE.MeshLambertMaterial({
    color: 0xA8CCD7,
    refractionRatio: 0.5,
    reflectivity: 0.99,
    emissive: null
});

refractGlassMaterial.transparent = true;
refractGlassMaterial.opacity = 0.4;
let shelfGlass = new THREE.Mesh(shelfGlassGeometry, refractGlassMaterial);
shelfGlass.position.z = 1.75;
shelfGlass.position.y = 45;
//refractCubeCamera.position = shelfGlass.position;
scene.add(shelfGlass);

//DOORS

//top part
//wood
let woodStripR1Geometry = new THREE.CubeGeometry(8, 127, 2);
let woodStripR1Material = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});

let woodStripR1 = new THREE.Mesh(woodStripR1Geometry, woodStripR1Material);
woodStripR1.position.z = 18.5;
woodStripR1.position.y = 137.5;
woodStripR1.position.x = -35.75;

scene.add(woodStripR1);


let woodStripR2Geometry = new THREE.CubeGeometry(5, 127, 2);
let woodStripR2Material = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});

let woodStripR2 = new THREE.Mesh(woodStripR2Geometry, woodStripR2Material);
woodStripR2.position.z = 18.5;
woodStripR2.position.y = 137.5;
woodStripR2.position.x = -2.75;


scene.add(woodStripR2);


let woodStripR3Geometry = new THREE.CubeGeometry(26.5, 2, 2);
let woodStripR3Material = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});

let woodStripR3 = new THREE.Mesh(woodStripR3Geometry, woodStripR3Material);
woodStripR3.position.z = 18.5;
woodStripR3.position.y = 200;
woodStripR3.position.x = -18.5;


scene.add(woodStripR3);


//LEFT

let woodStripL1Geometry = new THREE.CubeGeometry(8, 127, 2);
let woodStripL1Material = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});

let woodStripL1 = new THREE.Mesh(woodStripL1Geometry, woodStripL1Material);
woodStripL1.position.z = 18.5;
woodStripL1.position.y = 137.5;
woodStripL1.position.x = 35.75;
scene.add(woodStripL1);


let woodStripL2Geometry = new THREE.CubeGeometry(5, 127, 2);
let woodStripL2Material = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});

let woodStripL2 = new THREE.Mesh(woodStripL2Geometry, woodStripL2Material);
woodStripL2.position.z = 18.5;
woodStripL2.position.y = 137.5;
woodStripL2.position.x = 2.75;
scene.add(woodStripL2);


let woodStripL3Geometry = new THREE.CubeGeometry(26.5, 2, 2);
let woodStripL3Material = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});

let woodStripL3 = new THREE.Mesh(woodStripL3Geometry, woodStripL3Material);
woodStripL3.position.z = 18.5;
woodStripL3.position.y = 200;
woodStripL3.position.x = 18.5;
scene.add(woodStripL3);


//Glass strip Right

let glassStripRGeometry = new THREE.CubeGeometry(26.5, 125, 1);
let glassStripRMaterial = new THREE.MeshLambertMaterial({
    color: 0xA8CCD7,
    refractionRatio: 0.5,
    reflectivity: 0.99,
    emissive: null
});

glassStripRMaterial.transparent = true;
glassStripRMaterial.opacity = 0.4;
let glassStripR = new THREE.Mesh(glassStripRGeometry, glassStripRMaterial);
glassStripR.position.z = 18.5;
glassStripR.position.y = 136.5;
glassStripR.position.x = -18.5;


scene.add(glassStripR);


//Glass strip Left

let glassStripLGeometry = new THREE.CubeGeometry(26.5, 125, 1);
let glassStripLMaterial = new THREE.MeshLambertMaterial({
    color: 0xA8CCD7,
    refractionRatio: 0.5,
    reflectivity: 0.99,
    emissive: null
});

glassStripLMaterial.transparent = true;
glassStripLMaterial.opacity = 0.4;
let glassStripL = new THREE.Mesh(glassStripLGeometry, glassStripLMaterial);
glassStripL.position.z = 18.5;
glassStripL.position.y = 136.5;
glassStripL.position.x = 18.5;
scene.add(glassStripL);


//lower part
let door1DGeometry = new THREE.CubeGeometry(39.5, 71, 2);
let door1DMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});
let door1D = new THREE.Mesh(door1DGeometry, door1DMaterial);
door1D.position.z = 18.5;
door1D.position.y = 38.5;
door1D.position.x = -20;
scene.add(door1D);

let door2DGeometry = new THREE.CubeGeometry(39.5, 71, 2);
let door2DMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});
let door2D = new THREE.Mesh(door2DGeometry, door2DMaterial);
door2D.position.z = 18.5;
door2D.position.y = 38.5;
door2D.position.x = 20;
scene.add(door2D);

//door knobs

//drawer
let drawerBottomGeometry = new THREE.CubeGeometry(77.5, 2, 31.5);
let drawerBottomMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});
let drawerSideGeometry = new THREE.CubeGeometry(12.5, 2, 27.5);
let drawerSideMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});

let drawerFrontGeometry = new THREE.CubeGeometry(77.5, 2, 12.5);
let drawerFrontMaterial = new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
    side: THREE.DoubleSide,
    emissive: null
});

let drawerBottom = new THREE.Mesh(drawerBottomGeometry, drawerBottomMaterial);
drawerBottom.position.z = 1.75;
drawerBottom.position.y = 75;

let drawerRight = new THREE.Mesh(drawerSideGeometry, drawerSideMaterial);
drawerRight.position.z = 1.75;
drawerRight.position.y = 82;
drawerRight.rotation.z += Math.PI / 2;
drawerRight.position.x = 37.75;

let drawerLeft = new THREE.Mesh(drawerSideGeometry, drawerSideMaterial);
drawerLeft.position.z = 1.75;
drawerLeft.position.y = 82;
drawerLeft.rotation.z += Math.PI / 2;
drawerLeft.position.x = -37.75;

let drawerFront = new THREE.Mesh(drawerFrontGeometry, drawerFrontMaterial);
drawerFront.position.z = 16.50;
drawerFront.position.y = 82;
drawerFront.rotation.x += Math.PI / 2;

let drawerBack = new THREE.Mesh(drawerFrontGeometry, drawerFrontMaterial);
drawerBack.position.z = -13;
drawerBack.position.y = 82;
drawerBack.rotation.x += Math.PI / 2;

var drawer = new THREE.Object3D();
drawer.add(drawerBottom);
drawer.add(drawerRight);
drawer.add(drawerLeft);
drawer.add(drawerFront);
drawer.add(drawerBack);
drawer.name = moduleTypes[2];
drawer2 = buildDrawer(100, 20, 150, 50, 0);
//scene.add(drawer2);

//Group door right
var rightDoor = new THREE.Object3D();
rightDoor.add(woodStripR1);
rightDoor.add(woodStripR2);
rightDoor.add(woodStripR3);
rightDoor.add(glassStripR);
rightDoor.add(door1D);
scene.add(rightDoor);

//Group left door
var leftDoor = new THREE.Object3D();
leftDoor.add(woodStripL1);
leftDoor.add(woodStripL2);
leftDoor.add(woodStripL3);
leftDoor.add(glassStripL);
leftDoor.add(door2D);
scene.add(leftDoor);

//Cabinet "Casket"
let cabinet = new THREE.Object3D();
cabinet.add(shelfGlass,
    shelf4, shelf3, shelf2, shelf1, backWall,
    rightWall, leftWall, ceiling, floor);
cabinet.name = moduleTypes[0];
scene.add(cabinet);

addShadowCastingAndReciever(cabinet);
addShadowCastingAndReciever(rightDoor);
addShadowCastingAndReciever(leftDoor);

//add objects to the raycast selection range
selectableObjects.push(rightDoor, leftDoor, cabinet,drawer);

//Lights
let ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(ambientLight);

let light1 = new THREE.PointLight(0xFF0040, 4, 50);
//scene.add(light1);

//RED SPOTLIGHT
let spotlight1 = new THREE.SpotLight(0xFFFFFF, 1);
spotlight1.position.set(0, 390, 350);
spotlight1.lookAt(0, 0, 0);
spotlight1.castShadow = true;
spotlight1.shadowCameraVisible = true;
spotlight1.shadowDarkness = 0.7;
scene.add(spotlight1);

//WHITE SPOTLIGHT
/*let spotlight2 = new THREE.SpotLight(0xFFFFFF, 0.3);
spotlight2.position.set(0, 250, -150);
// spotlight2.position.y = 150;
// spotlight2.position.z =-150;
spotlight2.castShadow = true;
spotlight2.shadowCameraVisible = true;
spotlight2.shadowDarkness = 1;
spotlight2.lookAt(0, 0, 0);
scene.add(spotlight2);*/

//ORANGE SPOTLIGHT
/*let spotlight3 = new THREE.SpotLight(0xFFFFFF, 1);
spotlight3.position.set(250, 250, 150);
// spotlight3.position.y = 150;
// spotlight3.position.x = 150;
spotlight3.castShadow = true;
spotlight3.shadowCameraVisible = true;
spotlight3.shadowDarkness = 1;
spotlight3.lookAt(0, 0, 0);
scene.add(spotlight3);*/

//GREEN SPOTLIGHT
/*let spotlight4 = new THREE.SpotLight(0xFFFFFF, 0.3);
spotlight4.position.set(-150, 250, 0);
// spotlight4.position.y = 150;
// spotlight4.position.x =-150;
spotlight4.castShadow = true;
spotlight4.shadowCameraVisible = true;
spotlight4.shadowDarkness = 1;
spotlight4.lookAt(0, 0, 0);
scene.add(spotlight4);*/

//RED SPOTLIGHT
//let geometryC1 = new THREE.BoxGeometry(5,5,7.5);
let geometryC1 = new THREE.SphereGeometry(3, 32, 32);
let materialC1 = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
let bulb1 = new THREE.Mesh(geometryC1, materialC1);
bulb1.position.set(spotlight1.position.x, spotlight1.position.y, spotlight1.position.z);
//bulb1.rotation.x-=0.5;
scene.add(bulb1);

//WHITE SPOTLIGHT
//let geometryC2 = new THREE.BoxGeometry(5,5,7.5);
/*let geometryC2 = new THREE.SphereGeometry(3, 32, 32);
let materialC2 = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
let bulb2 = new THREE.Mesh(geometryC2, materialC2);
bulb2.position.set(spotlight2.position.x, spotlight2.position.y, spotlight2.position.z);
//bulb2.rotation.x+=0.5;
scene.add(bulb2);*/

//ORANGE SPOTLIGHT
//let geometryC3 = new THREE.BoxGeometry(5,5,7.5);
/*let geometryC3 = new THREE.SphereGeometry(3, 32, 32);
let materialC3 = new THREE.MeshLambertMaterial({ color: 0xFFAA32 });
let bulb3 = new THREE.Mesh(geometryC3, materialC3);
bulb3.position.set(spotlight3.position.x, spotlight3.position.y, spotlight3.position.z);
//bulb3.rotation.z+=0.5;
scene.add(bulb3);*/

//GREEN SPOTLIGHT
//let geometryC4 = new THREE.BoxGeometry(5,5,7.5);
/*let geometryC4 = new THREE.SphereGeometry(3, 32, 32);
let materialC4 = new THREE.MeshLambertMaterial({ color: 0x00FF00 });
let bulb4 = new THREE.Mesh(geometryC4, materialC4);
bulb4.position.set(spotlight4.position.x, spotlight4.position.y, spotlight4.position.z);
//bulb4.rotation.z-=0.5;
scene.add(bulb4);*/

function posFigure(figure, posX, posY, rotX, rotY) {
    figure.position.x = posX;
    figure.position.y = posY;
    figure.rotation.x += rotX;
    figure.rotation.y += rotY;
}

/**light switch
 *
 * @type {HTMLElement}
 */

function lightControl() {
    if (spotlight1.intensity > 0 /*&& spotlight2.intensity > 0 && spotlight3.intensity > 0 && spotlight4.intensity > 0*/) {
        spotlight1.intensity = 0;
        //spotlight2.intensity = 0;
        //spotlight3.intensity = 0;
        //spotlight4.intensity = 0;
    } else {
        spotlight1.intensity = 1;
        //spotlight2.intensity = 1;
        //spotlight3.intensity = 1;
        //spotlight4.intensity = 1;
    }
}

function rotateLights() {
    let time = Date.now() * 0.0005;

    spotlight1.position.x = -1 * Math.cos(time) * 100;
    spotlight1.position.z = Math.sin(time) * 100;
    bulb1.position.set(spotlight1.position.x, spotlight1.position.y, spotlight1.position.z);

    /*spotlight2.position.x = Math.cos(time) * 100;
    spotlight2.position.z = -1 * Math.sin(time) * 100;
    bulb2.position.set(spotlight2.position.x, spotlight2.position.y, spotlight2.position.z);*/

    /*spotlight3.position.x = -1 * Math.sin(time) * 100;
    spotlight3.position.z = -1 * Math.cos(time) * 100;
    bulb3.position.set(spotlight3.position.x, spotlight3.position.y, spotlight3.position.z);*/

    /*spotlight4.position.x = Math.sin(time) * 100;
    spotlight4.position.z = Math.cos(time) * 100;
    bulb4.position.set(spotlight4.position.x, spotlight4.position.y, spotlight4.position.z);*/
}



function closeControlR() {
    if (!(rightDoor.position.z == 17.25)) {
        rightDoor.position.z += 17.25;
        rightDoor.position.x -= 58.5;
        rightDoor.rotateSpeed = 0.000001;
        rightDoor.rotation.y += Math.PI / 2;

    } else {
        rightDoor.position.z -= 17.25;
        rightDoor.position.x += 58.5;
        rightDoor.rotateSpeed = 0.000001;
        rightDoor.rotation.y -= Math.PI / 2;
    }

}


function closeControlL() {
    if (!(leftDoor.position.z == 17.25)) {
        leftDoor.position.z += 17.25;
        leftDoor.position.x += 58.5;
        leftDoor.rotateSpeed = 0.000001;
        leftDoor.rotation.y -= Math.PI / 2;
    } else {
        leftDoor.position.z -= 17.25;
        leftDoor.position.x -= 58.5;
        leftDoor.rotateSpeed = 0.000001;
        leftDoor.rotation.y += Math.PI / 2;
    }
}

function moveCamera (x,y,z) {
    camera.position.x = x;
    camera.position.y =y;
    camera.position.z=z;
}

function moveCameraPreset (preset) {
   if(preset==0){
            camera.position.z = 325;
            camera.position.y = 250;
            camera.position.x = 0;
        } else if(preset==1){
            camera.position.z = -325;
            camera.position.y = 250;
            camera.position.x = 0;
        }else if(preset==2){
            camera.position.z = 0;
            camera.position.y = 250;
            camera.position.x = 325;
        }else if(preset==3){
            camera.position.z = 0;
            camera.position.y = 250;
            camera.position.x = -325;
        }

}

function togglePickMode(){
    if (pickingMode === false) {
        pickingMode = true;
        alert('Picking On');
    }else {
        pickingMode = false;
        alert('Picking Off');
    }
}

function addAdvModule(y, module, texture){

    let newModule;
    let children = currentlyPickedObject.children;

    if(INTERSECTED == null || INTERSECTED === undefined || 
        INTERSECTED.parent == null || INTERSECTED.parent === undefined){
        alert("No Model/Module was picked!");
    }
    
    if (texture == -1) {
        return
    }
    let choosenMaterial = chooseMaterial(texture);

    if (module == -1) {
        return
    }

    if (module == 0) {
        newModule = buildDrawer(children[3].geometry.parameters.width, children[3].geometry.parameters.depth, choosenMaterial);
        //newModule.position.x =
        newModule.position.y = y;
        //newModule.position.z =
    }

    if (module == 1) {
        let shelfGeometry = new THREE.CubeGeometry(children[3].geometry.parameters.width, 2.5, children[3].geometry.parameters.depth);
        newModule = new THREE.Mesh(shelfGeometry, choosenMaterial);
        newModule.position.y = y;
    }
    if (module == 2) {
        var rodGeometry = new THREE.CylinderBufferGeometry(2.5, 2.5, children[3].geometry.parameters.width, 32);
        newModule = new THREE.Mesh(rodGeometry, choosenMaterial);
        newModule.position.y = y;
        newModule.rotation.z = Math.PI / 2;
    }
    addShadowCastingAndReciever(newModule);
    currentlyPickedObject.add(newModule);
    //add a switch case maybe??
    //baseado no modelo, adicionar dentro do modelo pai (INTERSECTED.parent)
    //variaveis necessarias devem ja estar globais

}

function buildDrawer(width, depth1, material){

    let height = 12.5;
    let thickness = 2;
    let depth = depth1 -thickness;

    let drawerBottomGeometry = new THREE.CubeGeometry(width, thickness, depth);
    
    let drawerSideGeometry = new THREE.CubeGeometry(height, thickness, depth-(thickness*2));
    

    let drawerFrontGeometry = new THREE.CubeGeometry(width, thickness, height);
    

    let drawerBottom = new THREE.Mesh(drawerBottomGeometry, material);


    let drawerRight = new THREE.Mesh(drawerSideGeometry, material);
    drawerRight.position.z = drawerBottom.position.z;
    drawerRight.position.y = drawerBottom.position.y + height/2 + thickness/2;
    drawerRight.rotation.z += Math.PI / 2;
    drawerRight.position.x = drawerBottom.position.x + width/2 - thickness/2;

    let drawerLeft = new THREE.Mesh(drawerSideGeometry, material);
    drawerLeft.position.z = drawerBottom.position.z;
    drawerLeft.position.y = drawerBottom.position.y + height/2 + thickness/2;
    drawerLeft.rotation.z += Math.PI / 2;
    drawerLeft.position.x = drawerBottom.position.x - (width/2 - thickness/2);

    let drawerFront = new THREE.Mesh(drawerFrontGeometry, material);
    drawerFront.position.z = drawerBottom.position.z + depth/2 - thickness/2;
    drawerFront.position.y = drawerBottom.position.y + height/2 + thickness/2;
    drawerFront.position.x = drawerBottom.position.x;
    drawerFront.rotation.x += Math.PI / 2;

    let drawerBack = new THREE.Mesh(drawerFrontGeometry, material);
    drawerBack.position.z = drawerBottom.position.z - depth/2 + thickness/2;
    drawerBack.position.y = drawerBottom.position.y + height/2 + thickness/2;
    drawerBack.position.x = drawerBottom.position.x;
    drawerBack.rotation.x += Math.PI / 2;

    var drawer = new THREE.Object3D();
    drawer.add(drawerBottom);
    drawer.add(drawerRight);
    drawer.add(drawerLeft);
    drawer.add(drawerFront);
    drawer.add(drawerBack);
    drawer.name = moduleTypes[2];
    drawer.position.z += thickness/2;
    return drawer;
}

function deleteModuleFromScene(){
    if (pickingMode === false && (currentlyPickedObject != null || currentlyPickedObject!==undefined) ) {
        selectableObjects.pop(currentlyPickedObject);
       scene.remove(currentlyPickedObject);
    }else {
        alert("No Module Selected!");
    }
}

//mouse over pick
window.addEventListener('mousemove', onMouseMove, false);
function onMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

let picking = function () {
    // find intersections
    raycaster.setFromCamera(mouse, camera);
    //var intersects = raycaster.intersectObjects(scene.children, true);
    var intersects = raycaster.intersectObjects(selectableObjects, true);

    if (intersects.length > 0) {
        if (INTERSECTED !== intersects[0].object) {
            if (INTERSECTED) INTERSECTED.parent.traverse(function (node) { if (node instanceof THREE.Mesh) { node.material.emissive.setHex(INTERSECTED.currentHex);} });
            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            if(INTERSECTED.parent != null || INTERSECTED.parent !== undefined){
                INTERSECTED.parent.traverse(function (node) { if (node instanceof THREE.Mesh) { node.material.emissive.setHex(0xff0000);} });
            }
        }
    } else {
        if (INTERSECTED) INTERSECTED.parent.traverse(function (node) { if (node instanceof THREE.Mesh) { node.material.emissive.setHex(INTERSECTED.currentHex);} });
        INTERSECTED = null;
    }
}

/**GUI*/
window.onload = function () {
    displayGUI();
};

function chooseMaterial(texture) {
    let choosenMaterial;

    if (texture == 0) {
        choosenMaterial = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'),
            side: THREE.DoubleSide,
            emissive: null
        });

    }
    if (texture == 1) {
        choosenMaterial = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load('imgs/TestTextureOak.jpg'),
            side: THREE.DoubleSide,
            emissive: null
        });

    }
    if (texture == 2) {
        choosenMaterial = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load('imgs/TestTextureAluminum.jpg'),
            side: THREE.DoubleSide,
            emissive: null
        });

    }
    if (texture == 3) {
        choosenMaterial = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load('imgs/TestTextureMozaic.jpg'),
            side: THREE.DoubleSide,
            emissive: null
        });

    }
    if (texture == 4) {
        choosenMaterial = new THREE.MeshLambertMaterial({
            map: new THREE.TextureLoader().load('imgs/TestTextureMarble.jpg'),
            side: THREE.DoubleSide,
            emissive: null
        });

    }
    if (texture == 5) {
        choosenMaterial = new THREE.MeshLambertMaterial({
            color: 0xA8CCD7,
            refractionRatio: 0.5,
            reflectivity: 0.99,
            emissive: null
        });
        choosenMaterial.transparent = true;
        choosenMaterial.opacity = 0.4;

    }
    return choosenMaterial;
}

function SceneEditor() {
    self = this;
    this.xBasePos = 0;
    this.zBasePos = 0;
    this.xPos = 0;
    this.yPos = 0;
    this.zPos = 0;
    this.material = -1;
    this.chosenAdvModule=-1;//tipo de module interno
    this.X = 0;
    this.Y = 0;
    this.Z = 0;
    this.presets = -1;
    this.size = -1;
    this.cameraMove = function () { moveCamera(self.X,self.Y,self.Z)};
    this.cameraMovePreset = function () { moveCameraPreset(self.presets)};
    this.addModule = function () { addBaseModule(self.xBasePos, self.zBasePos, self.xPos, self.yPos, self.zPos, self.material); };
    this.addPresetModule = function () { addPresetBaseModule(self.size,self.xBasePos,self.zBasePos)};
    this.lightSwitch = function() { lightControl()};
    this.openCloseL = function(){ closeControlL()};
    this.openCloseR = function() { closeControlR()};
    this.togglePick = function () { togglePickMode() };
    this.modules = -1;
    this.materials = -1;
    this.yMPos = 0;
    this.addAdvancedModule = function () { addAdvModule(self.yMPos, self.modules, self.materials) };
    this.deleteFromScene = function() { deleteModuleFromScene() };
}

var sceneEditor = new SceneEditor();

function displayGUI() {
    /** Lights */
    var lightFolder = gui.addFolder('Lights');
    lightFolder.add(sceneEditor, 'lightSwitch').name("Light Switch");

    /** Toggle Picking Mode*/
     var pickingFolder = gui.addFolder('Picking');
    pickingFolder.add(sceneEditor, 'togglePick').name('Toggle Picking');

    /** Doors */
    var doorsFolder = gui.addFolder('Doors');
    doorsFolder.add(sceneEditor, 'openCloseL').name("Open/Close Left");
    doorsFolder.add(sceneEditor, 'openCloseR').name('Open/Close Right');

    var cameraFolder = gui.addFolder('Camera');

    var manualChangesFolder = cameraFolder.addFolder('Manual');
    manualChangesFolder.add(sceneEditor,'X',-500,500).name("X");
    manualChangesFolder.add(sceneEditor,'Y',0,390).name("Y");
    manualChangesFolder.add(sceneEditor,'Z',-500,500).name("Z");
    manualChangesFolder.add(sceneEditor,'cameraMove').name('Change Camera Position');

    var presetCameraPositionsFolder = cameraFolder.addFolder('Preset');
    presetCameraPositionsFolder.add(sceneEditor, 'presets', { Choose: -1, Default: 0, Back: 1, Right: 2, Left: 3}).name("Presets");
    presetCameraPositionsFolder.add(sceneEditor, 'cameraMovePreset').name('Change Camera Position');



    /**Basic Module Add */
    var addModuleFolder = gui.addFolder('Add Base Module');
    var addModuleManualFolder = addModuleFolder.addFolder('Add Manual');
    addModuleManualFolder.add(sceneEditor, 'xBasePos', -300, 300).name("XBASE");
    addModuleManualFolder.add(sceneEditor, 'zBasePos', -300, 200).name("ZBASE");
    addModuleManualFolder.add(sceneEditor, 'xPos', 0, 250).name("Width");
    addModuleManualFolder.add(sceneEditor, 'yPos', 0, 300).name("Heigth");
    addModuleManualFolder.add(sceneEditor, 'zPos', 0, 250).name("Depth");
    addModuleManualFolder.add(sceneEditor, 'material', { Choose: -1, Wood: 0, Oak: 1, Aluminum: 2, Mozaic: 3, Marble: 4, Glass: 5 });
    addModuleManualFolder.add(sceneEditor, 'addModule').name('Add Module');

    let addModulePresetFolder = addModuleFolder.addFolder('Add Preset');
    addModulePresetFolder.add(sceneEditor, 'xBasePos', -300, 300).name("XBASE");
    addModulePresetFolder.add(sceneEditor, 'zBasePos', -300, 200).name("ZBASE");
    addModulePresetFolder.add(sceneEditor, 'size', { Choose: -1, XS: 0, S: 1, M: 2, L: 3, XL: 4}).name('Size');
    addModulePresetFolder.add(sceneEditor, 'addPresetModule').name('Add Module');

    let baseModuleFolder = gui.addFolder('Base Module Config');
    //add the comboBox here
    baseModuleFolder.add(sceneEditor, 'yMPos', 0, 300).name("Height");
    baseModuleFolder.add(sceneEditor, 'modules', { Choose: -1, Drawer: 0, Shelf: 1, Rod: 2 });
    baseModuleFolder.add(sceneEditor, 'materials', { Choose: -1, Wood: 0, Oak: 1, Aluminum: 2, Mozaic: 3, Marble: 4, Glass: 5 });
    baseModuleFolder.add(sceneEditor,'addAdvancedModule').name('Add Selected Module');

    gui.add(sceneEditor,'deleteFromScene').name('Delete Selected Module');
}

//mouse onClick pick
window.addEventListener('dblclick', onMouseClickPick, false);
function onMouseClickPick(event) {
    event.preventDefault();
    if(pickingMode === true){
        pickingMode = false;
        if(INTERSECTED.parent != null && INTERSECTED.parent !== undefined){
            currentlyPickedObject = INTERSECTED.parent;
        }
        //INTERSECTED ETC
    }else{
        //Do Nothing and keep executing normal functions
        currentlyPickedObject = null;
    }
}

//draw scene
let render = function () {
    renderer.clear();
    renderer.clearDepth();
    renderer.render(scene, camera);
}

//updates the scene before render
let update = function () {
    controls.update();
    if(pickingMode == true){
        picking();
    }
    rotateLights();
}

//runs the program
let loop = function () {
    /*for ( var ii=0;ii<views.length;++ii){
        var view = views[ ii ];
        let camera = new THREE.PerspectiveCamera(view.fov, window.innerWidth / window.innerHeight, 0.01, 100000);
        camera.position.fromArray(view.eye);
        camera.up.fromArray(view.up);
        view.camera = camera;
    }**/

    requestAnimationFrame(loop);
    update();
    render();
}

loop();

