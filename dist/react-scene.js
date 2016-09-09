(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["ReactScene"] = factory(require("react"));
	else
		root["ReactScene"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
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
	ReactScene.createScene = __webpack_require__(3);
	ReactScene.withScene = __webpack_require__(5);
	
	module.exports = ReactScene;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(2);
	
	var ReactScene = React.createClass({
	    displayName: 'ReactScene',
	
	
	    propTypes: {
	
	        width: React.PropTypes.number,
	        height: React.PropTypes.number,
	
	        loadOnMount: React.PropTypes.bool,
	        buildOnLoad: React.PropTypes.bool,
	        playOnBuild: React.PropTypes.bool,
	        destroyOnUnmount: React.PropTypes.bool,
	
	        load: React.PropTypes.func,
	        build: React.PropTypes.func,
	        resize: React.PropTypes.func,
	        mute: React.PropTypes.func,
	        unmute: React.PropTypes.func,
	        play: React.PropTypes.func,
	        pause: React.PropTypes.func,
	        end: React.PropTypes.func,
	        destroy: React.PropTypes.func,
	
	        onRemote: React.PropTypes.func,
	
	        //Scene lifecycle
	        sceneWillLoad: React.PropTypes.func,
	        sceneDidLoad: React.PropTypes.func,
	        sceneWillBuild: React.PropTypes.func,
	        sceneDidBuild: React.PropTypes.func,
	        sceneWillResize: React.PropTypes.func,
	        sceneDidResize: React.PropTypes.func,
	        sceneWillMute: React.PropTypes.func,
	        sceneDidMute: React.PropTypes.func,
	        sceneWillUnmute: React.PropTypes.func,
	        sceneDidUnmute: React.PropTypes.func,
	        sceneWillPlay: React.PropTypes.func,
	        sceneDidPlay: React.PropTypes.func,
	        sceneWillPause: React.PropTypes.func,
	        sceneDidPause: React.PropTypes.func,
	        sceneWillEnd: React.PropTypes.func,
	        sceneDidEnd: React.PropTypes.func
	
	    },
	
	    childContextTypes: {
	        scene: React.PropTypes.object
	    },
	
	    contextTypes: {
	        scene: React.PropTypes.object
	    },
	
	    getChildContext: function getChildContext() {
	        return {
	            scene: {
	                parent: this.context.scene || null,
	                load: this.load,
	                build: this.build,
	                resize: this.resize,
	                mute: this.mute,
	                unmute: this.unmute,
	                play: this.play,
	                pause: this.pause,
	                end: this.end,
	                destroy: this.destroy
	            }
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
	
	        if (this.props.loadOnMount) {
	            this.load();
	        }
	    },
	
	    componentWillUnmount: function componentWillUnmount() {
	        if (this.props.destroyOnUnmount) {
	            this.destroy();
	        }
	    },
	
	    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
	        var onRemoteChanged = prevProps.onRemote !== this.props.onRemote;
	        if (onRemoteChanged && this.props.onRemote) {
	            var remote = this.createRemote();
	            this.props.onRemote(remote);
	        }
	
	        var sizeChanged = prevProps.width !== this.props.width || prevProps.height !== this.props.height;
	        if (sizeChanged) {
	            this.resize();
	        }
	    },
	
	    load: function load() {
	        this.callSceneMethod('load', arguments);
	    },
	
	    build: function build() {
	        this.callSceneMethod('build', arguments);
	    },
	
	    resize: function resize() {
	        this.callSceneMethod('resize', arguments);
	    },
	
	    mute: function mute() {
	        this.callSceneMethod('mute', arguments);
	    },
	
	    unmute: function unmute() {
	        this.callSceneMethod('unmute', arguments);
	    },
	
	    play: function play() {
	        this.callSceneMethod('play', arguments);
	    },
	
	    pause: function pause() {
	        this.callSceneMethod('pause', arguments);
	    },
	
	    end: function end() {
	        this.callSceneMethod('end', arguments);
	    },
	
	    destroy: function destroy() {
	        this.callSceneMethod('destroy', arguments);
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
	
	        var done = _.bind(function () {
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
	        }, this);
	
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
	            var methodArgs = [obj].concat(_.map(args, function (arg) {
	                return arg;
	            }));
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
	        return {
	            load: this.load,
	            build: this.build,
	            resize: this.resize,
	            mute: this.mute,
	            unmute: this.unmute,
	            play: this.play,
	            pause: this.pause,
	            end: this.end,
	            destroy: this.destroy
	        };
	    },
	
	    /**
	     * Scene lifecycle
	     */
	    sceneDidLoad: function sceneDidLoad() {
	        if (this.props.buildOnLoad) {
	            this.build();
	        }
	    },
	
	    sceneDidBuild: function sceneDidBuild() {
	        if (this.props.playOnBuild) {
	            this.play();
	        }
	    }
	
	});
	
	module.exports = ReactScene;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var ReactScene = __webpack_require__(1);
	var hoistStatics = __webpack_require__(4);
	
	function getDisplayName(WrappedComponent) {
	    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
	}
	
	module.exports = function (WrappedComponent, props) {
	    var SceneWithContext = React.createClass({
	        displayName: 'SceneWithContext',
	
	
	        contextTypes: {
	            scene: React.PropTypes.object
	        },
	
	        render: function render() {
	            var children = React.cloneElement(this.props.children, {
	                scene: this.context.scene
	            });
	
	            return children;
	        }
	
	    });
	
	    var SceneWrapper = React.createClass({
	        displayName: 'SceneWrapper',
	
	
	        render: function render() {
	            var methods = ['load', 'build', 'resize', 'mute', 'unmute', 'play', 'pause', 'end', 'destroy'];
	            var methodProps = {};
	            var method;
	            for (var i = 0, ml = methods.length; i < ml; i++) {
	                method = methods[i];
	                if (this.refs.scene && this.refs.scene[method]) {
	                    methodProps[method] = this.refs.scene[method];
	                }
	            }
	
	            return React.createElement(
	                ReactScene,
	                _extends({}, this.props, props, methodProps),
	                React.createElement(
	                    SceneWithContext,
	                    null,
	                    React.createElement(WrappedComponent, _extends({ ref: 'scene' }, this.props))
	                )
	            );
	        }
	
	    });
	
	    SceneWrapper.displayName = 'scene(' + getDisplayName(WrappedComponent) + ')';
	    SceneWrapper.WrappedComponent = WrappedComponent;
	
	    return hoistStatics(SceneWrapper, WrappedComponent);
	};

/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var ReactScene = __webpack_require__(1);
	var hoistStatics = __webpack_require__(4);
	
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
	            return React.createElement(WrappedComponent, _extends({}, this.props, { scene: this.context.scene }));
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