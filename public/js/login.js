

let forgottenPass = document.querySelector('.forgotten-pass');
const form = document.querySelector('form');
const emailError = document.querySelector('.error.email');
const passError = document.querySelector('.error.pass');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

      emailError.textContent = '';
      passError.textContent = '';

  const email = form.email.value;
  const password = form.password.value;

  try{
    const res = await fetch('/login',{
      method: 'POST',
      body: JSON.stringify({email, password}),
      headers: {'Content-Type':'application/json'}
    });
    const data = await res.json();
    console.log(data);
    if(data.errors) {
      emailError.textContent = `${data.errors.email}`;
      passError.textContent = `${data.errors.password}`;
    }

    if(data.user){
    location.assign('/genesix');
  }
  }
  catch(err){
    console.log(err);
  }

  
});


forgottenPass.addEventListener('click', async function(e){

  document.querySelector('.message-wrapper').style.display = 'block';
  document.querySelector('.message').innerHTML = 'Loading....';

  let email = document.querySelector('.input.email').value;
  const regex = /^[a-zA-Z0-9. _-]+@[a-zA-Z0-9. -]+\.[a-zA-Z]{2,4}$/;
  if(email === ''){
    emailError.innerHTML = '*Enter your email to reset password!';
  }
  else if(!regex.test(email)){
    emailError.innerHTML = '*Enter a valid email!';
  }
  else{

    try{

          let res = await fetch('/recoverPassword',{
          method: 'POST',
          body: JSON.stringify({email}),
          headers: {'Content-Type':'application/json'}
        })

        let message = await res.json();

        if(message.otp){
          document.querySelector('.message').innerHTML = message.otp;

          function redirect(){
            location.assign('/recoverPassword');
          }

          setTimeout(redirect, 5000);

        }

    }
    catch(err){
      console.log(err.message);
    }
    

  }

})
