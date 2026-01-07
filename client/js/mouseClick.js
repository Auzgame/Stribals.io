class mouseClick{
  constructor(){
    this.click = {
      left: false,
      right: false
    };
  }
  mouseLoader(){
    function mouseDown(e){
      //console.log(e.key);
      switch(e.which){
        case 1:
          this.click.left = true;
          //console.log('W Pressed');
          break;
        case 3:
          this.click.right = true;
          //console.log('A Pressed');
          break;
      }
    }
    function mouseUp(e){
      switch(e.which){
        case 1:
          this.click.left = false;
          break;
        case 3:
          this.click.right = false;
          break
      }
      //console.log(this.keys);
    }
    document.addEventListener('mousedown', mouseDown.bind(this));
    document.addEventListener('mouseup', mouseUp.bind(this));
  }
}