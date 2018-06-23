$(function () {
  $('.catalogue .title').click(function () {
    $(this).next().slideToggle();
    $(this).find('.arrow').toggleClass('rotate');
  })
});

$('.header-nav .nav-item:first').click(function (e) {
  if (!localStorage.token) {
    e.preventDefault();
    window.location.href = 'login.html';
  }
});

$('.mycenter-nav li:last').click(function () {
  localStorage.removeItem('token');
})