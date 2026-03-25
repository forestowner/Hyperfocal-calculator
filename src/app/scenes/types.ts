export interface SceneLayer {
  distance: number;    // meters, use Infinity for sky
  svg: string;         // dark mode SVG fragment (no wrapping <svg> tag)
  svgLight?: string;   // light mode SVG fragment (optional)
}

export interface SceneData {
  id: string;
  name: string;
  layers: SceneLayer[];
}
