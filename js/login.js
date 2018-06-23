function setCookie (name, value, expires, path, domain, secure) {
  var cookieText = encodeURIComponent(name) + "=" +
    encodeURIComponent(value);
  if (expires instanceof Date) {
    cookieText += "; expires=" + expires.toGMTString();
  }
  if (path) {
    cookieText += "; path=" + path;
  }
  if (domain) {
    cookieText += "; domain=" + domain;
  }
  if (secure) {
    cookieText += "; secure";
  }
  document.cookie = cookieText;
}

var hintText={
  name: {hint:"请输入昵称，至少3个字符，至多20个字符",right:"昵称格式正确",wrong:"昵称格式有误",isPassed:false},
  pwd_1: {hint:"请输入密码，字母和数字相结合，至少6位密码",right:"密码可用",wrong:"密码不可用",isPassed:false},
  pwd_2: {hint:"请再次输入密码",right:"密码输入一致",wrong:"密码输入不一致",isPassed:false},
  mobile: {hint:"请输入手机号码",right:"手机格式正确",wrong:"手机格式错误",isPassed:false}
};

function validate (id) {
  var $ele = $('#' + id);
  var $value = $ele.val();
  var flag = false;
  switch (id) {
    case 'mobile':
      flag = /^[1][0-9]{10}$/.test($value);
      break;
    case 'pwd_1':
      flag = /^[a-zA-Z0-9]{6,16}$/.test($value);
      break;
    case 'pwd_2':
      flag = $('#pwd_1').val() === $value;
      break;
    case 'name':
      flag = /^[a-zA-Z0=9\u4e00-\u9fa5]{3,20}$/.test($value);
      break;
    default:
      return;
  }
  if (flag) {
    $ele.css('border-color', 'lightgreen')
      .next('.hint').css('color', 'lightgreen')
      .text(hintText[id].right);
  } else {
    $ele.css('border-color', 'red')
      .next('.hint').css('color', 'red')
      .text(hintText[id].wrong);
  }
}

$('.center-form input').focus(function () {
  var $hint = $(this).next().is('.hint') ?
    $(this).next() : $('<div>').addClass('hint').insertAfter($(this));

  $hint.css('color', '#c9c9c9').text(hintText[this.id].hint);
}).blur(function () {
  validate(this.id);
});


$('#loginBtn').click(function () {
  var obj = {};
  obj["mobile"] = $("#mobile").val();
  obj["pwd"] = $("#pwd_1").val();
  var jsons = JSON.stringify(obj);

  $.ajax({
    contentType: 'application/json',
    type: 'POST',
    url: 'http://www.ftusix.com/static/data/login.php',
    data: jsons,
    dataType: 'json',
    success: function (data) {
      if (data.status === 1) {
        if ($('#autoLog').is(':checked')) {
          var exDate = new Date();
          exDate.setDate(exDate.getDate() + 7);
          setCookie('mobile', data.data[0].mobile, exDate, false, '.ftusix.com');
          setCookie('nick_name',data.data[0].nick_name, exDate, false, '.ftusix.com');
          setCookie('sex',data.data[0].sex, exDate, false, '.ftusix.com');
          setCookie('token',data.data[0].token, exDate, false, '.ftusix.com');
          setCookie('user_id',data.data[0].user_id, exDate, false, '.ftusix.com');

          localStorage.setItem('token', data.data[0].token);
        }
        window.location.href = 'index.html';
      } else {
        $('.response')
          .removeClass('right')
          .addClass('error')
          .text(data.info)
          .fadeIn().delay(3000).fadeOut();
      }
    },
    error: function(XMLHttpRequest,textStatus){
      console.log(textStatus);
    }
  });
});
