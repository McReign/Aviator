Enemy = function(){
    var geom = new THREE.TetrahedronGeometry(8,2);
    var mat = new THREE.MeshPhongMaterial({
        color:Colors.red,
        shininess:0,
        specular:0xffffff,
        flatShading:THREE.FlatShading
    });
    this.mesh = new THREE.Mesh(geom,mat);
    this.mesh.castShadow = true;
    this.angle = 0;
    this.dist = 0;
}

window.Enemy = Enemy