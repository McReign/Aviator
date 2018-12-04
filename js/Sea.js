let Sea = function () {
	
	// Создаем форму цилиндра
	var geom = new THREE.CylinderGeometry(600,600,800,50,10);
	
	// Поворачиваем форму по оси X
	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
	
	// Создаем материал
	var mat = new THREE.MeshPhongMaterial({
		color: Colors.blue,
		transparent: true,
		opacity: 1,
		flatShading: THREE.FlatShading,
	});

	// Создаем сетку
	this.mesh = new THREE.Mesh(geom, mat);

	this.mesh.receiveShadow = true; 
}

window.Sea = Sea