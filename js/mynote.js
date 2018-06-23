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

function toDateStr (date) {
  var dat = new Date(date*1000);
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  var d = dat.getDate();
  return y + '/' + m + '/' + d;
}

function show (userID, page) {
  $.ajax({
    contentType: 'application/json',
    type: 'GET',
    url: 'http://www.ftusix.com/static/data/myNote.php',
    data: {
      user_id: userID,
      page: page
    },
    dataType: 'json',
    success: function (data) {
      if (data.status == 1) {
        var pageNum = Math.ceil(parseInt(data['commentList'][0]) / 10);
        pageBtn(page, pageNum);

        $('.table-body').empty();
        var list = data.data;
        $.each(list, function (index, item) {
          var type = parseInt(item['type']);
          switch (type) {
            case 1:
              type = '经验分享';
              break;
            case 2:
              type = '入门学习';
              break;
            case 3:
              type = '成果分享';
              break;
            default:
              type = '其它分享';
          }
          var $tr = $('<tr>').attr('topic-id', item['topic_id']).appendTo($('.table-body'));
          var $td_1 = $('<td>').text(item['title']).appendTo($tr);
          var $td_2 = $('<td>').text(type).appendTo($tr);
          var $td_3 = $('<td>').text(item['comment_num']).appendTo($tr);
          var $td_4 = $('<td>').text(item['browser_num']).appendTo($tr);
          var $td_5 = $('<td>').text(toDateStr(item['modify_time'])).appendTo($tr);
          var $td_6 = $('<td>').html('<button class="edit-btn">编辑</button>' +
            '<button class="del-btn">删除</button>')
            .appendTo($tr);
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
      console.log(textStatus);
    }
  });
}

show(38, 1);//初始化

$('.table-body').delegate('.del-btn', 'click', function () {
  var topicID = $(this).parents('tr').attr('topic-id');

  $('.dialogue').show().click(function (e) {
    var $target = $(e.target);
    if ($target.is('.cancel-btn')) {
      $(this).hide();
    }
    if ($target.is('.confirm-btn')) {
      $(this).hide();

      var obj = {};
      obj["user_id"] = 38;
      obj["topic_id"] = topicID;
      var info = JSON.stringify(obj);

      $.ajax({
        contentType: 'application/json',
        type: 'POST',
        url: 'http://www.ftusix.com/static/data/delete.php',
        data: info,
        dataType: 'json',
        success: function (data) {
          if (data.status === 1) {
            $('.response')
              .removeClass('error')
              .addClass('right')
              .text(data.info)
              .fadeIn().delay(3000).fadeOut();

            var curPage = parseInt($('#page_btn4').text());
            show(38, curPage);
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
      })
    }
  });
});

$('.table-body').delegate('.edit-btn', 'click', function () {
  var topicID = $(this).parents('tr').attr('topic-id');
  window.location.href = '../write.html?user_id=38&topic_id=' + topicID;
});

$('.page_btn').click(function () {
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
  show(38, clickPage);
});