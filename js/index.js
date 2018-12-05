var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
};

var enemiesPool = [];
var coinsPool = [];

var game = {
	distance:0,
	energy:100,
	level:1,
	status : "waitingReplay",
};

function showReplay(){
	replayMessage.style.display="block";
}
  
function hideReplay(){
	replayMessage.style.display="none";
}

function updateDistance(){
	// game.distance += game.speed*deltaTime*game.ratioSpeedDistance;
	game.distance += 1;
	fieldDistance.innerHTML = Math.floor(game.distance);
	var d = 502*((game.distance-1000*game.level)/1000);
	levelCircle.setAttribute("stroke-dashoffset", d);
}
  
function updateEnergy(){
	// game.energy -= game.speed*deltaTime*game.ratioSpeedEnergy;
	game.energy -= .1*game.level*.5;
	game.energy = Math.max(0, game.energy);

	if (game.energy > 100) game.energy = 100

	energyBar.style.right = (100-game.energy)+"%";
	energyBar.style.backgroundColor = (game.energy<50)? "#f25346" : "#68c3c0";
  
	if (game.energy <1){
	  	game.status = "gameover";
	}
}

window.addEventListener('load', init, false);

var fieldDistance, energyBar, replayMessage, fieldLevel, levelCircle;

function init() {
	fieldDistance = document.getElementById("distValue");
	energyBar = document.getElementById("energyBar");
	replayMessage = document.getElementById("replayMessage");
	fieldLevel = document.getElementById("levelValue");
	levelCircle = document.getElementById("levelCircleStroke");
	
	// создаем сцену
	createScene();

	// добавляем освещение
	createLights();

	// добавляем объекты
	createSea();
	createSky();
	createEnemies();
	createCoins();

	document.addEventListener('mousemove', handleMouseMove, false);
	document.addEventListener('click', start, false);

	// начинаем цикл который будет изменять положение 
	// объектов и перерисовывать сцену
	loop();
}

function start() {
	if (game.status == "waitingReplay"){
		game = {
			distance:0,
			energy:100,
			level:1,
			status : "playing",
		};

		hideReplay();
		createPlane();
	}
}

function loop(){
	if (game.status=="playing") {
		if (Math.floor(game.distance)%50 == 0){
			enemiesHolder.spawnEnemies();
		}
		if (Math.floor(game.distance)%100 == 0){
			coinsHolder.spawnCoins();
		}
		if (Math.floor(game.distance) >= 1000*game.level){
			game.level++;
			fieldLevel.innerHTML = Math.floor(game.level);
		}

		updatePlane();
		updateDistance();
		updateEnergy();
	}
	else if(game.status=="gameover"){
		airplane.mesh.rotation.z += (-Math.PI/2 - airplane.mesh.rotation.z)*.015;
		airplane.mesh.rotation.x += 0.02;
		airplane.mesh.position.y -= 3;
	
		if (airplane.mesh.position.y <-200){
			showReplay();
			game.status = "waitingReplay";
		}
	}
	else if (game.status=="waitingReplay"){

	}

	sea.mesh.rotation.z += .005;
	sky.mesh.rotation.z += .01;
	enemiesHolder.rotateEnemies();
	coinsHolder.rotateCoins();
	renderer.render(scene, camera);
	requestAnimationFrame(loop);
}

var scene,
		camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
		renderer, container;

function createScene() {
	// Получаем высоту и ширину сцены,
	// используем их чтобы задать соотношение камеры
	// и размер перерисовки.
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;

	// Создаем сцену
	scene = new THREE.Scene();
	
	scene.fog = new THREE.Fog(0xf7d9aa, 100,950);

	// Создаем камеру
	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
	);
	
	// Задаем позицию камеры
	camera.position.x = 0;
	camera.position.z = 200;
	camera.position.y = 100;
	
	// Создаем перерисовку
	renderer = new THREE.WebGLRenderer({ 
		alpha: true,
		antialias: true 
	});

	// Задаем размер перерисовки
	renderer.setSize(WIDTH, HEIGHT);
	
	// Задаем перерисовку теней
	renderer.shadowMap.enabled = true;
	
	// Добавляем DOM элемент перерисовки в
	// в наш корневой элемент
	container = document.getElementById('world');
	container.appendChild(renderer.domElement);
	
	// Обновляем данные при изменении размеров окна приложения
	window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

var mousePos={x:0, y:0};

function handleMouseMove(event) {

	var tx = -1 + (event.clientX / WIDTH)*2;
	var ty = 1 - (event.clientY / HEIGHT)*2;
	mousePos = {x:tx, y:ty};

}

function updatePlane(){

	var targetY = normalize(mousePos.y,-.75,.75,25, 150);
	var targetX = normalize(mousePos.x,-.75,.75,-100, 100);
	
	airplane.mesh.position.y += (targetY-airplane.mesh.position.y)*0.1;

	airplane.mesh.rotation.z = (targetY-airplane.mesh.position.y)*0.0128;
	airplane.mesh.rotation.x = (airplane.mesh.position.y-targetY)*0.0064;

	airplane.propeller.rotation.x += 0.3;
}

function normalize(v,vmin,vmax,tmin, tmax){

	var nv = Math.max(Math.min(v,vmax), vmin);
	var dv = vmax-vmin;
	var pc = (nv-vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;

}

var hemisphereLight, shadowLight;

function createLights() {
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, 0.9)
	
	shadowLight = new THREE.DirectionalLight(0xffffff, .9);

	// Задаем направление освещения  
	shadowLight.position.set(150, 350, 350);
	
	shadowLight.castShadow = true;

	// Задаем видимую область для теней
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;
	
	// Добавляем освещение в сцену
	scene.add(hemisphereLight);  
	scene.add(shadowLight);
}

function createSea(){
	sea = new Sea();

	// Задаем расположение моря
	sea.mesh.position.y = -600;

	// Добавляем море в сцену
	scene.add(sea.mesh);
}

var sky;

function createSky(){
	sky = new Sky();
	sky.mesh.position.y = -600;
	scene.add(sky.mesh);
}

var airplane;

function createPlane(){ 
	airplane = new AirPlane();
	airplane.mesh.scale.set(.25,.25,.25);
	airplane.mesh.position.y = 100;
	scene.add(airplane.mesh);
}

function createEnemies(){
	for (var i=0; i<10; i++){
		var enemy = new Enemy();
		enemiesPool.push(enemy);
	}
	enemiesHolder = new EnemiesHolder();
	scene.add(enemiesHolder.mesh)
}

function createCoins(){
	for (var i=0; i<20; i++){
		var coin = new Coin();
		coinsPool.push(coin);
	}
	coinsHolder = new CoinsHolder();
	scene.add(coinsHolder.mesh)
}