var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionTypes = require('../constants/OptionConstants').ActionTypes;
var assign = require('object-assign');

var OptionStore = assign({}, EventEmitter.prototype, {
    emitChange: function(options) {
        this.emit('change', options);
    }
});

AppDispatcher.register(function(action) {
    switch(action.actionType) {
    case ActionTypes.GET_OPTIONS_SUCCESS:
        OptionStore.emitChange(action.options);
        break;
    }
});

module.exports = OptionStore;
