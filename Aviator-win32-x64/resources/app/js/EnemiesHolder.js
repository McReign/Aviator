EnemiesHolder = function (){
    this.mesh = new THREE.Object3D();
    this.enemiesInUse = [];
}
  
EnemiesHolder.prototype.spawnEnemies = function(){
    var nEnnemies = game.level;
  
    for (var i=0; i<nEnnemies; i++){
        var enemy;
        if (enemiesPool.length) {
            enemy = enemiesPool.pop();
        }else{
            enemy = new Enemy();
        }
    
        enemy.angle = - (i*0.1);
        enemy.distance = 700 + (-1 + Math.random() * 2) * 60;
        enemy.mesh.position.y = -600 + Math.sin(enemy.angle)*enemy.distance;
        enemy.mesh.position.x = Math.cos(enemy.angle)*enemy.distance;
    
        this.mesh.add(enemy.mesh);
        this.enemiesInUse.push(enemy);
    }
}
  
EnemiesHolder.prototype.rotateEnemies = function(){
    for (var i=0; i<this.enemiesInUse.length; i++){
      var enemy = this.enemiesInUse[i];
      enemy.angle += 0.003*2*0.6;
  
      if (enemy.angle > Math.PI*2) enemy.angle -= Math.PI*2;
  
      enemy.mesh.position.y = -600 + Math.sin(enemy.angle)*enemy.distance;
      enemy.mesh.position.x = Math.cos(enemy.angle)*enemy.distance;
      enemy.mesh.rotation.z += Math.random()*.1;
      enemy.mesh.rotation.y += Math.random()*.1;
  
      var diffPos = airplane.mesh.position.clone().sub(enemy.mesh.position.clone());
      var d = diffPos.length();
      if (d<10){
        enemiesPool.unshift(this.enemiesInUse.splice(i,1)[0]);
        this.mesh.remove(enemy.mesh);
        game.energy -= 10;
        i--;
      }else if (enemy.angle > Math.PI){
        enemiesPool.unshift(this.enemiesInUse.splice(i,1)[0]);
        this.mesh.remove(enemy.mesh);
        i--;
      }
    }
}

window.EnemiesHolder = EnemiesHolder