import React from 'react';
import hoistStatics from 'hoist-non-react-statics';

const getDisplayName = WrappedComponent => (
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
);

export default (WrappedComponent) => {
    const contextTypes = {
        scene: React.PropTypes.object,
    };

    const WithScene = (props, context) => (
        <WrappedComponent {...props} scene={context.scene} />
    );

    WithScene.contextTypes = contextTypes;
    WithScene.displayName = `withScene(${getDisplayName(WrappedComponent)})`;
    WithScene.WrappedComponent = WrappedComponent;

    return hoistStatics(WithScene, WrappedComponent);
};
