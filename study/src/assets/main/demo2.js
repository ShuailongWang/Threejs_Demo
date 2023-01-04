import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { Color } from "three";

//场景
const scene = new THREE.Scene();

//相机
const mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
mainCamera.position.set(0, 0, 10);
scene.add(mainCamera);

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
creatBoxObject();

//渲染场景
function onUpdate(){
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

    //box
    const geometry = new THREE.BoxGeometry(5,5,5);
    const material = new THREE.MeshBasicMaterial({
        color:0xffff00,
        map: tvTexture,
    });
    const boxMesh = new THREE.Mesh(geometry, material);
    scene.add(boxMesh);
}
