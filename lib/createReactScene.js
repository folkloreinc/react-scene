'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _pascalCase = require('pascal-case');

var _pascalCase2 = _interopRequireDefault(_pascalCase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_METHODS = ['load', 'build', 'resize', 'mute', 'unmute', 'play', 'pause', 'end', 'destroy'];

var createReactScene = function createReactScene(argMethods) {
    var methods = argMethods || DEFAULT_METHODS;

    var propTypes = {

        width: _react2.default.PropTypes.number,
        height: _react2.default.PropTypes.number,

        loadOnMount: _react2.default.PropTypes.bool,
        buildOnLoad: _react2.default.PropTypes.bool,
        playOnBuild: _react2.default.PropTypes.bool,
        destroyOnUnmount: _react2.default.PropTypes.bool,

        children: _react2.default.PropTypes.element
    };

    var contextTypes = {
        scene: _react2.default.PropTypes.object
    };

    var childContextTypes = {
        scene: _react2.default.PropTypes.object
    };

    var defaultProps = {
        width: 0,
        height: 0,

        loadOnMount: true,
        buildOnLoad: false,
        playOnBuild: false,
        destroyOnUnmount: true,

        children: null
    };

    function createSceneMethod(method) {
        return function sceneMethod() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return this.callSceneMethod(method, args);
        };
    }

    var ReactScene = function (_Component) {
        _inherits(ReactScene, _Component);

        function ReactScene(props) {
            _classCallCheck(this, ReactScene);

            var _this = _possibleConstructorReturn(this, (ReactScene.__proto__ || Object.getPrototypeOf(ReactScene)).call(this, props));

            var self = _this;
            methods.forEach(function (method) {
                self[method] = createSceneMethod(method).bind(self);
            });

            _this.state = {
                calling: null
            };
            return _this;
        }

        _createClass(ReactScene, [{
            key: 'getChildContext',
            value: function getChildContext() {
                var _this2 = this;

                var scene = {
                    parent: this.context.scene || null
                };

                methods.forEach(function (method) {
                    scene[method] = _this2[method];
                });

                return {
                    scene: scene
                };
            }
        }, {
            key: 'componentDidMount',
            value: function componentDidMount() {
                var _this3 = this;

                if (this.load && this.props.loadOnMount) {
                    setTimeout(function () {
                        _this3.load();
                    }, 1);
                }
            }
        }, {
            key: 'componentDidUpdate',
            value: function componentDidUpdate(prevProps) {
                if (this.resize) {
                    var sizeChanged = prevProps.width !== this.props.width || prevProps.height !== this.props.height;
                    if (sizeChanged) {
                        this.resize();
                    }
                }
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                if (this.destroy && this.props.destroyOnUnmount) {
                    this.destroy();
                }
            }
        }, {
            key: 'callSceneMethod',
            value: function callSceneMethod(name, args) {
                var _this4 = this;

                if (this.state.calling === name) {
                    return;
                }

                this.setState({
                    calling: name
                });

                var methodName = name;
                var pascalName = (0, _pascalCase2.default)(name);
                var willLoadName = 'sceneWill' + pascalName;
                var didLoadName = 'sceneDid' + pascalName;

                var done = function done() {
                    _this4.setState({
                        calling: null
                    });

                    // Call the "did" lifecycle method
                    if (_this4.props[didLoadName]) {
                        _this4.props[didLoadName]();
                    }

                    if (_this4[didLoadName]) {
                        _this4[didLoadName]();
                    }
                };

                var isAsync = false;
                var obj = {
                    async: function async() {
                        isAsync = true;
                        return done;
                    }
                };

                // Calling "will" lifecycle method
                if (this.props[willLoadName]) {
                    this.props[willLoadName]();
                }

                // Calling method
                if (this.props[methodName]) {
                    var methodArgs = [obj].concat(args);
                    var methodReturn = this.props[methodName].apply(null, methodArgs);
                    if (methodReturn && methodReturn.then) {
                        var promiseDone = obj.async();
                        methodReturn.then(promiseDone);
                    }
                }

                // If the call is not async, it's done
                if (!isAsync) {
                    done();
                }
            }

            /**
             * Scene lifecycle
             */

        }, {
            key: 'sceneDidLoad',
            value: function sceneDidLoad() {
                if (this.build && this.props.buildOnLoad) {
                    this.build();
                }
            }
        }, {
            key: 'sceneDidBuild',
            value: function sceneDidBuild() {
                if (this.play && this.props.playOnBuild) {
                    this.play();
                }
            }
        }, {
            key: 'render',
            value: function render() {
                return this.props.children || null;
            }
        }]);

        return ReactScene;
    }(_react.Component);

    delete propTypes.destroyOnUnmount;
    delete propTypes.buildOnLoad;
    delete propTypes.loadOnMount;

    methods.forEach(function (method) {
        var methodPascal = (0, _pascalCase2.default)(method);

        // PropTypes
        propTypes[method] = _react2.default.PropTypes.func;
        propTypes['sceneWill' + methodPascal] = _react2.default.PropTypes.func;
        propTypes['sceneDid' + methodPascal] = _react2.default.PropTypes.func;
        if (method === 'destroy') {
            propTypes.destroyOnUnmount = _react2.default.PropTypes.bool;
        } else if (method === 'build') {
            propTypes.buildOnLoad = _react2.default.PropTypes.bool;
        } else if (method === 'load') {
            propTypes.loadOnMount = _react2.default.PropTypes.bool;
        }
    });

    ReactScene.propTypes = propTypes;
    ReactScene.contextTypes = contextTypes;
    ReactScene.childContextTypes = childContextTypes;
    ReactScene.defaultProps = defaultProps;

    ReactScene.displayName = 'ReactScene';

    return ReactScene;
};

createReactScene.DEFAULT_METHODS = DEFAULT_METHODS;

exports.default = createReactScene;