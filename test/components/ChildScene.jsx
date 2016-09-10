var React = require('react');
var ReactScene = require('../../src/index');

var ChildScene = React.createClass({
    render: function()
    {
        return (
            <div />
        );
    },
    
    play: function()
    {
        
    }
});

module.exports = ReactScene.createScene(ChildScene, {}, ['play']);
