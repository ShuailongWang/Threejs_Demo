import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { TGALoader } from "three/examples/jsm/loaders/TGALoader.js";

let scene, mainCamera, renderer, statsPanel;

init();
loadModeling();
initStatsPanel();
onWindowResize();
onUpdate();

//初始化
function init(){
    //场景
    scene = new THREE.Scene();
    const envirTexture = new THREE.TextureLoader().load("./model/tex1.7/background.jpg");
    envirTexture.mapping = THREE.EquirectangularReflectionMapping;  //映射，告诉是什么类型
    scene.background = envirTexture;    //场景背景
    scene.environment = envirTexture;   //场景所有的物体添加默认的环境贴图

    //相机
    mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    mainCamera.position.set(-90, 118, -275);//位置
    mainCamera.aspect = window.innerWidth/window.innerHeight;//更新摄像头宽高比例
    mainCamera.updateProjectionMatrix();//更新摄像头矩阵
    scene.add(mainCamera);

    //灯光
    const dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( 0, 200, 100 );
    scene.add( dirLight );

    //渲染
    renderer = new THREE.WebGL1Renderer({
        antialias:true, //抗锯齿
    });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(window.innerWidth, window.innerHeight);

    //将webgl渲染的canvas内容添加到body
    document.body.appendChild(renderer.domElement);

    //轨道控制器
    const orbitVC = new OrbitControls(mainCamera, renderer.domElement);
    orbitVC.enableDamping = true;

    //屏幕变化
    window.addEventListener( 'resize', onWindowResize );
}

//加载模型
function loadModeling(){
    const manager = new THREE.LoadingManager();
    manager.addHandler(/\.tga$/i, new TGALoader());

    const loader = new FBXLoader(manager);
    loader.load("./model/cj_20221207.fbx", (object)=>{
        if (object) {
            scene.add(object);
            console.log(object);
        }
    });
}

//刷新
function onUpdate(){
    statsPanel.update();
    renderer.render(scene, mainCamera);
    requestAnimationFrame(onUpdate);
}

//屏幕变化
function onWindowResize() {
    mainCamera.aspect = window.innerWidth / window.innerHeight;
    mainCamera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

//性能监视器
function initStatsPanel(){
    statsPanel = new Stats();
    statsPanel.setMode(0);   //传入面板id（0: fps, 1: ms, 2: mb）
    statsPanel.domElement.style.position = 'absolute';  //设置监视器位置
    statsPanel.domElement.style.left = '0px';
    statsPanel.domElement.style.top = '0px';
    document.body.appendChild(statsPanel.domElement)
}