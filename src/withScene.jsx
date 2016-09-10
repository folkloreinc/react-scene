var ReactScene = require('./ReactScene');
var hoistStatics = require('hoist-non-react-statics');

function getDisplayName(WrappedComponent)
{
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

module.exports = function(WrappedComponent)
{
    var WithScene = React.createClass({
        
        contextTypes: {
            scene: React.PropTypes.object
        },
        
        render: function()
        {
            /* jshint ignore:start */
            return (
                <WrappedComponent {...this.props} scene={this.context.scene} />
            );
            /* jshint ignore:end */
        }
        
    });
    
    WithScene.displayName = `withScene(${getDisplayName(WrappedComponent)})`;
    WithScene.WrappedComponent = WrappedComponent;
    
    return hoistStatics(WithScene, WrappedComponent);
};
