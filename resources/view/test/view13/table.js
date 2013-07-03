var resource = require('resource');

module['exports'] = function (options, callback) {

	  var $ = this.$;

		$('.table').html('steve');

		this.layout({
    layoutOptions: options,
    html: $.html()
  }, callback);
};

