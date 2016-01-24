'use strict';

module.exports = {
	getMovieResultTemplate: function(data) {
		return '<div class="col-sm-12 col-md-8 col-md-offset-2">'+
					'<div class="thumbnail m-tb-20">'+
						'<img src="'+data.Poster+'" alt="'+data.Title+'">'+
						'<div class="caption">'+
							'<h3>'+data.Title+'</h3>'+
							'<p>'+data.Plot+'</p>'+
						'</div>'+
					'</div>'+
					''+
				'</div>';
	},

	addSearchErrorMessage: function(message) {
		$('#search_message').hide();
		$('#search_message').html('<div class="alert alert-danger fade in" role="alert">'+
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
  				'<span aria-hidden="true">&times;</span>'+
				'</button>'+message+'</div>').show('slow');
	}
};