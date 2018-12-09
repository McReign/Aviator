CoinsHolder = function (){
    this.mesh = new THREE.Object3D();
    this.coinsInUse = [];
}
  
  CoinsHolder.prototype.spawnCoins = function(){
    var nCoins = 1 + Math.floor(Math.random()*10);
    var d = 700 + (-1 + Math.random() * 2) * 60;
    var amplitude = 10 + Math.round(Math.random()*10);
    for (var i=0; i<nCoins; i++){
      var coin;
      if (coinsPool.length) {
            coin = coinsPool.pop();
      }else{
            coin = new Coin();
      }

      coin.angle = - (i*0.02);
      coin.distance = d + Math.cos(i*.5)*amplitude;
      coin.mesh.position.y = -600 + Math.sin(coin.angle)*coin.distance;
      coin.mesh.position.x = Math.cos(coin.angle)*coin.distance;

      this.mesh.add(coin.mesh);
      this.coinsInUse.push(coin)
    }
  }
  
  CoinsHolder.prototype.rotateCoins = function(){
    for (var i=0; i<this.coinsInUse.length; i++){
      var coin = this.coinsInUse[i];
      coin.angle += 0.003*2*0.6;

      if (coin.angle>Math.PI*2) coin.angle -= Math.PI*2;
      coin.mesh.position.y = -600 + Math.sin(coin.angle)*coin.distance;
      coin.mesh.position.x = Math.cos(coin.angle)*coin.distance;
      coin.mesh.rotation.z += Math.random()*.1;
      coin.mesh.rotation.y += Math.random()*.1;
  
      var diffPos = airplane.mesh.position.clone().sub(coin.mesh.position.clone());
      var d = diffPos.length();
      if (d<15){
        coinsPool.unshift(this.coinsInUse.splice(i,1)[0]);
        this.mesh.remove(coin.mesh);
        game.energy += 4;
        i--;
      }else if (coin.angle > Math.PI){
        coinsPool.unshift(this.coinsInUse.splice(i,1)[0]);
        this.mesh.remove(coin.mesh);
        i--;
      }
    }
  }

  window.CoinsHolder = CoinsHolder