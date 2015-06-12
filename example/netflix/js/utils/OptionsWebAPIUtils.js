var JSONP = require('jsonp');
var NETFLIX_API_ENDPOINT = "http://dvd.netflix.com/JSON/AutoCompleteSearch?type=grouped";

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
                url = NETFLIX_API_ENDPOINT + '&prefix=' + query;

                JSONP(url, function(error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        // Transform the server response
                        // into a flatter structure.
                        result =
                            Object
                              .keys(data)
                              // Don't need the total result count.
                              .filter(function(key) {
                                  return key !== "totalResults";
                              })
                              // Flatten the result list.
                              .reduce(function(result, key) {
                                  var values = data[key].values;

                                  return result.concat(values.map(function(value, index) {
                                      return {
                                          type: key,
                                          index: index,
                                          value: value.pName,
                                      };
                                  }));
                              }, [])
                              .map(function(option) {
                                  // Values contain html, such as: "<em>H</em>ello"
                                  // We will never dangerously set inner html,
                                  // so strip all html tags.
                                  var value =
                                        option.value.replace(/<\/?[^>]+(>|$)/g, "")
                                                    .replace('&nbsp;', ' '),
                                      type = option.type;

                                  return {
                                      // Capitalize the type.
                                      type: type.charAt(0).toUpperCase() + type.slice(1),
                                      index: option.index,
                                      value: value
                                  };
                              });

                        cache[query] = result;

                        resolve(result);
                    }
                });
            }
        });
    }
};
