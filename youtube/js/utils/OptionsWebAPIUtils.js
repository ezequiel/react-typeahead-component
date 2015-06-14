var JSONP = require('jsonp');
var YOUTUBE_API_ENDPOINT = "https://clients1.google.com/complete/search?client=youtube&ds=yt";

var cache = {
    '': []
};

module.exports = {
    fetchOptions: function(query) {
        return new Promise(function(resolve, reject) {
            var result = cache[query], url;

            if (result !== undefined) {
                resolve(result);
            } else {
                url = YOUTUBE_API_ENDPOINT + '&q=' + query;

                JSONP(url, function(error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        result = data[1].map(function(datum) {
                            return datum[0];
                        });

                        cache[query] = result;

                        resolve(result);
                    }
                });
            }
        });
    }
};
