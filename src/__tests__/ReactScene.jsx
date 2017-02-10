import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import pascal from 'pascal-case';

import createReactScene from '../createReactScene';
import ReactScene from '../ReactScene';

const DEFAULT_METHODS = createReactScene.DEFAULT_METHODS;
const lifecycleMethods = DEFAULT_METHODS.map((method) => {
    const pascalMethod = pascal(method);
    return `sceneWill${pascalMethod}, sceneDid${pascalMethod}`;
}).join(', ');

describe('ReactScene', () => {
    test('is a ReactScene Component', () => {
        const wrapper = mount(
            <ReactScene>
                <div />
            </ReactScene>,
        );
        expect(wrapper.instance()).toBeInstanceOf(ReactScene);
        expect(wrapper.name()).toEqual('ReactScene');
    });

    test(`has propTypes for default methods (${DEFAULT_METHODS.join(', ')})`, () => {
        const wrapper = mount(
            <ReactScene>
                <div />
            </ReactScene>,
        );
        const type = wrapper.type();
        DEFAULT_METHODS.forEach((method) => {
            expect(type.propTypes[method]).toEqual(React.PropTypes.func);
        });
    });

    test(`has propTypes for default lifecycle methods (${lifecycleMethods})`, () => {
        const wrapper = mount(
            <ReactScene>
                <div />
            </ReactScene>,
        );
        const type = wrapper.type();
        DEFAULT_METHODS.forEach((method) => {
            const methodPascal = pascal(method);

            expect(type.propTypes[`sceneWill${methodPascal}`]).toEqual(React.PropTypes.func);
            expect(type.propTypes[`sceneDid${methodPascal}`]).toEqual(React.PropTypes.func);
        });
    });

    test('calls provided method when calling a scene method', () => {
        const play = sinon.spy();

        const wrapper = mount(
            <ReactScene play={play}>
                <div />
            </ReactScene>,
        );

        wrapper.instance().play();

        expect(play.called).toEqual(true);
    });

    test('passes an event object with async method when a scene method is called', () => {
        const play = sinon.spy();

        const wrapper = mount(
            <ReactScene play={play}>
                <div />
            </ReactScene>,
        );

        wrapper.instance().play();

        expect(play.args[0][0]).toEqual(expect.objectContaining({
            async: expect.any(Function),
        }));
    });

    test('passes argument when a scene method is called', () => {
        const play = sinon.spy();

        const wrapper = mount(
            <ReactScene play={play}>
                <div />
            </ReactScene>,
        );

        wrapper.instance().play('argument');

        expect(play.args[0][1]).toEqual('argument');
    });

    test('calls lifecycle methods when calling a scene method', () => {
        const sceneWillPlay = sinon.spy();
        const sceneDidPlay = sinon.spy();

        const wrapper = mount(
            <ReactScene sceneWillPlay={sceneWillPlay} sceneDidPlay={sceneDidPlay}>
                <div />
            </ReactScene>,
        );

        wrapper.instance().play();

        expect(sceneWillPlay.called).toEqual(true);
        expect(sceneDidPlay.called).toEqual(true);
    });

    test('waits for done to be called when async is called in a method', () => {
        const sceneWillPlay = sinon.spy();
        const sceneDidPlay = sinon.spy();

        let done;
        const play = sinon.spy((e) => {
            done = e.async();
        });

        const wrapper = mount(
            <ReactScene play={play} sceneWillPlay={sceneWillPlay} sceneDidPlay={sceneDidPlay}>
                <div />
            </ReactScene>,
        );

        wrapper.instance().play();

        expect(sceneWillPlay.called).toEqual(true);
        expect(sceneDidPlay.called).toEqual(false);

        done();

        expect(sceneDidPlay.called).toEqual(true);
    });
});
