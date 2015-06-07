var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/OptionConstants').ActionTypes;
var OptionWebAPIUtils = require('../utils/OptionsWebAPIUtils');

var OptionActions = {
    getOptions: function(inputValue) {
        OptionWebAPIUtils.fetchOptions(inputValue).then(function(data) {
            AppDispatcher.dispatch({
                actionType: ActionTypes.GET_OPTIONS_SUCCESS,
                options: data
            });
        });
    }
};

module.exports = OptionActions;
