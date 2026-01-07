class keyboardHandler {
  constructor(){
    this.keys = {
      w: false,
      a: false,
      d: false,
      s: false,
      r: false
    }
  }
  keyLoader(){
    function keyPressHandler(e){
      //console.log(e.key);
      switch(e.key){
        case 'w':
          this.keys.w = true;
          //console.log('W Pressed');
          break;
        case 'a':
          this.keys.a = true;
          //console.log('A Pressed');
          break;
        case 'd':
          this.keys.d = true;
          //console.log('D Pressed')
          break;
        case 's':
          this.keys.s = true;
          //console.log('S Pressed')
          break;
        case 'r':
          this.keys.r = true;
          break;
      }
    }
    function keyUpHandler(e){
      switch(e.key){
        case 'w':
          this.keys.w = false;
          break;
        case 'a':
          this.keys.a = false;
          break
        case 'd':
          this.keys.d = false;
          break;
        case 's':
          this.keys.s = false;
          break;
        case 'r':
          this.keys.r = false;
          break;
      }
      //console.log(this.keys);
    }
    document.addEventListener('keypress', keyPressHandler.bind(this));
    document.addEventListener('keyup', keyUpHandler.bind(this));
  }
}