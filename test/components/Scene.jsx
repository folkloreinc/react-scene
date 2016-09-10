var React = require('react');
var ReactScene = require('../../src/index');

var ChildScene = require('./ChildScene');

var Scene = React.createClass({
    render: function()
    {
        return (
            <ChildScene />
        );
    },
    
    play: function()
    {
        
    }
});

module.exports = ReactScene.createScene(Scene, {}, ['play']);
