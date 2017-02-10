import React, { Component } from 'react';
import pascal from 'pascal-case';

const DEFAULT_METHODS = [
    'load',
    'build',
    'resize',
    'mute',
    'unmute',
    'play',
    'pause',
    'end',
    'destroy',
];

const createReactScene = (argMethods) => {
    const methods = argMethods || DEFAULT_METHODS;

    const propTypes = {

        width: React.PropTypes.number,
        height: React.PropTypes.number,

        loadOnMount: React.PropTypes.bool,
        buildOnLoad: React.PropTypes.bool,
        playOnBuild: React.PropTypes.bool,
        destroyOnUnmount: React.PropTypes.bool,

        children: React.PropTypes.element,
    };

    const contextTypes = {
        scene: React.PropTypes.object,
    };

    const childContextTypes = {
        scene: React.PropTypes.object,
    };

    const defaultProps = {
        width: 0,
        height: 0,

        loadOnMount: true,
        buildOnLoad: false,
        playOnBuild: false,
        destroyOnUnmount: true,

        children: null,
    };

    function createSceneMethod(method) {
        return function sceneMethod(...args) {
            return this.callSceneMethod(method, args);
        };
    }

    class ReactScene extends Component {

        constructor(props) {
            super(props);

            const self = this;
            methods.forEach((method) => {
                self[method] = createSceneMethod(method).bind(self);
            });

            this.state = {
                calling: null,
            };
        }

        getChildContext() {
            const scene = {
                parent: this.context.scene || null,
            };

            methods.forEach((method) => {
                scene[method] = this[method];
            });

            return {
                scene,
            };
        }

        componentDidMount() {
            if (this.load && this.props.loadOnMount) {
                setTimeout(() => {
                    this.load();
                }, 1);
            }
        }

        componentDidUpdate(prevProps) {
            if (this.resize) {
                const sizeChanged = (
                    prevProps.width !== this.props.width ||
                    prevProps.height !== this.props.height
                );
                if (sizeChanged) {
                    this.resize();
                }
            }
        }

        componentWillUnmount() {
            if (this.destroy && this.props.destroyOnUnmount) {
                this.destroy();
            }
        }

        callSceneMethod(name, args) {
            if (this.state.calling === name) {
                return;
            }

            this.setState({
                calling: name,
            });

            const methodName = name;
            const pascalName = pascal(name);
            const willLoadName = `sceneWill${pascalName}`;
            const didLoadName = `sceneDid${pascalName}`;

            const done = () => {
                this.setState({
                    calling: null,
                });

                // Call the "did" lifecycle method
                if (this.props[didLoadName]) {
                    this.props[didLoadName]();
                }

                if (this[didLoadName]) {
                    this[didLoadName]();
                }
            };

            let isAsync = false;
            const obj = {
                async() {
                    isAsync = true;
                    return done;
                },
            };

            // Calling "will" lifecycle method
            if (this.props[willLoadName]) {
                this.props[willLoadName]();
            }

            // Calling method
            if (this.props[methodName]) {
                const methodArgs = [obj].concat(args);
                const methodReturn = this.props[methodName].apply(null, methodArgs);
                if (methodReturn && methodReturn.then) {
                    const promiseDone = obj.async();
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
        sceneDidLoad() {
            if (this.build && this.props.buildOnLoad) {
                this.build();
            }
        }

        sceneDidBuild() {
            if (this.play && this.props.playOnBuild) {
                this.play();
            }
        }

        render() {
            return this.props.children || null;
        }
    }

    delete propTypes.destroyOnUnmount;
    delete propTypes.buildOnLoad;
    delete propTypes.loadOnMount;

    methods.forEach((method) => {
        const methodPascal = pascal(method);

        // PropTypes
        propTypes[method] = React.PropTypes.func;
        propTypes[`sceneWill${methodPascal}`] = React.PropTypes.func;
        propTypes[`sceneDid${methodPascal}`] = React.PropTypes.func;
        if (method === 'destroy') {
            propTypes.destroyOnUnmount = React.PropTypes.bool;
        } else if (method === 'build') {
            propTypes.buildOnLoad = React.PropTypes.bool;
        } else if (method === 'load') {
            propTypes.loadOnMount = React.PropTypes.bool;
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

export default createReactScene;
