import type { SceneData } from './types';
import { geometricScene } from './geometricData';
import { streetScene } from './streetData';

export const SCENES: SceneData[] = [
  geometricScene,
  streetScene,
];

export type { SceneData, SceneLayer } from './types';
