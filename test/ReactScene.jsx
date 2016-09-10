import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import createReactScene from '../src/createReactScene';
import ReactScene from '../src/ReactScene';

var DEFAULT_METHODS = createReactScene.DEFAULT_METHODS;
var lifecycleMethods = DEFAULT_METHODS.map(function(method)
{
    method = method.replace(/(\w)(\w*)/g, function(g0,g1,g2)
    {
        return g1.toUpperCase() + g2.toLowerCase();
    });
    return 'sceneWill'+method+', '+'sceneDid'+method;
}).join(', ');

describe('ReactScene', () => {
    
    it('is a ReactScene Component', () => {
        const wrapper = mount(
            <ReactScene>
                <div/>
            </ReactScene>
        );
        expect(wrapper.instance()).to.be.instanceof(ReactScene);
        expect(wrapper.name()).to.equal('ReactScene');
    });
    
    it('has propTypes for default methods ('+DEFAULT_METHODS.join(', ')+')', () => {
        const wrapper = mount(
            <ReactScene>
                <div/>
            </ReactScene>
        );
        var type = wrapper.type();
        var method;
        for(var i = 0, ml = DEFAULT_METHODS.length; i < ml; i++)
        {
            method = DEFAULT_METHODS[i];
            expect(type.propTypes[method]).to.equal(React.PropTypes.func);
        }
    });
    
    it('has propTypes for default lifecycle methods ('+lifecycleMethods+')', () => {
        const wrapper = mount(
            <ReactScene>
                <div/>
            </ReactScene>
        );
        var type = wrapper.type();
        var method, methodPascal;
        for(var i = 0, ml = DEFAULT_METHODS.length; i < ml; i++)
        {
            method = DEFAULT_METHODS[i];
            methodPascal = method.replace(/(\w)(\w*)/g, function(g0,g1,g2)
            {
                return g1.toUpperCase() + g2.toLowerCase();
            });
            
            expect(type.propTypes['sceneWill'+methodPascal]).to.equal(React.PropTypes.func);
            expect(type.propTypes['sceneDid'+methodPascal]).to.equal(React.PropTypes.func);
        }
    });
    
    it('calls provided method when calling a scene method', () => {
        
        var play = sinon.spy();
        
        const wrapper = mount(
            <ReactScene play={play}>
                <div/>
            </ReactScene>
        );
        
        wrapper.instance().play();
        
        expect(play.called).to.equal(true);
    });
    
    it('passes an event object with async method when a scene method is called', () => {
        
        var play = sinon.spy();
        
        const wrapper = mount(
            <ReactScene play={play}>
                <div/>
            </ReactScene>
        );
        
        wrapper.instance().play();
        
        expect(play.args[0][0]).to.have.property('async');
    });
    
    it('passes argument when a scene method is called', () => {
        
        var play = sinon.spy();
        
        const wrapper = mount(
            <ReactScene play={play}>
                <div/>
            </ReactScene>
        );
        
        wrapper.instance().play('argument');
        
        expect(play.args[0][1]).to.equal('argument');
    });
    
    it('calls lifecycle methods when calling a scene method', () => {
        
        var sceneWillPlay = sinon.spy();
        var sceneDidPlay = sinon.spy();
        
        const wrapper = mount(
            <ReactScene sceneWillPlay={sceneWillPlay} sceneDidPlay={sceneDidPlay}>
                <div/>
            </ReactScene>
        );
        
        wrapper.instance().play();
        
        expect(sceneWillPlay.called).to.equal(true);
        expect(sceneDidPlay.called).to.equal(true);
    });
    
    it('waits for done to be called when async is called in a method', () => {
        
        var sceneWillPlay = sinon.spy();
        var sceneDidPlay = sinon.spy();
        
        var done;
        var play = sinon.spy(function(e)
        {
            done = e.async();
        });
        
        const wrapper = mount(
            <ReactScene play={play} sceneWillPlay={sceneWillPlay} sceneDidPlay={sceneDidPlay}>
                <div/>
            </ReactScene>
        );
        
        wrapper.instance().play();
        
        expect(sceneWillPlay.called).to.equal(true);
        expect(sceneDidPlay.called).to.equal(false);
        
        done();
        
        expect(sceneDidPlay.called).to.equal(true);
    });
});
