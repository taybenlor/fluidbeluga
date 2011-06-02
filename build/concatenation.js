(function() {
  var sizeTextArea;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  sizeTextArea = function(textarea) {
    var fs, hard_lines, lh, line, lines, soft_lines, str, tmp_char_cnt, tmp_s, _i, _len;
    hard_lines = soft_lines = lines = tmp_char_cnt = 0;
    str = textarea.val();
    fs = parseInt(textarea.css('font-size').replace('px', ''));
    lh = parseInt(textarea.css('line-height').replace('px', ''));
    tmp_s = '';
    lines = str.split("\n");
    hard_lines = lines.length;
    for (_i = 0, _len = lines.length; _i < _len; _i++) {
      line = lines[_i];
      tmp_s = line.split('');
      tmp_char_cnt = (tmp_s.length * 6) / textarea.width();
      if (tmp_char_cnt > 1) {
        soft_lines += tmp_char_cnt;
      }
    }
    lines = hard_lines + soft_lines + 1;
    return (lines * lh) + 'px';
  };
  $(function() {
    var $compose, $composebutton, $composetext, $header, $updates, $window, doStuff, keys_down, resize;
    keys_down = {};
    $composetext = $("#composetext");
    $composebutton = $("#composebutton");
    $updates = $("#updates");
    $header = $(".pod-header");
    $compose = $("#compose");
    $window = $(window);
    $composetext.bind("keyup", function() {
      return $composetext.css('height', sizeTextArea($composetext));
    });
    doStuff = function() {
      if (keys_down[13] && keys_down[91]) {
        $composebutton.click();
        $composetext.focus();
        return keys_down[13] = false;
      }
    };
    $composetext.bind("keydown", function(event) {
      keys_down[event.keyCode] = true;
      return doStuff();
    });
    $composetext.bind("keyup", function(event) {
      return keys_down[event.keyCode] = false;
    });
    $window.focus(function() {
      return window.hasFocus = true;
    });
    $window.blur(function() {
      return window.hasFocus = false;
    });
    resize = function() {
      return $updates.height($window.height() - ($compose.height() + $header.height() + 16));
    };
    $window.resize(resize);
    $header.resize(resize);
    $compose.resize(resize);
    $compose.click(resize);
    return resize();
  });
  window.Notifier = (function() {
    function Notifier() {
      this.clearCount = __bind(this.clearCount, this);;      this.count = 0;
      $(window).focus(this.clearCount);
      this.last = {
        text: ""
      };
    }
    Notifier.prototype.newMessage = function(data) {
      if (!window.hasFocus && this.last.text !== data.text) {
        this.last = new Notification(data.uid, "" + data.first + " " + data.last, data.text);
        this.count += 1;
        return window.fluid.dockBadge = "" + this.count;
      }
    };
    Notifier.prototype.clearCount = function() {
      this.count = 0;
      return window.fluid.dockBadge = "";
    };
    return Notifier;
  })();
  window.Notification = (function() {
    function Notification(uid, name, text) {
      this.uid = uid;
      this.name = name;
      this.text = text;
      this.focusWindow = __bind(this.focusWindow, this);;
      this.user = p_users["u" + this.uid];
      this.avatar = "http://belugapods.com/userimg/100/" + this.uid + "/" + this.user.ihash;
      window.fluid.showGrowlNotification({
        title: "" + this.name + " said",
        description: this.text,
        icon: this.avatar,
        onclick: this.focusWindow
      });
    }
    Notification.prototype.focusWindow = function() {
      return window.fluid.activate();
    };
    return Notification;
  })();
  window.notifier = new Notifier();
}).call(this);
