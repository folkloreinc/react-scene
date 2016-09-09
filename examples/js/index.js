var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');

var Examples = require('./examples');

$(function()
{
    var exampleIndex = 0;
    
    var exampleEl = $('#app')[0];
    function renderExample()
    {
        var Example = Examples[exampleIndex];
        var example = React.createElement(Example);
        ReactDOM.render(example, exampleEl);
    }
    renderExample();
    $(document).on('click', function(e)
    {
        e.preventDefault();
        
        exampleIndex = exampleIndex === Examples.length-1 ? 0:(exampleIndex+1);
        renderExample();
    });
});
