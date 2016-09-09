var React = require('react');
var ReactScene = require('../../src/index');

var Scene = React.createClass({
    
    getInitialState: function()
    {
        return {
            
        };
    },
    
    render: function()
    {
        return (
            <ReactScene
                {...this.props}
                load={this.load}
                build={this.build}
                resize={this.resize}
                play={this.play}
                pause={this.pause}
                end={this.end}
                destroy={this.destroy}
            >
                
            </ReactScene>
        );
    },
    
    load: function(e)
    {
        
    },
    
    build: function(e)
    {
        
    },
    
    resize: function(e)
    {
        
    },
    
    play: function(e)
    {
        var done = e.async();
        
        setTimeout(function()
        {
            done();
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

module.exports = Scene;
