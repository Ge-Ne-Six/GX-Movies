let passImage = document.querySelector('.passImage');
let pass = document.querySelector('.pass');

function iconChange() {

  if(pass.type == "password"){
    passImage.src = '/images/eye.png'
    pass.type = 'text'
  }
  else{
    passImage.src = '/images/visible (1).png'
    pass.type = 'password';
  }
   
}


