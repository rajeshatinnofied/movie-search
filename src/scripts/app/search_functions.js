'use strict';

var apiUrl = 'http://www.omdbapi.com/?';

module.exports = {
	searchMovie: function (searchText) {
		var deferred = $.Deferred();
		$.ajax({
			url: apiUrl,
			type: 'GET',
			data: {
				t: searchText,
				plot: 'full',
				r: 'json'
			}
		})
		.done(function(data) {
			deferred.resolve(data);
		})
		.fail(function(error,status) {
			deferred.reject({data:error,status:status});
		})
		.always(function() {
			console.log("complete");
		});
		return deferred.promise();
	}
};