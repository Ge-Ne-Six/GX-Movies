const form = document.querySelector('form');
    const emailError = document.querySelector('.error.email');
    const passError = document.querySelector('.error.pass');
    const phoneError = document.querySelector('.error.phone');


    

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

          emailError.textContent = '';
          passError.textContent = '';
          phoneError.textContent = '';

      const email = form.email.value;
      const password = form.password.value;
      const phonenumber = form.phonenumber.value;

     

      // console.log(form);
      try{
        const res = await fetch('/signup',{
          method: 'POST',
          body: JSON.stringify({email, password, phonenumber}),
          headers: {'Content-Type':'application/json'}
        });
        const data = await res.json();
        console.log(data);
        if(data.errors) {
          emailError.textContent = `*${data.errors.email}`;
          passError.textContent = `*${data.errors.password}`;
          phoneError.textContent = `*${data.errors.phonenumber}`;
        }

        if(data.user){
        location.assign('/login');
      }
      }
      catch(err){
        console.log(err);
      }

    
    })