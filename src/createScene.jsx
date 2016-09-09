var ReactScene = require('./ReactScene');
var hoistStatics = require('hoist-non-react-statics');

function getDisplayName(WrappedComponent)
{
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

module.exports = function(WrappedComponent, props, opts)
{
    if(typeof(opts) === 'undefined')
    {
        opts = {};
    }
    if(!opts.methods)
    {
        opts.methods = ['load', 'build', 'resize', 'mute', 'unmute', 'play', 'pause', 'end', 'destroy'];
    }
    
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
            var methodProps = {};
            var method;
            for(var i = 0, ml = opts.methods.length; i < ml; i++)
            {
                method = opts.methods[i];
                methodProps[method] = this.createRefMethod(method, 'component');
                this[method] = this.createRefMethod(method, 'scene');
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
        },
        
        createRefMethod: function(method, ref)
        {
            return function()
            {
                if(this.refs[ref] && this.refs[ref][method])
                {
                    this.refs[ref][method].apply(null, arguments);
                }
                else
                {
                    console.warn('Method "'+method+'" not implemented on component '+getDisplayName(WrappedComponent));
                }
            }.bind(this);
        }
        
    });
    
    SceneWrapper.displayName = `scene(${getDisplayName(WrappedComponent)})`;
    SceneWrapper.WrappedComponent = WrappedComponent;
    
    return hoistStatics(SceneWrapper, WrappedComponent);
};
