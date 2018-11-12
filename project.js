const THREE = require('./js/three');

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

//Cube1
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//Cube2
var geometry2 = new THREE.BoxGeometry(1, 1, 1);
var material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
var cube2 = new THREE.Mesh(geometry2, material2);
scene.add(cube2);

//Cube3
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

var update = function () {
}

var loop = function () {
    requestAnimationFrame(loop);
    posFigure(cube, 1, 0, 0.05, 0.05);
    posFigure(cube2, -1, 0, 1, 1);
    posFigure(cube3, 0, 0, -0.05, -0.05);
    update();
    render();
}

loop();
