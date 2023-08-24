import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { getEventLocation } from './nasaInfo';
import { getCalender } from './calender';


import earthbumpmap from '../Assets/earthbumpmap.jpg';
import earthImage from '../Assets/earth.jpg';
import clouds from '../Assets/earthCloudMap.png'
import moonImage from '../Assets/moon.jpg';
import sunMap from '../Assets/sun.jpg';
import stars from '../Assets/stars.jpg'

//html elements
document.querySelector(".results").style.visibility = "hidden"
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("next");


const now = new Date();

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();




const mainCamera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
scene.add(mainCamera);
mainCamera.position.set(0,0,20);



const orbit = new OrbitControls(mainCamera, renderer.domElement);
orbit.update();
orbit.enablePan = false;
orbit.enableZoom = false;

const sunlight = new THREE.SpotLight(0xffcc33);
scene.add(sunlight);
sunlight.position.set(-5, 0, 20)

// const sunlightHelper = new THREE.SpotLightHelper(sunlight);
// scene.add(sunlightHelper)


const extraLight = new THREE.SpotLight(0xFFFFFF);
scene.add(extraLight);
extraLight.position.set(-5,0,20);

// const extralighthelper = new THREE.SpotLightHelper(extraLight);
// scene.add(extralighthelper)

const textureloader = new THREE.TextureLoader();

const backgroundloader = new THREE.CubeTextureLoader();
scene.background = backgroundloader.load([
    stars,
    stars,
    stars,
    stars,
    stars,
    stars
])


// Creating the earth object
const globeObject = new THREE.SphereGeometry(4, 32, 32);
const globeMaterial = new THREE.MeshStandardMaterial({
    map: textureloader.load(earthImage),
    roughness: 1,
    metalness: 0,
    bumpMap:textureloader.load(earthbumpmap),
    bumpScale: 0.25
});

const globe = new THREE.Mesh(globeObject, globeMaterial);

globe.position.set(0,0,0);
globe.castShadow = true;

scene.add(globe);


// Clouds to surround the earth
const cloudSphere = new THREE.SphereGeometry(4.1, 32, 32);
const cloudMaterial = new THREE.MeshPhongMaterial({
    map: textureloader.load(clouds),
    transparent: true
});

const earthClouds = new THREE.Mesh(cloudSphere, cloudMaterial);
earthClouds.castShadow = true;
scene.add(earthClouds);
earthClouds.position.set(0,0,0);

const sunGeometry = new THREE.SphereGeometry(40, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
    map: textureloader.load(sunMap),
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.castShadow = true;

scene.add(sun);
sun.position.set(0,0, 450)


// Moon inplimentation
const moonObject = new THREE.SphereGeometry(1.25, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({
    map: textureloader.load(moonImage)
});

const moon = new THREE.Mesh(moonObject, moonMaterial);
moon.castShadow = true;

//Making the earth a parent element to the moon
globe.add(moon);

moon.position.set(0,0,-15);


//coordinate point
let coordinateMesh = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.18, 32,32),
    new THREE.MeshBasicMaterial({color:0xff0000})
)

coordinateMesh.position.set(0,0,0)
globe.add(coordinateMesh);






function animate(time){
    globe.rotation.y = time/9000;
    earthClouds.rotation.y = -time/9000;
    moon.rotateY(0.008);
    sun.rotateY(0.002)

    renderer.render(scene, mainCamera);
}

renderer.setAnimationLoop(animate)


window.addEventListener('resize', function(){
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize( width, height );
    mainCamera.aspect = width / height;
    mainCamera.updateProjectionMatrix();
} );


getCalender(now.getMonth(), now.getFullYear())


//this is for the html code functionality

document.addEventListener("DOMContentLoaded", function() {
    const navbarLinks = document.querySelectorAll(".navbar_links");

    navbarLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();

            const targetId = this.getAttribute("href");
            const target = document.querySelector(targetId);
            if (target) {
                const offset = target.offsetTop - 100; // Adjust the offset as needed
                window.scrollTo({
                    top: offset,
                    behavior: "smooth"
                });
            }
        });
    });
});



const name = document.getElementById("nameID");
const expectedArrivalTime = document.getElementById("expectedArrivalID");
const diameter = document.getElementById("EstimatedID");
const estimatedPosition = document.getElementById("positionID");
const previous = document.getElementById("previous");
const total = document.getElementById("total");
const next = document.getElementById("next");
var index = 0;



export function plotCoordinates (coordinate, asteroidAmount, asteroids, asteroidTimes){
    document.querySelector(".results").style.visibility = "visible"
    // document.getElementById("home").click();
    document.querySelector(".canvas").click();

    displayInfo(asteroids[index], asteroidTimes[index][0], asteroidTimes[index][1], coordinate[index], asteroidAmount)
    showLocation(coordinate[index])
    next.addEventListener("click", function(){
        if (index+ 1 < asteroidAmount){
            index++;
            displayInfo(asteroids[index], asteroidTimes[index][0], asteroidTimes[index][1], coordinate[index], asteroidAmount)
            showLocation(coordinate[index])
        }
    })

    previous.addEventListener("click", function(){
        if (index > 0){
            index--
            displayInfo(asteroids[index], asteroidTimes[index][0], asteroidTimes[index][1], coordinate[index], asteroidAmount)
            showLocation(coordinate[index])
        }
    })
    

}


function displayInfo(asteroidName, expectedArrival, estimated_diameter, position, asteroidAmount){
    name.innerHTML = asteroidName;
    expectedArrivalTime.innerHTML =  expectedArrival;
    diameter.innerHTML = estimated_diameter;

    if (position !== undefined){

        estimatedPosition.innerHTML = position[0].toFixed(3)+ "," + position[1].toFixed(3);

    } else {
        estimatedPosition.innerHTML = "undefined";

    }

    total.innerHTML = (index+1) + " / "  + asteroidAmount
}


function showLocation(coordinate){
    if (coordinate !== undefined){
        const lat = (90 - coordinate[0]) * (Math.PI / 180);
        const lng = (180 + coordinate[1]) * (Math.PI / 180);
        let x = -4*Math.sin(lat)*Math.cos(lng);
        let z = 4*Math.sin(lng)*Math.sin(lat);
        let y = 4*Math.cos(lat);

        coordinateMesh.position.set(x,y,z)


    } else {
        coordinateMesh.position.set(0,0,0)
    }
}