'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _SceneWithContext = require('./SceneWithContext');

var _SceneWithContext2 = _interopRequireDefault(_SceneWithContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDisplayName = function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

exports.default = function (WrappedComponent) {
    var WithScene = function WithScene(props) {
        return _react2.default.createElement(
            _SceneWithContext2.default,
            null,
            _react2.default.createElement(WrappedComponent, props)
        );
    };

    WithScene.displayName = 'withScene(' + getDisplayName(WrappedComponent) + ')';
    WithScene.WrappedComponent = WrappedComponent;

    return (0, _hoistNonReactStatics2.default)(WithScene, WrappedComponent);
};