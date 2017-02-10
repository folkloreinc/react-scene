import React, { Component } from 'react';
import { createScene } from '../index';

class ChildScene extends Component {
    play() {

    }

    render() {
        return (
            <div />
        );
    }
}

export default createScene(ChildScene, {}, ['play']);
