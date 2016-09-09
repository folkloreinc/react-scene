var React = require('react');

var ReactScene = React.createClass({
    
    propTypes: {
        
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        
        loadOnMount: React.PropTypes.bool,
        buildOnLoad: React.PropTypes.bool,
        playOnBuild: React.PropTypes.bool,
        destroyOnUnmount: React.PropTypes.bool,
        
        load: React.PropTypes.func,
        build: React.PropTypes.func,
        resize: React.PropTypes.func,
        mute: React.PropTypes.func,
        unmute: React.PropTypes.func,
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
        sceneWillMute: React.PropTypes.func,
        sceneDidMute: React.PropTypes.func,
        sceneWillUnmute: React.PropTypes.func,
        sceneDidUnmute: React.PropTypes.func,
        sceneWillPlay: React.PropTypes.func,
        sceneDidPlay: React.PropTypes.func,
        sceneWillPause: React.PropTypes.func,
        sceneDidPause: React.PropTypes.func,
        sceneWillEnd: React.PropTypes.func,
        sceneDidEnd: React.PropTypes.func
        
    },
    
    childContextTypes: {
        scene: React.PropTypes.object
    },
    
    contextTypes: {
        scene: React.PropTypes.object
    },
    
    getChildContext: function()
    {
        return {
            scene: {
                parent: this,
                load: this.load,
                build: this.build,
                resize: this.resize,
                mute: this.mute,
                unmute: this.unmute,
                play: this.play,
                pause: this.pause,
                end: this.end,
                destroy: this.destroy
            }
        };
    },
    
    getDefaultProps: function()
    {
        return {
            width: 0,
            height: 0,
            
            loadOnMount: true,
            buildOnLoad: false,
            playOnBuild: false,
            destroyOnUnmount: true
        };
    },
    
    getInitialState: function()
    {
        return {
            calling: null
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
        
        if(this.props.loadOnMount)
        {
            this.load();
        }
    },
    
    componentWillUnmount: function()
    {
        if(this.props.destroyOnUnmount)
        {
            this.destroy();
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
        this.callSceneMethod('load', arguments);
    },
    
    build: function()
    {
        this.callSceneMethod('build', arguments);
    },
    
    resize: function()
    {
        this.callSceneMethod('resize', arguments);
    },
    
    mute: function()
    {
        this.callSceneMethod('mute', arguments);
    },
    
    unmute: function()
    {
        this.callSceneMethod('unmute', arguments);
    },
    
    play: function()
    {
        this.callSceneMethod('play', arguments);
    },
    
    pause: function()
    {
        this.callSceneMethod('pause', arguments);
    },
    
    end: function()
    {
        this.callSceneMethod('end', arguments);
    },
    
    destroy: function()
    {
        this.callSceneMethod('destroy', arguments);
    },
    
    callSceneMethod: function(name, args)
    {
        if(this.state.calling === name)
        {
            return;
        }
        
        this.setState({
            calling: name
        });
        
        var pascalName = name.substr(0, 1).toUpperCase()+name.substr(1);
        var methodName = name;
        var willLoadName = 'sceneWill'+pascalName;
        var didLoadName = 'sceneDid'+pascalName;
        
        var done = _.bind(function()
        {
            this.setState({
                calling: null
            });
            
            //Call the "did" lifecycle method
            if(this.props[didLoadName])
            {
                this.props[didLoadName]();
            }
            
            if(this[didLoadName])
            {
                this[didLoadName]();
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
        
        //Calling "will" lifecycle method
        if(this.props[willLoadName])
        {
            this.props[willLoadName]();
        }
        
        //Calling method
        if(this.props[methodName])
        {
            var methodArgs = [obj].concat(_.map(args, function(arg)
            {
                return arg;
            }));
            this.props[methodName].apply(null, methodArgs);
        }
        
        //If the call is not async, it's done
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
            mute: this.mute,
            unmute: this.unmute,
            play: this.play,
            pause: this.pause,
            end: this.end,
            destroy: this.destroy
        };
    },
    
    /**
     * Scene lifecycle
     */
    sceneDidLoad: function()
    {
        if(this.props.buildOnLoad)
        {
            this.build();
        }
    },
    
    sceneDidBuild: function()
    {
        if(this.props.playOnBuild)
        {
            this.play();
        }
    }
    
});

module.exports = ReactScene;
