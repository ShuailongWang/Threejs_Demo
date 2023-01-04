import * as THREE from "three";
import { Color } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import gsap from "gsap"
import * as dat from "dat.gui";

//场景
const scene = new THREE.Scene();

//相机，（视野、纵横比、近平面、远平面）
const mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
mainCamera.position.set(0, 0, 10);
scene.add(mainCamera);

//创建几何体，（网格，材质）
const cudeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cudeMat = new THREE.MeshBasicMaterial({
    color:0xffff00
});
//根据（网格，材质）创建物体
const cubeObject = new THREE.Mesh(cudeGeometry, cudeMat);
scene.add(cubeObject);

//修改位置
// cubeObject.position.x = 5;

//旋转
// cubeObject.rotation.set(Math.PI/4.0, 0, 0);

//渲染
const render = new THREE.WebGL1Renderer();
render.setSize(window.innerWidth, window.innerHeight);

//将webgl渲染的canvas内容添加到body
document.body.appendChild(render.domElement);

// //使用渲染器，通过相机将场景渲染进来
// render.render(scene, mainCamera);

//添加轨道控制器，相机围绕物体旋转
const controls = new OrbitControls(mainCamera, render.domElement);
controls.enableDamping = true;  //设置阻尼，必须在动画循环里面调用update();

//添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

var ani1;
function startAnimation(){
    //gsap动画
    ani1 = gsap.to(cubeObject.position, {
        x:5, 
        duration:5,             //时长
        ease:"power1.inOut",    //动画
        repeat:2,               //重复
        yoyo:true,              //往返
        delay:2,                //延迟两秒移动
        onComplete: ()=>{
            console.log("动画完成");
        }, 
        onStart: ()=>{
            console.log("动画开始");
        }
    });    //x移动，时长5秒
    gsap.to(cubeObject.rotation, {x:2 * Math.PI, duration:5});  //旋转
}


//UI界面
const gui = new dat.GUI();
gui.add(cubeObject.position, "x").min(0).max(5).step(0.01).name("移动x轴")
.onChange((value)=>{
    console.log("changge x => " + value);
})
.onFinishChange((value)=>{
    console.log("停止" + value);
});//设置x的值，最大

//修改颜色
const params = {
    color:"#ffff00",
    fn: ()=>{
        startAnimation();
    },
};
gui.addColor(params, 'color').onChange((value)=>{
    console.log("颜色修改：" + value);
    cubeObject.material.color.set(value);
});

gui.add(cubeObject, "visible").name("是否显示")
gui.add(params, "fn").name("开始动画");

var gFolder = gui.addFolder("设置");
gFolder.add(cubeObject.material, "wireframe");



//监听双击事件
window.addEventListener("dblclick", ()=>{
    if (ani1.isActive()){
        console.log("双击暂停");
        ani1.pause();//暂停
    } else {
        console.log("双击恢复");
        ani1.resume();//恢复
    }

    //全屏
    const fisFullElement = document.fullscreenElement;
    if (fisFullElement) {
        document.exitFullscreen();
    } else {
        render.domElement.requestFullscreen();
    }
});

//渲染函数
function updateRender(time){
    // //cube移动
    // cubeObject.position.x += 0.01;
    // if (cubeObject.position.x > 5) {
    //     cubeObject.position.x = 0;
    // }

    // //cube缩放
    // cubeObject.scale.x += 0.01;
    // cubeObject.scale.x = 1;
    // if (cubeObject.scale.x > 5) {
    //     cubeObject.scale.x = 1;
    // }

    // //旋转
    // cubeObject.rotation.x += 0.01;

    // let t = (time / 1000) % 5;
    // cubeObject.position.x = t * 1;

    //渲染
    controls.update();
    render.render(scene, mainCamera);
    requestAnimationFrame(updateRender);    //每帧渲染
}
updateRender();


//画面变化，更新渲染画面
window.addEventListener("resize", ()=>{
    mainCamera.aspect = window.innerWidth/window.innerHeight;
    mainCamera.updateProjectionMatrix();    //更新摄像机的摄影矩阵
    render.setSize(window.innerWidth, window.innerHeight);  //更新渲染器
    render.setPixelRatio(window.devicePixelRatio);  //设置渲染器的像素比
});
