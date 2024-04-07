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


/*===popup-open=======================================*/
$(document).on('click','.play-btn a',function(){
  $('.play').addClass('active-pop');
});
/*==popup-Close=======================================*/ 
$(document).on('click','.close-movie',function(){
  $('.play').removeClass('active-pop');
});
/*==auto-play-when-popup-open==========================*/
$('.play-btn a').click(function(){
$('#m-video')[0].play();
}); 
/*==Close-Video-when-popup-close======================*/
$('.close-movie').click(function(){
$('#m-video')[0].pause();
});


let loader = document.querySelector('.pre-loader');

window.addEventListener('load',function(){
  loader.style.display = 'none';
})