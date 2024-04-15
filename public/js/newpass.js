let form = document.querySelector('form');
    
    
form.addEventListener('submit', async function(e){
  e.preventDefault();

  let password = form.password.value;
  let confirmPassword = form.confirmpassword.value;

  if(password === confirmPassword){
    
    try
    {

      let res = await fetch('/newpassword', {
        method: 'POST',
        body: JSON.stringify({password}),
        headers: {'Content-Type': 'application/json'}
      })

      let message = res.json()

      if(message.message === 'Password Succesfully Changed'){
        location.assign('/login');
      }
      if(message.err){
        if(message.err === 'otp is not valid'){

          document.querySelector('.new-err').innerHTML = 'otp is expired request for a new one';

        }
      }

    }
    catch(err){
      console.log(err.message);
    }

  }else{
    console.log('The two password does not match');
    document.querySelector('.new-err').innerHTML = 'The two password does not match';
  }
  
  

})