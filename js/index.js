function Slider (id) {
  this.$container = $('#' + id);
  this.$picBox = this.$container.find('.pic-box');
  this.$btns = this.$container.find('.btn-bar span');
  this.index = 1;
  this.WIDTH = 1280;
  this.timer = null;
  this.init();
}

Slider.prototype = {
  animate: function (offset) {
    var $newLeft = parseInt(this.$picBox.css('left')) + offset;
    if ($newLeft > 0) {
      $newLeft = -this.WIDTH * 2;
    }
    if ($newLeft < (-this.WIDTH * 2)) {
      $newLeft = 0;
    }
    this.$picBox.css('left', $newLeft + 'px');
  },

  play: function () {
    this.timer = setInterval(function () {
      $('#next').click();
    }, 3000);
  },

  stop: function () {
    clearInterval(this.timer);
  },

  buttonShow: function (index) {
    $(this.$btns[index-1]).addClass('on').siblings().removeClass('on');
  },

  init: function () {
    var self = this;

    $('#prev').click(function () {
      self.index--;
      if (self.index < 1) {
        self.index = 3;
      }
      self.buttonShow(self.index);
      self.animate(self.WIDTH);
    });

    $('#next').click(function () {
      self.index++;
      if (self.index > 3) {
        self.index = 1;
      }
      self.buttonShow(self.index);
      self.animate(-self.WIDTH);
    });

    this.$container.mouseover(function () {
      self.stop();
    }).mouseout(function () {
      self.play();
    });

    this.$btns.click(function () {
      var clickIndex = parseInt($(this).attr('index'));
      var offset = (self.index - clickIndex) * self.WIDTH;
      self.buttonShow(clickIndex);
      self.animate(offset);
      self.index = clickIndex;
    });

    this.play();
  }
};

//初始化轮播图
var slider = new Slider('banner_1');

function pageBtn (curPage, pageNum) {
  var currentPage=Number(curPage);
  var pageNum=Number(pageNum);

  $('.page_btn').show();
  $('.pages_span').show();

  $("#page_btn2").text(currentPage-2);
  $("#page_btn3").text(currentPage-1);
  $("#page_btn4").text(currentPage);
  $("#page_btn5").text(currentPage+1);
  $("#page_btn6").text(currentPage+2);
  $("#page_btn7").text(pageNum);

  $("#page_btn4").css("background-color","#4f90fb");
  $("#page_btn4").css("border","1px solid #ddd");
  $("#page_btn4").css("color","#fff");

  if(currentPage==1)
  {
    $("#prePage").hide();
  }

  if(currentPage==pageNum)
  {
    $("#sufPage").hide();
  }

  if(currentPage<=3){
    $("#prePoint").hide();
    $("#page_btn1").hide();
  }
  else if(currentPage==4){
    $("#prePoint").hide();
  }

  if(currentPage==1)
  {
    $("#page_btn2").hide();
    $("#page_btn3").hide();
  }
  else if(currentPage==2)
  {
    $("#page_btn2").hide();
  }

  if(currentPage>=pageNum-2){
    $("#sufPoint").hide();
    $("#page_btn7").hide();
  }
  else if(currentPage==pageNum-3){
    $("#sufPoint").hide();
  }

  if(currentPage==pageNum)
  {
    $("#page_btn5").hide();
    $("#page_btn6").hide();
  }

  if(currentPage==pageNum-1)
  {
    $("#page_btn6").hide();
  }
}

function timeago(dateTimeStamp){
  var minute = 1000*60;
  var hour = minute*60;
  var day = hour*24;
  var week = day*7;
  var halfamonth = day*15;
  var month = day*30;
  var result;

  var  now=new Date().getTime();
  var diffValue=now - parseInt(dateTimeStamp)*1000;

  if (diffValue < 0) {return;}

  var  minC=diffValue / minute;
  var  hourC=diffValue / hour;
  var  dayC=diffValue / day;
  var  weekC=diffValue / week;
  var  monthC=diffValue / month;

  if(monthC >= 1){
    result = "" + parseInt(monthC) + "月前";
  }
  else if(weekC >= 1){
    result = "" + parseInt(weekC) + "周前";
  }
  else if(dayC >= 1){
    result = ""+ parseInt(dayC) + "天前";
  }
  else if(hourC>=1){
    result = ""+ parseInt(hourC) + "小时前";
  }
  else if(minC>=1){
    result = "" + parseInt(minC) + "分钟前";
  }else {
    result= "刚刚";
  }
  return result;
}

function show (type, sort, index, page) {
  var typeCode = 0;
  switch (type) {
    case 'html':
      typeCode = 1;
      break;
    case 'php':
      typeCode = 2;
      break;
    case 'java':
      typeCode = 3;
      break;
    default:
      typeCode = 0;
  }
  $.ajax({
    contentType: 'application/json',
    type: 'GET',
    url: 'http://www.ftusix.com/static/data/topicList.php',
    data: {
      type: typeCode,
      sort: sort,
      index: index,
      page: page
    },
    dataType: 'json',
    success: function (data) {
      if (data.status === 1) {
        var pageNum = Math.ceil(parseInt(data['listCount'][0]) / 10);
        pageBtn(page, pageNum);

        $('.post-wrapper').empty();
        var list = data.data;
        $.each(list, function (index, item) {
          var $artical = $('<div>')
            .addClass('artical-post')
            .attr('topic-id', item['topic_id'])
            .appendTo($('.post-wrapper'));
          var $author = $('<div>')
            .addClass('artical-author')
            .text(item['nick_name'] + ' · ' + timeago(item['modify_time']))
            .appendTo($artical);
          var $titleWrapper = $('<div>')
            .addClass('artical-title clearfix')
            .appendTo($artical);
          var $title = $('<span>')
            .addClass('title')
            .text(item['title'])
            .appendTo($titleWrapper);
          var $info = $('<div>')
            .addClass('handle-info')
            .html('<a href="#" class="comment-icon"></a>'
                  + item['comment_num']
                  + '<a href="#" class="like-icon"></a>'
                  + item['like_num'])
            .appendTo($titleWrapper);
        });
      } else {
        $('.response')
          .removeClass('right')
          .addClass('error')
          .text(data.info)
          .fadeIn().delay(3000).fadeOut();
      }
    },
    error: function(XMLHttpRequest,textStatus){
      $('.response')
        .removeClass('right')
        .addClass('error')
        .text('错误代码：' + XMLHttpRequest.status)
        .fadeIn().delay(3000).fadeOut();
    }
  });
}

show(0, 'new', true, 1);//初始化

$('.artical-nav a').click(function (e) {
  e.preventDefault();
  $(this).toggleClass('active').siblings().removeClass('active');
  var type = $(this).text() ;
  show(type, 'new', true, 1);
});

$('.post-wrapper').delegate('.like-icon', 'click', function (e) {
  e.preventDefault();

  var obj = {};
  obj["user_id"] = 38;
  obj["topic_id"] = $(this).parents('.artical-post').attr('topic-id');
  obj["type"] = "zan";
  var info = JSON.stringify(obj);

  $.ajax({
    contentType: 'application/json',
    type: 'POST',
    url: 'http://www.ftusix.com/static/data/zan.php',
    data: info,
    dataType: 'json',
    success: function (data) {
      if (data.status === 1) {
        var type = $('.artical-nav .active').text();
        var curPage = parseInt($('#page_btn4').text());
        show(type, 'new', true, curPage);
      } else {
        $('.response')
          .removeClass('right')
          .addClass('error')
          .text(data.info)
          .fadeIn().delay(3000).fadeOut();
      }
    }
  });
});

$('.page_btn').click(function () {
  var type = $('.artical-nav .active').text();
  var curPage = parseInt($('#page_btn4').text());
  var pageNum = parseInt($('#page_btn7').text());
  var clickPage;
  if ($(this).is('#prePage')) {
    clickPage = curPage - 1;
  } else if ($(this).is('#sufPage')) {
    clickPage = curPage + 1;
  } else {
    clickPage = parseInt($(this).text());
  }
  show(type, 'new', true, clickPage);
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




