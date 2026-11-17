import React from 'react';
import {Composition} from 'remotion';
import {NekotailPromo} from './Video';
export const Root: React.FC = () => <Composition id="NekotailPromo" component={NekotailPromo} width={1920} height={1080} fps={30} durationInFrames={720}/>;
