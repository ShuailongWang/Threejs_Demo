import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { Color } from "three";
import Stats from 'three/examples/jsm/libs/stats.module.js'
import * as dat from "dat.gui";

let scene, mainCamera, renderer, statsPanel, datgui, clock;
let smallBall;

init();
initStats();
setup();
onUpdate();

function init() {
    //场景
    scene = new THREE.Scene();

    //相机
    mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    mainCamera.position.set(0, 3, -4);
    scene.add(mainCamera);

    //渲染器
    renderer = new THREE.WebGL1Renderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;  //开启阴影计算
    renderer.physicallyCorrectLights = true;
    document.body.appendChild(renderer.domElement);

    //环境光
    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    //直线光
    // const direLight = new THREE.DirectionalLight(0xffffff, 0.5);
    // direLight.position.set(10, 10, 10);
    // direLight.castShadow = true;    //设置光照投射阴影
    // direLight.shadow.radius = 20;   //模糊度
    // direLight.shadow.mapSize.set(2048, 2048);   //阴影题图的分辨率， 投影更加的细致
    // direLight.shadow.camera.near = 0.5;  //设置投射摄像机的属性
    // direLight.shadow.camera.far = 500;
    // direLight.shadow.camera.top = 5;
    // direLight.shadow.camera.bottom = -5;
    // direLight.shadow.camera.left = -5;
    // direLight.shadow.camera.right = 5;
    // scene.add(direLight);

    // //ui
    datgui = new dat.GUI();
    // datgui.add(direLight.shadow.camera, "near")
    // .min(0)
    // .max(10)
    // .step(0.1)
    // .onChange(()=>{
    //     console.log("direLight.shadow.camera onchange");
    //     direLight.shadow.camera.updateProjectionMatrix();
    // });

    //轨道控制器
    const orbitVC = new OrbitControls(mainCamera, renderer.domElement);
    orbitVC.enableDamping = true;

    //屏幕变化
    window.addEventListener("resize", onWindowResize);

    //时钟
    clock = new THREE.Clock();
}

//刷新
function onUpdate() {
    //小球围绕旋转
    if (clock && smallBall) {
        let time = clock.getElapsedTime();
        smallBall.position.x = Math.sin(time) * 3;
        smallBall.position.z = Math.cos(time) * 3;
    }

    if (statsPanel) {
        statsPanel.update();
    }
    if (renderer) {
        renderer.render(scene, mainCamera);
    }
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
}

function setup(){
    const material = new THREE.MeshStandardMaterial();
    //平面
    const planGeo = new THREE.PlaneGeometry(30, 30);
    const planMesh = new THREE.Mesh(planGeo, material);
    planMesh.position.set(0, -1, 0);
    planMesh.rotation.x = -Math.PI/2;
    planMesh.receiveShadow = true;   //接收投射阴影
    scene.add(planMesh);

    //球
    const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
    const sphereMesh = new THREE.Mesh(sphereGeometry, material);
    sphereMesh.castShadow = true;   //设置光照投射阴影
    scene.add(sphereMesh);

    // //聚光灯
    // const spotLight = new THREE.SpotLight(0xffffff, 0.5);
    // spotLight.position.set(0, 2, 0);
    // spotLight.castShadow = true;    //设置光照投射阴影
    // spotLight.shadow.radius = 20;   //模糊度
    // spotLight.shadow.mapSize.set(2048, 2048);   //阴影题图的分辨率， 投影更加的细致
    // spotLight.target = sphereMesh;  //目标
    // spotLight.angle = Math.PI/6;    //角度
    // spotLight.distance = 0;         //距离
    // spotLight.penumbra = 0;         //聚光锥的阴影
    // spotLight.decay = 0;            //光照衰减（在物理模式下renderer.physicallyCorrectLights = true;）
    // spotLight.intensity = 2;        //亮度
    // //设置透视摄像机的属性
    // scene.add(spotLight);

    // //ui
    // if (datgui) {
    //     datgui.add(sphereMesh.position, "x").min(-5).max(5).step(0.1);
    //     datgui.add(spotLight, "angle").min(0).max(Math.PI/2).step(0.01);
    //     datgui.add(spotLight, "distance").min(0).max(10).step(0.01);
    //     datgui.add(spotLight, "penumbra").min(0).max(1).step(0.01);
    //     datgui.add(spotLight, "decay").min(0).max(5).step(0.01);
    // }

    smallBall = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 20, 20),
        new THREE.MeshBasicMaterial({color:0xff0000})
    );
    smallBall.position.set(0, 2, 0);
    scene.add(smallBall);

    //点光源
    const pointLight = new THREE.PointLight(0xff0000, 1);
    pointLight.position.set(0, 2, 0);
    pointLight.castShadow = true;    //设置光照投射阴影
    pointLight.shadow.radius = 20;   //模糊度
    pointLight.shadow.mapSize.set(2048, 2048);   //阴影题图的分辨率， 投影更加的细致
    pointLight.target = sphereMesh;  //目标
    pointLight.intensity = 2;        //亮度
    //设置透视摄像机的属性
    smallBall.add(pointLight);

    //ui
    if (datgui) {
        datgui.add(smallBall.position, "x").min(-5).max(5).step(0.1);
        datgui.add(pointLight, "distance").min(0).max(50).step(0.01);
        datgui.add(pointLight, "decay").min(0).max(5).step(0.01);
    }

}