(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["ReactScene"] = factory(require("react"));
	else
		root["ReactScene"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ReactScene = __webpack_require__(1);
	ReactScene.createReactScene = __webpack_require__(2);
	ReactScene.createScene = __webpack_require__(4);
	ReactScene.withScene = __webpack_require__(6);
	
	module.exports = ReactScene;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var createReactScene = __webpack_require__(2);
	
	module.exports = createReactScene();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(3);
	
	var DEFAULT_METHODS = ['load', 'build', 'resize', 'mute', 'unmute', 'play', 'pause', 'end', 'destroy'];
	
	function createReactScene(METHODS) {
	    if (typeof METHODS === 'undefined') {
	        METHODS = DEFAULT_METHODS;
	    }
	
	    var reactScene = {
	
	        propTypes: {
	
	            width: React.PropTypes.number,
	            height: React.PropTypes.number,
	
	            // loadOnMount: React.PropTypes.bool,
	            // buildOnLoad: React.PropTypes.bool,
	            // playOnBuild: React.PropTypes.bool,
	
	            onRemote: React.PropTypes.func
	
	        },
	
	        childContextTypes: {
	            scene: React.PropTypes.object
	        },
	
	        contextTypes: {
	            scene: React.PropTypes.object
	        },
	
	        getChildContext: function getChildContext() {
	            var scene = {
	                parent: this.context.scene || null
	            };
	
	            var method;
	            for (var i = 0, ml = METHODS.length; i < ml; i++) {
	                method = METHODS[i];
	                scene[method] = this[method];
	            }
	
	            return {
	                scene: scene
	            };
	        },
	
	        getDefaultProps: function getDefaultProps() {
	            return {
	                width: 0,
	                height: 0,
	
	                loadOnMount: true,
	                buildOnLoad: false,
	                playOnBuild: false,
	                destroyOnUnmount: true
	            };
	        },
	
	        getInitialState: function getInitialState() {
	            return {
	                calling: null
	            };
	        },
	
	        render: function render() {
	            return this.props.children || null;
	        },
	
	        componentDidMount: function componentDidMount() {
	            if (this.props.onRemote) {
	                var remote = this.createRemote();
	                this.props.onRemote(remote);
	            }
	
	            if (this.load && this.props.loadOnMount) {
	                var load = this.load;
	                setTimeout(function () {
	                    load();
	                }, 1);
	            }
	        },
	
	        componentWillUnmount: function componentWillUnmount() {
	            if (this.destroy && this.props.destroyOnUnmount) {
	                this.destroy();
	            }
	        },
	
	        componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
	            var onRemoteChanged = prevProps.onRemote !== this.props.onRemote;
	            if (onRemoteChanged && this.props.onRemote) {
	                var remote = this.createRemote();
	                this.props.onRemote(remote);
	            }
	
	            if (this.resize) {
	                var sizeChanged = prevProps.width !== this.props.width || prevProps.height !== this.props.height;
	                if (sizeChanged) {
	                    this.resize();
	                }
	            }
	        },
	
	        callSceneMethod: function callSceneMethod(name, args) {
	            if (this.state.calling === name) {
	                return;
	            }
	
	            this.setState({
	                calling: name
	            });
	
	            var pascalName = name.substr(0, 1).toUpperCase() + name.substr(1);
	            var methodName = name;
	            var willLoadName = 'sceneWill' + pascalName;
	            var didLoadName = 'sceneDid' + pascalName;
	
	            var done = function () {
	                this.setState({
	                    calling: null
	                });
	
	                //Call the "did" lifecycle method
	                if (this.props[didLoadName]) {
	                    this.props[didLoadName]();
	                }
	
	                if (this[didLoadName]) {
	                    this[didLoadName]();
	                }
	            }.bind(this);
	
	            var isAsync = false;
	            var obj = {
	                async: function async() {
	                    isAsync = true;
	                    return done;
	                }
	            };
	
	            //Calling "will" lifecycle method
	            if (this.props[willLoadName]) {
	                this.props[willLoadName]();
	            }
	
	            //Calling method
	            if (this.props[methodName]) {
	                var methodArgs = [obj].concat(args);
	                var methodReturn = this.props[methodName].apply(null, methodArgs);
	                if (methodReturn && methodReturn.then) {
	                    var promiseDone = obj.async();
	                    methodReturn.then(promiseDone);
	                }
	            }
	
	            //If the call is not async, it's done
	            if (!isAsync) {
	                done();
	            }
	        },
	
	        createRemote: function createRemote() {
	            var remote = {};
	            var method;
	            for (var i = 0, ml = METHODS.length; i < ml; i++) {
	                method = METHODS[i];
	                remote[method] = this[method];
	            }
	
	            return remote;
	        },
	
	        /**
	         * Scene lifecycle
	         */
	        sceneDidLoad: function sceneDidLoad() {
	            if (this.build && this.props.buildOnLoad) {
	                this.build();
	            }
	        },
	
	        sceneDidBuild: function sceneDidBuild() {
	            if (this.play && this.props.playOnBuild) {
	                this.play();
	            }
	        }
	
	    };
	
	    function createSceneMethod(method) {
	        return function () {
	            var args = [];
	            for (var i = 0, al = arguments.length; i < al; i++) {
	                args.push(arguments[i]);
	            }
	            this.callSceneMethod(method, args);
	        };
	    }
	
	    var method, methodPascal;
	    for (var i = 0, ml = METHODS.length; i < ml; i++) {
	        method = METHODS[i];
	        methodPascal = method.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
	            return g1.toUpperCase() + g2.toLowerCase();
	        });
	
	        //PropTypes
	        reactScene.propTypes[method] = React.PropTypes.func;
	        reactScene.propTypes['sceneWill' + methodPascal] = React.PropTypes.func;
	        reactScene.propTypes['sceneDid' + methodPascal] = React.PropTypes.func;
	        if (method === 'destroy') {
	            reactScene.propTypes.destroyOnUnmount = React.PropTypes.bool;
	        } else if (method === 'build') {
	            reactScene.propTypes.buildOnLoad = React.PropTypes.bool;
	        } else if (method === 'load') {
	            reactScene.propTypes.loadOnMount = React.PropTypes.bool;
	        }
	
	        // Methods
	        reactScene[method] = createSceneMethod(method);
	    }
	
	    var ReactScene = React.createClass(reactScene);
	    ReactScene.displayName = 'ReactScene';
	
	    return ReactScene;
	}
	
	createReactScene.DEFAULT_METHODS = DEFAULT_METHODS;
	
	module.exports = createReactScene;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var React = __webpack_require__(3);
	var createReactScene = __webpack_require__(2);
	var hoistStatics = __webpack_require__(5);
	
	function getDisplayName(WrappedComponent) {
	    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
	}
	
	module.exports = function (SceneComponent, props, METHODS) {
	    if (typeof METHODS === 'undefined') {
	        METHODS = createReactScene.DEFAULT_METHODS;
	    }
	
	    var ReactScene = createReactScene(METHODS);
	
	    //Passes context as props
	    var SceneWithContext = function SceneWithContext(props, context) {
	        var children = React.cloneElement(props.children, {
	            scene: context.scene
	        });
	
	        return children;
	    };
	
	    SceneWithContext.contextTypes = {
	        scene: React.PropTypes.object
	    };
	
	    //Scene wrapper
	    var screenWrapper = {
	
	        render: function render() {
	            var methodProps = {};
	            var method;
	            for (var i = 0, ml = METHODS.length; i < ml; i++) {
	                method = METHODS[i];
	                methodProps[method] = this.createRefMethod('component', method);
	            }
	
	            /* jshint ignore:start */
	            return React.createElement(
	                ReactScene,
	                _extends({
	                    ref: 'scene'
	                }, props, this.props, methodProps),
	                React.createElement(
	                    SceneWithContext,
	                    null,
	                    React.createElement(SceneComponent, _extends({ ref: 'component' }, this.props))
	                )
	            );
	            /* jshint ignore:end */
	        },
	
	        createRefMethod: function createRefMethod(ref, method) {
	            var refMethod = function refMethod() {
	                if (this.refs[ref] && this.refs[ref][method]) {
	                    this.refs[ref][method].apply(null, arguments);
	                } else {
	                    console.warn('Method "' + method + '" not implemented on component ' + getDisplayName(SceneComponent));
	                }
	            };
	
	            if (this) {
	                refMethod = refMethod.bind(this);
	            }
	
	            return refMethod;
	        }
	
	    };
	
	    //Add methods to wrapper
	    var method;
	    for (var i = 0, ml = METHODS.length; i < ml; i++) {
	        method = METHODS[i];
	        screenWrapper[method] = screenWrapper.createRefMethod.call(null, 'scene', method);
	    }
	
	    var SceneWrapper = React.createClass(screenWrapper);
	    SceneWrapper.displayName = 'scene(' + getDisplayName(SceneComponent) + ')';
	    SceneWrapper.SceneComponent = SceneComponent;
	
	    return hoistStatics(SceneWrapper, SceneComponent);
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * Copyright 2015, Yahoo! Inc.
	 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
	 */
	'use strict';
	
	var REACT_STATICS = {
	    childContextTypes: true,
	    contextTypes: true,
	    defaultProps: true,
	    displayName: true,
	    getDefaultProps: true,
	    mixins: true,
	    propTypes: true,
	    type: true
	};
	
	var KNOWN_STATICS = {
	    name: true,
	    length: true,
	    prototype: true,
	    caller: true,
	    arguments: true,
	    arity: true
	};
	
	var isGetOwnPropertySymbolsAvailable = typeof Object.getOwnPropertySymbols === 'function';
	
	module.exports = function hoistNonReactStatics(targetComponent, sourceComponent, customStatics) {
	    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components
	        var keys = Object.getOwnPropertyNames(sourceComponent);
	
	        /* istanbul ignore else */
	        if (isGetOwnPropertySymbolsAvailable) {
	            keys = keys.concat(Object.getOwnPropertySymbols(sourceComponent));
	        }
	
	        for (var i = 0; i < keys.length; ++i) {
	            if (!REACT_STATICS[keys[i]] && !KNOWN_STATICS[keys[i]] && (!customStatics || !customStatics[keys[i]])) {
	                try {
	                    targetComponent[keys[i]] = sourceComponent[keys[i]];
	                } catch (error) {
	
	                }
	            }
	        }
	    }
	
	    return targetComponent;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var ReactScene = __webpack_require__(1);
	var hoistStatics = __webpack_require__(5);
	
	function getDisplayName(WrappedComponent) {
	    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
	}
	
	module.exports = function (WrappedComponent) {
	    var WithScene = React.createClass({
	        displayName: 'WithScene',
	
	
	        contextTypes: {
	            scene: React.PropTypes.object
	        },
	
	        render: function render() {
	            /* jshint ignore:start */
	            return React.createElement(WrappedComponent, _extends({}, this.props, { scene: this.context.scene }));
	            /* jshint ignore:end */
	        }
	
	    });
	
	    WithScene.displayName = 'withScene(' + getDisplayName(WrappedComponent) + ')';
	    WithScene.WrappedComponent = WrappedComponent;
	
	    return hoistStatics(WithScene, WrappedComponent);
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=react-scene.js.map