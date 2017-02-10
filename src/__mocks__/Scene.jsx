import React from 'react';
import { createScene } from '../index';
import ChildScene from './ChildScene';

const Scene = () => (
    <ChildScene />
);

export default createScene(Scene, {}, ['play']);
