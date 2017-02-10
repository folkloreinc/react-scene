'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _createReactScene = require('./createReactScene');

var _createReactScene2 = _interopRequireDefault(_createReactScene);

var _SceneWithContext = require('./SceneWithContext');

var _SceneWithContext2 = _interopRequireDefault(_SceneWithContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getDisplayName = function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

exports.default = function (ChildComponent, sceneProps, argMethods) {
    var methods = argMethods || _createReactScene2.default.DEFAULT_METHODS;

    var SceneComponent = ChildComponent;
    var ReactScene = (0, _createReactScene2.default)(methods);

    function createRefMethod(ref, method) {
        return function refMethod() {
            if (this[ref] && this[ref][method]) {
                var _ref$method;

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                (_ref$method = this[ref][method]).call.apply(_ref$method, [this[ref]].concat(args));
            } else {
                console.warn('Method "' + method + '" not implemented on component ' + getDisplayName(SceneComponent));
            }
        };
    }

    var SceneWrapper = function (_Component) {
        _inherits(SceneWrapper, _Component);

        function SceneWrapper(props) {
            _classCallCheck(this, SceneWrapper);

            var _this = _possibleConstructorReturn(this, (SceneWrapper.__proto__ || Object.getPrototypeOf(SceneWrapper)).call(this, props));

            _this.component = null;
            _this.scene = null;

            methods.forEach(function (method) {
                _this[method] = createRefMethod('scene', method).bind(_this);
            });

            _this.methodProps = {};
            methods.forEach(function (method) {
                _this.methodProps[method] = createRefMethod('component', method).bind(_this);
            });
            return _this;
        }

        _createClass(SceneWrapper, [{
            key: 'render',
            value: function render() {
                var _this2 = this;

                return _react2.default.createElement(
                    ReactScene,
                    _extends({
                        ref: function ref(scene) {
                            _this2.scene = scene;
                        }
                    }, sceneProps, this.props, this.methodProps),
                    _react2.default.createElement(
                        _SceneWithContext2.default,
                        null,
                        _react2.default.createElement(SceneComponent, _extends({
                            ref: function ref(component) {
                                _this2.component = component;
                            }
                        }, this.props))
                    )
                );
            }
        }]);

        return SceneWrapper;
    }(_react.Component);

    SceneWrapper.displayName = 'scene(' + getDisplayName(SceneComponent) + ')';
    SceneWrapper.ChildComponent = ChildComponent;
    SceneWrapper.SceneComponent = SceneComponent;

    return (0, _hoistNonReactStatics2.default)(SceneWrapper, SceneComponent);
};