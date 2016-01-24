'use strict';

$(document).ready(function(){
	var vm = this;

	var search = require('./search_functions.js');
	var movieResult = require('./show_result.js');

	vm.search = function(evt) {
		if(evt) evt.stopImmediatePropagation();
		var $btn = $('#search_movie');

		$btn.button('loading');
		$btn.find('i').removeClass('fa-search').addClass('fa-spinner fa-spin');
		$('#search_message').hide();
		var searchText = $('#search_text').val();
		if(searchText==='') {
			movieResult.addSearchErrorMessage('Please enter some text');
			return;
		}
		search.searchMovie(searchText)
		.then(function(data){
			console.log(data);
			vm.processResult(data);
		}, function(error){
			console.log('error',error);
		})
		.done(function(){
			$btn.button('reset');
			$btn.find('i').removeClass('fa-spinner fa-spin').addClass('fa-search');
		})
	}

	$('#search_movie').bind('click',vm.search);

	$('#search_text').bind('keyup',function(evt){
		if(evt.keyCode===13) {
			$("#search_text").autocomplete('close');
			vm.search();
		}
	});

	$("#search_text").autocomplete({
		appendTo: '#search_area',
        source: function(request, response) {
            $.getJSON("http://suggestqueries.google.com/complete/search?callback=?",
                {
                  "hl":"en", // Language
                  "q": $('#search_text').val(), // query term
                  "client":"firefox" 
                },
            	function(data){
            	response($.map(data[1], function (value, key) {
	                return {
	                    label: value,
	                    value: value
	                };
	            }));
            });
        },
        select: function(evt, ui) {
        	$('#search_text').val(ui.item.value);
        	vm.search();
        	return false;
        }
    });

	vm.processResult = function(data) {
		$('#search_result').html('').hide();
		if(data.Error) {
			movieResult.addSearchErrorMessage(data.Error);
			return;
		}
		$('#search_result').html(movieResult.getMovieResultTemplate(data)).fadeIn('slow');
	}
});

// https://kat.cr/json.php?q=gotham