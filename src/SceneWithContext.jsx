import React from 'react';

const contextTypes = {
    scene: React.PropTypes.object,
};

const SceneWithContext = (props, context) => {
    return React.cloneElement(props.children, {
        scene: context.scene,
    });
};

SceneWithContext.contextTypes = contextTypes;

export default SceneWithContext;
