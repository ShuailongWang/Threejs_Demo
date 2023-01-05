import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Stats from 'three/examples/jsm/libs/stats.module.js'

let scene, mainCamera, renderer, statsPanel, orbitVC, clock;
let player;

let moveForward = false;    //前进  
let moveBackward = false;   //后退
let moveLeft = false;       //向左
let moveRight = false;      //向右
let canJump = false;        //跳跃

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

start();
function start() {
    init();
    initStats();
    setup();
    onUpdate();
}

function init() {
    //场景
    scene = new THREE.Scene();

    //相机
    mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    mainCamera.position.set(0, 3, -4);
    scene.add(mainCamera);

    //环境光
    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    //直线光
    const direLight = new THREE.DirectionalLight(0xffffff, 0.5);
    direLight.position.set(10, 10, 10);
    direLight.castShadow = true;    //设置光照投射阴影
    direLight.shadow.radius = 20;   //模糊度
    direLight.shadow.mapSize.set(2048, 2048);   //阴影题图的分辨率， 投影更加的细致
    scene.add(direLight);

    //渲染器
    renderer = new THREE.WebGL1Renderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //轨道控制器
    orbitVC = new OrbitControls(mainCamera, renderer.domElement);
    orbitVC.enableDamping = true;

    //屏幕变化
    window.addEventListener("resize", onWindowResize);

    //时钟
    clock = new THREE.Clock();
}


//刷新
function onUpdate() {
    if (statsPanel) {
        statsPanel.update();
    }
    if (renderer) {
        renderer.render(scene, mainCamera);
    }
    orbitVC.update();
    requestAnimationFrame(onUpdate);
}

//性能面板
function initStats() {
    statsPanel = new Stats();
    statsPanel.setMode(0);  //传入面板id（0: fps, 1: ms, 2: mb）
    statsPanel.domElement.style.position = 'absolute';   //设置监视器位置
    statsPanel.domElement.style.left = '0px';
    statsPanel.domElement.style.top = '0px';
    document.body.appendChild(statsPanel.domElement);
}

//屏幕变化
function onWindowResize() {
    if (mainCamera) {
        mainCamera.aspect = window.innerWidth / window.innerHeight;
        mainCamera.updateProjectionMatrix();
    }
    if (renderer) {
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    checkMove();
}


function setup(){
    //平面
    const planGeo = new THREE.PlaneGeometry(100, 100, 1, 1);
    const planMaterial = new THREE.MeshStandardMaterial();
    const planMesh = new THREE.Mesh(planGeo, planMaterial);
    planMesh.position.set(0, 0, 0);
    planMesh.rotation.x = -Math.PI/2;
    planMesh.receiveShadow = true;   //接收投射阴影
    scene.add(planMesh);

    //球
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({color:0xff0000});
    player = new THREE.Mesh(boxGeometry, boxMaterial);
    player.position.set(0, 0.5, 0)
    player.castShadow = true;   //设置光照投射阴影
    scene.add(player);

    // const videoDiv = document.getElementById( 'video' );
    // videoDiv.play();
    // videoDiv.addEventListener( 'play', function () {

    // } );
    
    // const videoGeo = new THREE.PlaneGeometry(10, 10, 1, 1);
    //const videoMat = new THREE.VideoTexture()
}

function checkMove() {

}