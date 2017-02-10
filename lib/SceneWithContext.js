'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var contextTypes = {
    scene: _react2.default.PropTypes.object
};

var SceneWithContext = function SceneWithContext(props, context) {
    return _react2.default.cloneElement(props.children, {
        scene: context.scene
    });
};

SceneWithContext.contextTypes = contextTypes;

exports.default = SceneWithContext;