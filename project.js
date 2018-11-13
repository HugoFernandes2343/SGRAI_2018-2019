const THREE = require('./js/three');
//THREE = require('./js/OrbitControls');
//THREErequire('./js/OrbitControls');

/**
 * ##############################################################################################
 * ##############################################################################################
 * ##############################################################################################
 */
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//update viewport on resize
window.addEventListener('resize', function (){
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
})

//controls
//controls = new THREE.OrbitControls(camera, renderer.domElement);


//shape
var geometry = new THREE.BoxGeometry(1, 1, 1);

//textures & colors
var cube1materials = [
  new THREE.MeshBasicMaterial({color: 0x458000, side: THREE.DoubleSide}),//right side
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('imgs/TestTextureWood.png'), side: THREE.DoubleSide}),//left side
  new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide}),// top
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('imgs/TestTextureMetal.jpg'), side: THREE.DoubleSide}),// bottom side
  new THREE.MeshBasicMaterial({color: 0x0080FF, side: THREE.DoubleSide}),//front side
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('imgs/TestTextureWater.jpg'), side: THREE.DoubleSide})// back side
];

//Cube1 white
var material = new THREE.MeshFaceMaterial(cube1materials);
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//Cube2 green
var geometry2 = new THREE.BoxGeometry(1, 1, 1);
var material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
var cube2 = new THREE.Mesh(geometry2, material2);
scene.add(cube2);

//Cube3 red
var geometry3 = new THREE.BoxGeometry(0.05, 0.05, 0.05);
var material3 = new THREE.MeshBasicMaterial({ color: 0xee2a00, wireframe: true });
var cube3 = new THREE.Mesh(geometry3, material3);
scene.add(cube3);

camera.position.z = 2;

function posFigure(figure, posX, posY, rotX, rotY) {
    figure.position.x = posX;
    figure.position.y = posY;
    figure.rotation.x += rotX;
    figure.rotation.y += rotY;
}

//draw scene
var render = function () {
    renderer.render(scene, camera);
}

//updates the scene before render
var update = function () {
    posFigure(cube, 1, 0, 0.01, 0.01);
    posFigure(cube2, -1, 0, 0.2, 0.1);
    posFigure(cube3, 0, 0, -0.05, -0.05);
}

//runs the program
var loop = function () {
    requestAnimationFrame(loop);

    update();
    render();
}

loop();
