sizeTextArea = (textarea) ->
  hard_lines = soft_lines = lines = tmp_char_cnt = 0
  str = textarea.val()
  fs = parseInt(textarea.css('font-size').replace('px',''))
  lh = parseInt(textarea.css('line-height').replace('px',''))

  tmp_s = ''
  lines = str.split("\n")
  hard_lines = lines.length

  for line in lines
    tmp_s = line.split('')
    tmp_char_cnt = (tmp_s.length*6)/textarea.width()
    soft_lines += tmp_char_cnt if tmp_char_cnt > 1 
		
  lines = hard_lines+soft_lines+1
  (lines*lh)+'px' 


$ ->
  keys_down={};
  $composetext = $("#composetext");
  $composebutton = $("#composebutton");  
  
  $composetext.bind("keyup", -> $composetext.css('height', sizeTextArea($composetext)))

  doStuff = ()->
    if keys_down[13] and keys_down[91] 
      $composebutton.click();
      $composetext.focus();
      keys_down[13] = false;
  
  $composetext.bind("keydown", (event)->
    keys_down[event.keyCode] = true
    doStuff()
  )
  
  $composetext.bind("keyup", (event)->
    keys_down[event.keyCode] = false;
  )

  $(window).focus(-> window.hasFocus = true)
  $(window).blur(-> window.hasFocus = false)