var $ = require('jquery');

$(function(){
	var $emailContainer = $('.convio-email-signup');
	var surveyID = $emailContainer.attr('data-surveyid');
	var reqs = [];
	var maps = [];
	var $thanks = $('.convio-email-signup .thanks');
	var formHTML = '<div class="form-container">';
	formHTML += '<style>.convio-email-signup { width: 80%; margin: 0 auto 15px; } .convio-email-signup .form-row { margin: 0 0 25px; } .convio-email-signup .input-full { width: 100%; } .convio-email-signup .input-text { box-shadow: none; border: 1px solid #e8e7e5; transition: border 0.2s ease-out; -webkit-appearance: none; -moz-appearance: none; appearance: none; } .convio-email-signup .input-text:focus { outline: none; border: 1px solid #A2A2A2; } .convio-email-signup .error { background-color: #cd4e38; border-radius: 4px; padding: 3px 15px; color: #fff; margin: 0 0 15px; } .convio-email-signup .hidden { visibility: hidden; opacity: 0; height: 0; } .convio-email-signup .input-error { border: 1px solid #cd4e38; } .convio-email-signup div, .convio-email-signup .error:not(.hidden) { opacity: 1; transition: opacity 0.2s ease-out; } .convio-email-signup .form-thanks { text-align: center; } </style>';
	formHTML += '<p class="error hidden"></p>';

	$('.convio-email-signup input').each(function(){
		var $input = $(this);
		var id = $input.attr('data-id');
		reqs.push($input.attr('data-req'));
		maps.push($input.attr('data-map'));
		
		formHTML += '<div class="form-row"><label class="color-primary type-small" for="'+id+'">'+$input.attr('data-label')+'</label><input type="'+$input.attr('type')+'" class="input-text input-full" name="'+id+'" id="'+id+'"></div>';
		
	});
	
	formHTML += '<a href="#" class="btn-large fill-callout inline-block">Submit</a>';
	formHTML += '</div>';
	formHTML += '<div class="form-thanks hidden">'+$thanks.html()+'</div>';
	$emailContainer.html(formHTML).show();
	
	$('.convio-email-signup .btn-large').on('click',function(e){
		e.preventDefault();

		var vals = [];
		var $email = $('.convio-email-signup #email');
		var errorClass = 'input-error';
		var errorBlock = $('.convio-email-signup .error');
		var errorCount = 0;
		var totalInputs = 0;
		var offset = $('.convio-email-signup').offset();
		
		$('.convio-email-signup input').each(function(i){
			var $input = $(this);
			var val = $input.val();
			vals.push(val);
			$input.removeClass(errorClass);
			totalInputs++;
			
			if (reqs[i] == 'true' && val == '') {
				$input.addClass(errorClass);
				errorCount++;
			}
			
		});
		
		if (errorCount != 0) {
			errorBlock.removeClass('hidden');
			errorBlock.html('Please complete the following fields:');
			$('html, body').animate({ scrollTop: offset.top }, 250);
		} else {
			if ($email.length && !isValidEmail($email.val())) {
				$email.addClass(errorClass);
				errorBlock.removeClass('hidden');
				errorBlock.html('That email address is not valid!');
				$('html, body').animate({ scrollTop: offset.top }, 250);
			} else {
				var url = 'http://e.wcs.org/site/Survey?cons_info_component=t&SURVEY_ID='+surveyID+'&ACTION_SUBMIT_SURVEY_RESPONSE=Submit';	
								
				for (var i = 0; i < totalInputs; i++) {
					url += '&'+maps[i]+'='+vals[i];
				}
							
				url = encodeURI(url);
				url = url.replace('#','%23');
				console.log(url);
				
				$.ajax({
					type: "POST",
					url: url
				}).always(function(){
					$('.convio-email-signup .form-thanks').removeClass('hidden');
					$('.convio-email-signup .form-container').addClass('hidden');
					$('html, body').animate({ scrollTop: offset.top }, 250);
				});
			}
		}
	});
	
	function isValidEmail(str) {
		var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
		if (filter.test(str)) {
			return true;
		} else {
			return false;
		}
	}
});