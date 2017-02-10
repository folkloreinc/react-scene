import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import createReactScene from './createReactScene';
import withScene from './withScene';

const getDisplayName = WrappedComponent => (
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
);

export default (ChildComponent, sceneProps, argMethods) => {
    const methods = argMethods || createReactScene.DEFAULT_METHODS;

    const SceneComponent = withScene(ChildComponent);
    const ReactScene = createReactScene(methods);

    function createRefMethod(ref, method) {
        return function refMethod(...args) {
            if (this[ref] && this[ref][method]) {
                this[ref][method].apply(null, args);
            } else {
                console.warn(`Method "${method}" not implemented on component ${getDisplayName(SceneComponent)}`);
            }
        };
    }

    class SceneWrapper extends Component {

        constructor(props) {
            super(props);

            this.component = null;
            this.scene = null;

            methods.forEach((method) => {
                this[method] = createRefMethod('scene', method).bind(this);
            });

            this.methodProps = {};
            methods.forEach((method) => {
                this.methodProps[method] = createRefMethod('component', method).bind(this);
            });
        }

        render() {
            return (
                <ReactScene
                    ref={(scene) => { this.scene = scene; }}
                    {...sceneProps}
                    {...this.props}
                    {...this.methodProps}
                >
                    <SceneComponent
                        ref={(component) => { this.component = component; }}
                        {...this.props}
                    />
                </ReactScene>
            );
        }
    }

    SceneWrapper.displayName = `scene(${getDisplayName(SceneComponent)})`;
    SceneWrapper.ChildComponent = ChildComponent;
    SceneWrapper.SceneComponent = SceneComponent;

    return hoistStatics(SceneWrapper, SceneComponent);
};
