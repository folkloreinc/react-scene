var ReactScene = require('./ReactScene');
var hoistStatics = require('hoist-non-react-statics');

function getDisplayName(WrappedComponent)
{
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

module.exports = function(WrappedComponent, props)
{
    var SceneWithContext = React.createClass({
        
        contextTypes: {
            scene: React.PropTypes.object
        },
        
        render: function()
        {
            var children = React.cloneElement(this.props.children, {
                scene: this.context.scene
            });
            
            return children;
        }
        
    });
    
    var SceneWrapper = React.createClass({
        
        render: function()
        {
            var methods = ['load', 'build', 'resize', 'mute', 'unmute', 'play', 'pause', 'end', 'destroy'];
            var methodProps = {};
            var method;
            for(var i = 0, ml = methods.length; i < ml; i++)
            {
                method = methods[i];
                if(this.refs.component && this.refs.component[method])
                {
                    methodProps[method] = this.refs.component[method];
                }
                
                this[method] = this.refs.scene && this.refs.scene[method] ? this.refs.scene[method]:function(){};
            }
            
            return (
                <ReactScene
                    ref="scene"
                    {...this.props}
                    {...props}
                    {...methodProps}
                    >
                    <SceneWithContext>
                        <WrappedComponent ref="component" {...this.props} />
                    </SceneWithContext>
                </ReactScene>
            );
        }
        
    });
    
    SceneWrapper.displayName = `scene(${getDisplayName(WrappedComponent)})`;
    SceneWrapper.WrappedComponent = WrappedComponent;
    
    return hoistStatics(SceneWrapper, WrappedComponent);
};
