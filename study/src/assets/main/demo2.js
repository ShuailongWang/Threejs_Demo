import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { Color } from "three";
import Stats from 'three/examples/jsm/libs/stats.module.js'


//场景
const scene = new THREE.Scene();

//相机
const mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
mainCamera.position.set(0, 0, 10);
scene.add(mainCamera);

//灯光,环境光
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

//直线光
const direLight = new THREE.DirectionalLight(0xffffff, 0.5);
direLight.position.set(10, 10, 10);
scene.add(direLight);

//渲染器
const render = new THREE.WebGL1Renderer();
render.setSize(window.innerWidth, window.innerHeight);

//将webgl渲染的canvas内容添加到body
document.body.appendChild(render.domElement);

//轨道控制器
const orbitVC = new OrbitControls(mainCamera, render.domElement);
orbitVC.enableDamping = true;


//创建Cube
//creatPlanObject();
// creatSanObject();
// creatBoxObject();
// creatSamllObject();
textDemo1();

//性能监视器
const statsPanel = new Stats();

//设置监视器面板，传入面板id（0: fps, 1: ms, 2: mb）
statsPanel.setMode(0)

//设置监视器位置
statsPanel.domElement.style.position = 'absolute'
statsPanel.domElement.style.left = '0px'
statsPanel.domElement.style.top = '0px'

//将监视器添加到页面中
document.body.appendChild(statsPanel.domElement)

//渲染场景
function onUpdate(){
    //更新帧率
    statsPanel.update();
    //
    render.render(scene, mainCamera);
    requestAnimationFrame(onUpdate);//每帧渲染
}
onUpdate();

//创建一个面
function creatPlanObject(){
    //UV, 一个面
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        -1.0, -1.0, 1.0,  1.0, -1.0, 1.0,  1.0, 1.0, 1.0,
        1.0,1.0,1.0,      -1.0,1.0,1.0,    -1.0,-1.0,1.0
    ]);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));//一维数组，每3个为一组

    //材质
    const material = new THREE.MeshBasicMaterial({color:0xffff00});
    
    //
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
};

//创建三角
function creatSanObject(){
    for(let i=0; i<50; i++) {
        const geometry = new THREE.BufferGeometry();
        const positionArray = new Float32Array(9);
        for (let j=0; j<9; j++){
            positionArray[j] = Math.random() * 10 - 5; //(-5~5)
        }

        geometry.setAttribute(
            "position", 
            new THREE.BufferAttribute(positionArray, 3)
        );

        let color = new Color(Math.random(), Math.random(), Math.random());
        const material = new THREE.MeshBasicMaterial({
            color:color,        //颜色
            transparent:true,   //是否透明
            opacity:0.5,        //透明度
        });
        const mesh = new THREE.Mesh(geometry, material);
        console.log(mesh);
        scene.add(mesh);
    }
};

//Box
function creatBoxObject(){
    //加载图片纹理
    const textureLoader = new THREE.TextureLoader();
    const tvTexture = textureLoader.load("./textures/tv.png");

    //偏移
    // tvTexture.offset.x = 0.5;
    // tvTexture.offset.y = 0.5;
    ////tvTexture.offset.set(0.5, 0.5);

    //旋转
    // tvTexture.rotation = Math.PI / 4;
    // tvTexture.center.set(0.5, 0.5); //设置中心点

    //重复
    // tvTexture.repeat.set(2, 3);//水平2次，垂直3次
    // tvTexture.wrapS = THREE.RepeatWrapping;//模式
    // tvTexture.wrapT = THREE.MirroredRepeatWrapping;//镜像重复

    //透明纹理(黑色：完全透明；白色：完全不透明)
    const alphaTexture = textureLoader.load("./textures/tv_alpha.png");

    //环境遮挡贴图
    const aoTexture = textureLoader.load("./textures/tv_border.png");

    //box
    const geometry = new THREE.BoxGeometry(5,5,5);
    const material = new THREE.MeshBasicMaterial({
        color:0xffff00,
        map: tvTexture,
        alphaMap: alphaTexture,
        transparent: true,      //允许透明
        aoMap: aoTexture,
        aoMapIntensity: 0.5,    //强度
        // opacity: 0.1,
        // side: THREE.BackSide,  //渲染哪一面（前、背、两者）
    });
    const boxMesh = new THREE.Mesh(geometry, material);
    scene.add(boxMesh);

    //环境贴图需要设置第二组UV
    geometry.setAttribute(
        "uv2", 
        new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
    );
}

//纹理显示
function creatSamllObject(){
    //加载图片纹理
    const textureLoader = new THREE.TextureLoader();
    const smallTexture = textureLoader.load("./textures/wall10_ne.png");

    //模糊
    smallTexture.minFilter = THREE.LinearFilter;
    smallTexture.magFilter = THREE.LinearFilter;

    //像素
    // smallTexture.minFilter = THREE.NearestFilter;
    // smallTexture.magFilter = THREE.NearestFilter;

    //box
    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshBasicMaterial({
        color:0xffff00,
        map: smallTexture,
    });
    const boxMesh = new THREE.Mesh(geometry, material);
    scene.add(boxMesh);
}

function textDemo1(){
    //加载图片纹理
    const textureLoader = new THREE.TextureLoader();
    const tvTexture = textureLoader.load("./textures/tv.png");

    //透明纹理(黑色：完全透明；白色：完全不透明)
    const alphaTexture = textureLoader.load("./textures/tv_alpha.png");

    //环境遮挡贴图
    const aoTexture = textureLoader.load("./textures/tv_border.png");

    //置换贴图，提高纹理效果
    const hightTexture = textureLoader.load("./textures/tv_border.png");

    //标准材质
    const geometry = new THREE.BoxGeometry(5,5,5);
    const material = new THREE.MeshStandardMaterial({
        color:0xffff00,
        map: tvTexture,
        alphaMap: alphaTexture,
        transparent: true,      //允许透明
        aoMap: aoTexture,
        aoMapIntensity: 1,    //强度
        displacementMap: hightTexture, //
        displacementScale: 0.1,
    });
    const boxMesh = new THREE.Mesh(geometry, material);
    scene.add(boxMesh);
}