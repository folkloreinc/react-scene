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
            <div>
                
            </div>
        );
    },
    
    load: function(e)
    {
        var done = e.async();
        
        setTimeout(function()
        {
            done();
        }, 2000);
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
        
        setTimeout(_.bind(function()
        {
            this.refs.scene.end();
        }, this), 4000);
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

module.exports = ReactScene.createScene(Scene);
