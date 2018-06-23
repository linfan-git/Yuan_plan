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

$('.center-form input:lt(4)').focus(function () {
  var $hint = $(this).next().is('.hint') ?
    $(this).next() : $('<div>').addClass('hint').insertAfter($(this));

  $hint.css('color', '#c9c9c9').text(hintText[this.id].hint);
}).blur(function () {
  validate(this.id);
});

$('#vBtn').click(function () {
  var count = 60;
  var timer = null;
  var self = this;

  timer = setInterval(function () {
    count--;
    if (count > 0) {
      $(self).css('background', 'gray')
        .val(count + '秒后重新获取')
        .attr('disabled', 'true');
    } else {
      $(this).css('background', '#46b036')
        .val('获取验证码')
        .attr('disabled', 'false');
      clearInterval(timer);
    }
  }, 1000);
});

$('#regBtn').click(function () {
  var info = {};
  info['mobile'] = $('#mobile').val();
  info['pwd'] = $('#pwd_2').val();
  info['sms_code'] = $('#v-code').val();
  var infos = JSON.stringify(info);

  $.ajax({
    ContentType: 'application/json',
    type: 'POST',
    url: 'http://www.ftusix.com/static/data/register.php',
    data: infos,
    dataType: 'json',
    success: function (data) {
      if (data.status === 1) {
        window.location.href = 'login.html';
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