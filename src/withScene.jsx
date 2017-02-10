import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import SceneWithContext from './SceneWithContext';

const getDisplayName = WrappedComponent => (
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
);

export default (WrappedComponent) => {
    const WithScene = props => (
        <SceneWithContext>
            <WrappedComponent {...props} />
        </SceneWithContext>
    );

    WithScene.displayName = `withScene(${getDisplayName(WrappedComponent)})`;
    WithScene.WrappedComponent = WrappedComponent;

    return hoistStatics(WithScene, WrappedComponent);
};
