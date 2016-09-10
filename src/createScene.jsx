var React = require('react');
var createReactScene = require('./createReactScene');
var hoistStatics = require('hoist-non-react-statics');

function getDisplayName(WrappedComponent)
{
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

module.exports = function(SceneComponent, props, METHODS)
{
    if(typeof(METHODS) === 'undefined')
    {
        METHODS = createReactScene.DEFAULT_METHODS;
    }
    
    var ReactScene = createReactScene(METHODS);
    
    //Passes context as props
    var SceneWithContext = function(props, context)
    {
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
        
        render: function()
        {
            var methodProps = {};
            var method;
            for(var i = 0, ml = METHODS.length; i < ml; i++)
            {
                method = METHODS[i];
                methodProps[method] = this.createRefMethod('component', method);
            }
            
            /* jshint ignore:start */
            return (
                <ReactScene
                    ref="scene"
                    {...props}
                    {...this.props}
                    {...methodProps}
                    >
                    <SceneWithContext>
                        <SceneComponent ref="component" {...this.props} />
                    </SceneWithContext>
                </ReactScene>
            );
            /* jshint ignore:end */
        },
        
        createRefMethod: function(ref, method)
        {
            var refMethod = function()
            {
                if(this.refs[ref] && this.refs[ref][method])
                {
                    this.refs[ref][method].apply(null, arguments);
                }
                else
                {
                    console.warn('Method "'+method+'" not implemented on component '+getDisplayName(SceneComponent));
                }
            };
            
            if(this)
            {
                refMethod = refMethod.bind(this);
            }
            
            return refMethod;
        }
        
    };
    
    //Add methods to wrapper
    var method;
    for(var i = 0, ml = METHODS.length; i < ml; i++)
    {
        method = METHODS[i];
        screenWrapper[method] = screenWrapper.createRefMethod.call(null, 'scene', method);
    }
    
    var SceneWrapper = React.createClass(screenWrapper);
    SceneWrapper.displayName = `scene(${getDisplayName(SceneComponent)})`;
    SceneWrapper.SceneComponent = SceneComponent;
    
    return hoistStatics(SceneWrapper, SceneComponent);
};
