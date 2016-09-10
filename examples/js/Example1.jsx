var React = require('react');

var Scene = require('./Scene');

var Example = React.createClass({
    
    getInitialState: function()
    {
        return {
            remote: null,
            status: null
        };
    },
    
    render: function()
    {
        return (
            <div>
                <div>
                    <button type="button" onClick={this.onClickPlay}>Play</button>
                    <span>{this.state.status}</span>
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
    
    componentDidMount: function()
    {
        
    },
    
    onRemote: function(remote)
    {
        this.setState({
            remote: remote
        });
    },
    
    onSceneWillLoad: function()
    {
        this.setState({
            status: 'Will load'
        });
    },
    
    onSceneDidLoad: function()
    {
        this.setState({
            status: 'Did load'
        });
    },
    
    onSceneWillPlay: function()
    {
        this.setState({
            status: 'Will play'
        });
    },
    
    onSceneDidPlay: function()
    {
        this.setState({
            status: 'Did play'
        });
    },
    
    onSceneWillEnd: function()
    {
        this.setState({
            status: 'Will end'
        });
    },
    
    onSceneDidEnd: function()
    {
        this.setState({
            status: 'Did end'
        });
    },
    
    onClickPlay: function(e)
    {
        e.preventDefault();
        
        this.refs.scene.play();
    }
});

module.exports = Example;
