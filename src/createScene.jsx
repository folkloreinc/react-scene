var ReactScene = require('./ReactScene');
var hoistStatics = require('hoist-non-react-statics');

function getDisplayName(WrappedComponent)
{
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

module.exports = function(WrappedComponent)
{
    var WithScene = React.createClass({
        
        render: function()
        {
            var methods = ['load', 'build', 'resize', 'mute', 'unmute', 'play', 'pause', 'end', 'destroy'];
            var methodProps = {};
            var method;
            for(var i = 0, ml = methods.length; i < ml; i++)
            {
                method = methods[i];
                if(this.refs.scene && this.refs.scene[method])
                {
                    methodProps[method] = this.refs.scene[method];
                }
            }
            
            return (
                <ReactScene
                    {...this.props}
                    {...methodProps}
                    >
                    <WrappedComponent ref="scene" {...this.props} />
                </ReactScene>
            );
        }
        
    });
    
    WithScene.displayName = `scene(${getDisplayName(WrappedComponent)})`;
    WithScene.WrappedComponent = WrappedComponent;
    
    return hoistStatics(WithScene, WrappedComponent);
};
