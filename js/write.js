function getPara(url){
  if(url.indexOf("?")>-1){
    var obj = {};
    var paraStr = url.split("?")[1];
    var paraItems = paraStr.split("&");
    for(var i=0; i<paraItems.length; i++){
      var paraKey = paraItems[i].split("=")[0];
      var paraValue = paraItems[i].split("=")[1];
      obj[paraKey] = paraValue;
    }
  }
  return obj;
}

$(function () {
  var url = window.location.href;
  var info = getPara(url);

  if (url.indexOf("?")>-1) {
    $.ajax({
      contentType: 'application/json',
      type: 'GET',
      url: 'http://www.ftusix.com/static/data/content.php',
      data: info,
      dataType: 'json',
      success: function (data) {
        if (data.status === 1) {
          $('#title').val(data.data['title']);
          $('textarea').html(data.data['content']);
          $('#type option').eq(parseInt(data.data['type'])).attr('selected', true);
          $('#techType option').eq(parseInt(data.data['tech_type'])-1).attr('selected', true);
        }
      }
    });
  }
})

var editor = new Vue({
  el: '#editor',
  data: {
    input: '# hello'
  },
  computed: {
    compiledMarkdown: function () {
      return marked(this.input, { sanitize: true })
    }
  },
  methods: {
    update: _.debounce(function (e) {
      this.input = e.target.value
    }, 300)
  }
});

$('.issue-button').click(function () {
  var url = window.location.href;
  var obj = {};
  obj["content"] = $('#preview').html();
  obj["md_content"] = $('#preview').text();
  obj["user_id"] = 38;
  obj["nickname"] = "1232332";
  obj["type"] = $('#type').val();
  obj["tech_type"] = $('#techType').val();
  obj["title"] = $('#title').val();
  obj["isEdit"] = (url.indexOf("?")>-1);
  obj["topic_id"] = obj["isEdit"] ? getPara(url)['topic_id'] : 0;
  var info = JSON.stringify(obj);

  $.ajax({
    contentType: 'application/json',
    type: 'POST',
    url: 'http://www.ftusix.com/static/data/writeArticle.php',
    data: info,
    dataType: 'json',
    success: function (data) {
      if (data.status === 1) {
        window.location.href = obj['isEdit'] ? 'user/mynote.html' : 'article.html';
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

$('.header-nav .nav-item:first').click(function (e) {
  if (!localStorage.token) {
    e.preventDefault();
    window.location.href = 'login.html';
  }
});

$('.mycenter-nav li:last').click(function () {
  localStorage.removeItem('token');
})