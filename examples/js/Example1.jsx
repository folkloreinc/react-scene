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
                    onRemote={this.onRemote}
                    sceneWillPlay={this.onSceneWillPlay}
                    sceneDidPlay={this.onSceneDidPlay}
                    />
            </div>
        );
    },
    
    onRemote: function(remote)
    {
        this.setState({
            remote: remote
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
    
    onClickPlay: function(e)
    {
        e.preventDefault();
        
        if(this.state.remote)
        {
            this.state.remote.play();
        }
    }
});

module.exports = Example;
