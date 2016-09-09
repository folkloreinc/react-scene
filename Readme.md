React Scene
============

## Installation
```
npm install --save react-scene
```

## Usage

React Scene is a component that expose different methods to handle a typic scene logic.

The methods are:
- `load` Load everything that has to be loaded
- `build` Build the scene (if you need to create or rend any object)
- `resize` Resize the scene. It is also automatically called when the `width` or `height` props change on the scene
- `mute` To mute the scene
- `unmute` To unmute the scene
- `play` Play the scene
- `pause` Pause the scene
- `end` End the scene
- `destroy` Destroy any resources

Each method can be synchronous or asynchronous and will trigger lifecycle methods on the parent listening to them. Those lifecycles methods are in the following format `sceneWill[Method]` and `sceneDid[Method]` (Ex: `sceneWillLoad`, `sceneDidLoad`)

### Basic usage

##### Creating a scene component

```js

var React = require('react');
var ReactScene = require('react-scene');
var createjs = require('preload-js');

var Scene = React.createClass({
    
    render: function()
    {
        return (
            <div>
                
            </div>
        );
    },
    
    /**
     * Scene methods
     */
    load: function(e)
    {
        // Methods can be asynchronous by either calling the async method
        // on the first argument. The async method returns a function
        // that needs to be called when the action is done. Or you can
        // also return a promise and it will automatically wait for the
        // promise completion before calling sceneDidLoad
        var done = e.async();
        
        this.preloadQueue = new createjs.LoadQueue();
        this.preloadQueue.addEventListener('complete', done);
        this.preloadQueue.loadFile({
            id: 'photo',
            src: '/photo.jpg'
        });
    },
    
    build: function(e)
    {
        
    },
    
    resize: function(e)
    {
        
    },
    
    mute: function(e)
    {
        
    },
    
    unmute: function(e)
    {
        
    },
    
    play: function(e)
    {
        var that = this;
        setTimeout(function()
        {
            // If you need to control a scene within a scene. There is a scene
            // props containing the scene methods. Calling the `end` when the
            // playback is done is a good example.
            
            that.props.scene.end();
        }, 2000);
    },
    
    pause: function(e)
    {
        
    },
    
    end: function(e)
    {
        
    },
    
    destroy: function(e)
    {
        
    }
    
});

// Calling createScene with the Component as the first argument, will wrap
// your scene component in a ReactScene Component and assure that the methods
// you define will be called and the corresponding lifecycle methods.
module.exports = ReactScene.createScene(Scene);

```

##### Using the scene component

```js

var React = require('react');
var Scene = require('./Scene');

var Story = React.createClass({
    
    render: function()
    {
        return (
            <div>
                <Scene
                    sceneWillLoad={this.onSceneWillLoad}
                    sceneDidLoad={this.onSceneDidLoad}
                    sceneWillPlay={this.onSceneWillPlay}
                    sceneDidPlay={this.onSceneDidPlay}
                    />
            </div>
        );
    },
    
    onSceneWillLoad: function()
    {
        console.log('Scene will load');
    },
    
    onSceneDidLoad: function()
    {
        console.log('Scene did load');
    },
    
    onSceneWillPlay: function()
    {
        console.log('Scene will play');
    },
    
    onSceneDidPlay: function()
    {
        console.log('Scene did play');
    }
    
});

module.exports = Story;

```

##### Controlling the scene

```js

var React = require('react');
var Scene = require('./Scene');

var Story = React.createClass({
    
    getInitialState: function()
    {
        return {
            remote: null
        };
    },
    
    render: function()
    {
        return (
            <div>
                <div>
                    <button type="button" onClick={this.onClickPlay}>Play</button>
                </div>
                <Scene
                    ref="scene"
                    onRemote={this.onRemote}
                    sceneWillLoad={this.onSceneWillLoad}
                    sceneDidLoad={this.onSceneDidLoad}
                    sceneWillPlay={this.onSceneWillPlay}
                    sceneDidPlay={this.onSceneDidPlay}
                    sceneWillEnd={this.onSceneWillEnd}
                    sceneDidEnd={this.onSceneDidEnd}
                    />
            </div>
        );
    },
    
    onClickPlay: function(e)
    {
        e.preventDefault();
        
        // Scene methods can be called either by using a `ref` 
        this.refs.scene.play();
        
        // or using the remote provided by the `onRemote`
        this.state.remote.play();
    },
    
    onRemote: function(remote)
    {
        // When providing an onRemote props to a scene, the function
        // is called with a remote object as the first argument. This
        // object has every scene methods. It can be stored in the state
        // for later use.
        this.setState({
            remote: remote
        });
    },
    
    onSceneWillLoad: function()
    {
        console.log('Scene will load');
    },
    
    onSceneDidLoad: function()
    {
        console.log('Scene did load');
    },
    
    onSceneWillPlay: function()
    {
        console.log('Scene will play');
    },
    
    onSceneDidPlay: function()
    {
        console.log('Scene did play');
    },
    
    onSceneWillEnd: function()
    {
        console.log('Scene will end');
    },
    
    onSceneDidEnd: function()
    {
        console.log('Scene did end');
    }
    
});

module.exports = Story;

```
