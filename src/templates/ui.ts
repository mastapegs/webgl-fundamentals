import { html } from "lit";
import { ProgramData } from "./../webgl/utils/index";

export function renderUI(
  canvas: HTMLCanvasElement,
  gl: WebGLRenderingContext,
  programData: ProgramData,
  deltaX: number,
  deltaY: number,
  drawScene: any
) {
  const handleXInput = (event: any) => {
    const deltaX = event.target.value;
    const deltaY = document.querySelector<HTMLInputElement>("#y")!.value;
    drawScene(canvas, gl, programData, deltaX, Number(deltaY));
  };
  const handleYInput = (event: any) => {
    const deltaX = document.querySelector<HTMLInputElement>("#x")!.value;
    const deltaY = event.target.value;
    drawScene(canvas, gl, programData, Number(deltaX), deltaY);
  };
  return html`
    <div>
      <label for="x">X</label>
      <input
        id="x"
        type="range"
        min="0"
        max="1"
        step="0.005"
        value=${String(deltaX)}
        @input=${handleXInput}
      />
    </div>
    <div>
      <label for="y">Y</label>
      <input
        id="y"
        type="range"
        min="0"
        max="1"
        step="0.005"
        value=${String(deltaY)}
        @input=${handleYInput}
      />
    </div>
  `;
}
