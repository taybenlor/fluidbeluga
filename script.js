function sizeTextArea(textarea){ 
	var hard_lines = 0;
	var soft_lines = 0;
	var lines = 0;
	var str = textarea.val();
	var w = textarea.width();
	var fs = parseInt(textarea.css('font-size').replace('px',''));
	var lh = parseInt(textarea.css('line-height').replace('px',''));
	var tmp_char_cnt = 0;
	var tmp_s = '';
	var sarr = str.split("\n");
	hard_lines = sarr.length;
	if(sarr.length>0){
		for(i=0;i<sarr.length;i++) {
			tmp_s = sarr[i].split('');
			tmp_char_cnt = (tmp_s.length*6)/w;
			if(tmp_char_cnt > 1){
				soft_lines += tmp_char_cnt;
			}
		}
	}
	lines = hard_lines+soft_lines+1;
	return (lines*lh)+'px'; 
}

$(function(){
  var keys_down={};
  var $composetext = $("#composetext");
  var $composebutton = $("#composebutton");  
  
  $composetext.bind("keyup", function(){$composetext.css('height', sizeTextArea($composetext));});

  function doStuff(){
    if(keys_down[13] && keys_down[91]){
      $composebutton.click();
      $composetext.focus();
      keys_down[13] = false;
    }
  }
  
  $composetext.bind("keydown", function(event){
    keys_down[event.keyCode] = true;
    doStuff();  
  });
  
  $composetext.bind("keyup", function(event){
    keys_down[event.keyCode] = false;
  });
})