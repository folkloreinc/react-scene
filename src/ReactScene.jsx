var React = require('react');
var changeCase = require('change-case');

var ReactScene = React.createClass({
    
    propTypes: {
        
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        
        buildOnMount: React.PropTypes.bool,
        
        load: React.PropTypes.func,
        build: React.PropTypes.func,
        resize: React.PropTypes.func,
        play: React.PropTypes.func,
        pause: React.PropTypes.func,
        end: React.PropTypes.func,
        destroy: React.PropTypes.func,
        
        onRemote: React.PropTypes.func,
        
        //Scene lifecycle
        sceneWillLoad: React.PropTypes.func,
        sceneDidLoad: React.PropTypes.func,
        sceneWillBuild: React.PropTypes.func,
        sceneDidBuild: React.PropTypes.func,
        sceneWillResize: React.PropTypes.func,
        sceneDidResize: React.PropTypes.func,
        sceneWillPlay: React.PropTypes.func,
        sceneDidPlay: React.PropTypes.func,
        sceneWillPause: React.PropTypes.func,
        sceneDidPause: React.PropTypes.func,
        sceneWillEnd: React.PropTypes.func,
        sceneDidEnd: React.PropTypes.func
        
    },
    
    getDefaultProps: function()
    {
        return {
            width: 0,
            height: 0,
            
            buildOnMount: true
        };
    },
    
    render: function()
    {    
        return this.props.children || null;
    },
    
    componentDidMount: function()
    {
        if(this.props.onRemote)
        {
            var remote = this.createRemote();
            this.props.onRemote(remote);
        }
        
        if(this.props.buildOnMount)
        {
            this.build();
        }
    },
    
    componentDidUpdate: function(prevProps, prevState)
    {
        var onRemoteChanged = prevProps.onRemote !== this.props.onRemote;
        if(onRemoteChanged && this.props.onRemote)
        {
            var remote = this.createRemote();
            this.props.onRemote(remote);
        }
        
        var sizeChanged = prevProps.width !== this.props.width || prevProps.height !== this.props.height;
        if(sizeChanged)
        {
            this.resize();
        }
    },
    
    load: function()
    {
        this.callSceneMethod('load');
    },
    
    build: function()
    {
        this.callSceneMethod('build');
    },
    
    resize: function()
    {
        this.callSceneMethod('resize');
    },
    
    play: function()
    {
        this.callSceneMethod('play');
    },
    
    pause: function()
    {
        this.callSceneMethod('pause');
    },
    
    end: function()
    {
        this.callSceneMethod('end');
    },
    
    destroy: function()
    {
        this.callSceneMethod('destroy');
    },
    
    callSceneMethod: function(name)
    {
        var pascalName = changeCase.pascal(name);
        var methodName = name;
        var willLoadName = 'sceneWill'+pascalName;
        var didLoadName = 'sceneDid'+pascalName;
        
        var done = _.bind(function()
        {
            if(this.props[didLoadName])
            {
                this.props[didLoadName]();
            }
        }, this);
        
        var isAsync = false;
        var obj = {
            async: function()
            {
                isAsync = true;
                return done;
            }
        };
        
        if(this.props[willLoadName])
        {
            this.props[willLoadName]();
        }
        
        if(this.props[methodName])
        {
            this.props[methodName](obj);
        }
        
        if(!isAsync)
        {
            done();
        }
    },
    
    createRemote: function()
    {
        return {
            load: this.load,
            build: this.build,
            resize: this.resize,
            play: this.play,
            pause: this.pause,
            end: this.end,
            destroy: this.destroy
        };
    }
    
});

module.exports = ReactScene;
