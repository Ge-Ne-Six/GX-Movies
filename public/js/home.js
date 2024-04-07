 /*==progress-bar====================*/
 let scrollPrecentage = () =>{
  let scrollProgress = document.getElementById('progress');
  let progressValue = document.getElementById('progress-value');
  let pos = document.documentElement.scrollTop;
  let calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  let scrollValue = Math.round(pos * 100 /  calcHeight);
  scrollProgress.style.background = `conic-gradient(#e70634 ${scrollValue}%,#2b2f38 ${scrollValue}%)`;
}
window.onscroll = scrollPrecentage;
window.onload = scrollPrecentage;


 

/*Initialize Swiper*/ 
var swiper = new Swiper(".mySwiper", {
slidesPerView: 0,
spaceBetween: 10,
pagination: {
  el: ".swiper-pagination",
  clickable: true,
},
autoplay:{
  delay: 5000,
  disableOnInteraction: false,
},
navigation: {
  nextEl: ".swiper-button-next",
  prevEl: ".swiper-button-prev",
},
breakpoints: {
  640: {
    slidesPerView: 2,
    spaceBetween: 20,
  },
  768: {
    slidesPerView: 2,
    spaceBetween: 40,
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 50,
  },
},
});


/*--menu-btn-fixed-when-scrol========*/
$(window).scroll(function(){
  if($(document).scrollTop() > 10){
      $('.dropdown').addClass('fixdropbtn');
      $('.navigation').addClass('fix-icon');
  }
  else {
      $('.navigation').removeClass('fix-icon');
      $('.dropdown').removeClass('fixdropbtn');
  }
}); 

let loader = document.querySelector('.pre-loader');

window.addEventListener('load',function(){
  loader.style.display = 'none';
});


