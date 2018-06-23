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
