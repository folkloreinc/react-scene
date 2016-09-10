var React = require('react');

var DEFAULT_METHODS = [
    'load',
    'build',
    'resize',
    'mute',
    'unmute',
    'play',
    'pause',
    'end',
    'destroy'
];

function createReactScene(METHODS)
{
    if(typeof(METHODS) === 'undefined')
    {
        METHODS = DEFAULT_METHODS;
    }
    
    var reactScene = {
        
        propTypes: {
            
            width: React.PropTypes.number,
            height: React.PropTypes.number,
            
            // loadOnMount: React.PropTypes.bool,
            // buildOnLoad: React.PropTypes.bool,
            // playOnBuild: React.PropTypes.bool,
            
            onRemote: React.PropTypes.func
            
        },
        
        childContextTypes: {
            scene: React.PropTypes.object
        },
        
        contextTypes: {
            scene: React.PropTypes.object
        },
        
        getChildContext: function()
        {
            var scene = {
                parent: this.context.scene || null
            };
            
            var method;
            for(var i = 0, ml = METHODS.length; i < ml; i++)
            {
                method = METHODS[i];
                scene[method] = this[method];
            }
            
            return {
                scene: scene
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
            
            if(this.load && this.props.loadOnMount)
            {
                var load = this.load;
                setTimeout(function()
                {
                    load();
                }, 1);
            }
        },
        
        componentWillUnmount: function()
        {
            if(this.destroy && this.props.destroyOnUnmount)
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
            
            if(this.resize)
            {
                var sizeChanged = prevProps.width !== this.props.width || prevProps.height !== this.props.height;
                if(sizeChanged)
                {
                    this.resize();
                }
            }
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
            
            var done = function()
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
                
            }.bind(this);
            
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
                var methodArgs = [obj].concat(args);
                var methodReturn = this.props[methodName].apply(null, methodArgs);
                if(methodReturn && methodReturn.then)
                {
                    var promiseDone = obj.async();
                    methodReturn.then(promiseDone);
                }
            }
            
            //If the call is not async, it's done
            if(!isAsync)
            {
                done();
            }
        },
        
        createRemote: function()
        {
            var remote = {};
            var method;
            for(var i = 0, ml = METHODS.length; i < ml; i++)
            {
                method = METHODS[i];
                remote[method] = this[method];
            }
            
            return remote;
        },
        
        /**
         * Scene lifecycle
         */
        sceneDidLoad: function()
        {
            if(this.build && this.props.buildOnLoad)
            {
                this.build();
            }
        },
        
        sceneDidBuild: function()
        {
            if(this.play && this.props.playOnBuild)
            {
                this.play();
            }
        }
        
    };
    
    function createSceneMethod(method)
    {
        return function()
        {
            var args = [];
            for(var i = 0, al = arguments.length; i < al; i++)
            {
                args.push(arguments[i]);
            }
            this.callSceneMethod(method, args);
        };
    }
    
    var method, methodPascal;
    for(var i = 0, ml = METHODS.length; i < ml; i++)
    {
        method = METHODS[i];
        methodPascal = method.replace(/(\w)(\w*)/g, function(g0,g1,g2)
        {
            return g1.toUpperCase() + g2.toLowerCase();
        });
        
        //PropTypes
        reactScene.propTypes[method] = React.PropTypes.func;
        reactScene.propTypes['sceneWill'+methodPascal] = React.PropTypes.func;
        reactScene.propTypes['sceneDid'+methodPascal] = React.PropTypes.func;
        if(method === 'destroy')
        {
            reactScene.propTypes.destroyOnUnmount = React.PropTypes.bool;
        }
        else if(method === 'build')
        {
            reactScene.propTypes.buildOnLoad = React.PropTypes.bool;
        }
        else if(method === 'load')
        {
            reactScene.propTypes.loadOnMount = React.PropTypes.bool;
        }
        
        // Methods
        reactScene[method] = createSceneMethod(method);
    }
    
    var ReactScene = React.createClass(reactScene);
    ReactScene.displayName = 'ReactScene';
    
    return ReactScene;
}

createReactScene.DEFAULT_METHODS = DEFAULT_METHODS;

module.exports = createReactScene;
