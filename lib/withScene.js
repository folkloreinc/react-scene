'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDisplayName = function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

exports.default = function (WrappedComponent) {
    var contextTypes = {
        scene: _react2.default.PropTypes.object
    };

    var WithScene = function WithScene(props, context) {
        return _react2.default.createElement(WrappedComponent, _extends({}, props, { scene: context.scene }));
    };

    WithScene.contextTypes = contextTypes;
    WithScene.displayName = 'withScene(' + getDisplayName(WrappedComponent) + ')';
    WithScene.WrappedComponent = WrappedComponent;

    return (0, _hoistNonReactStatics2.default)(WithScene, WrappedComponent);
};