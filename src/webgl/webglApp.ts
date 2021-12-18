import { html, render } from "lit";
import {
  createProgram,
  resizeCanvasToDisplaySize,
  clear,
  prepareBuffer,
  prepareProgramAttributes,
  ProgramData,
} from "./utils";

import vertexSource from "./shaders/vertex.glsl?raw";
import fragmentSource from "./shaders/fragment.glsl?raw";

export function startApp(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl")!;
  const rectangleProgram = createProgram(gl, vertexSource, fragmentSource);

  // Lookup attribute and uniform locations
  const positionAttributeLocation = gl.getAttribLocation(
    rectangleProgram,
    "a_position"
  );
  const colorAttributeLocation = gl.getAttribLocation(
    rectangleProgram,
    "a_color"
  );
  const resolutionUniformLocation = gl.getUniformLocation(
    rectangleProgram,
    "u_resolution"
  )!;
  const translationUniformLocation = gl.getUniformLocation(
    rectangleProgram,
    "u_translation"
  )!;

  // Create attribute buffers and set vertex data
  const rectX = 10;
  const rectY = 10;
  const width = 500;
  const height = 200;

  const positionBuffer = prepareBuffer(gl, [
    ...[rectX, rectY],
    ...[rectX + width, rectY],
    ...[rectX, rectY + height],
    ...[rectX + width, rectY + height],
  ]);
  const colorBuffer = prepareBuffer(gl, [
    ...[1, 0, 0, 1], // Red
    ...[1, 1, 0, 1], // Yellow
    ...[0, 1, 0, 1], // Green
    ...[0, 1, 1, 1], // Blue
  ]);

  const programData: ProgramData = {
    program: rectangleProgram,
    attributes: [
      {
        location: positionAttributeLocation,
        buffer: positionBuffer,
        size: 2,
      },
      {
        location: colorAttributeLocation,
        buffer: colorBuffer,
        size: 4,
      },
    ],
    uniforms: [
      {
        location: resolutionUniformLocation,
      },
      {
        location: translationUniformLocation,
      },
    ],
  };

  // Above this point is initialization

  // Below this point is rendering

  const ui = document.querySelector<HTMLDivElement>("#ui")!;
  render(html`<p>Test</p>`, ui);
  drawScene(canvas, gl, programData);
}

function drawScene(
  canvas: HTMLCanvasElement,
  gl: WebGLRenderingContext,
  programData: ProgramData
) {
  resizeCanvasToDisplaySize(canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  clear(gl, [0, 0, 0, 0]);
  drawRectangle(gl, programData);
}

function drawRectangle(gl: WebGLRenderingContext, programData: ProgramData) {
  gl.useProgram(programData.program);

  prepareProgramAttributes(gl, programData.attributes);

  // Resolution Uniform
  gl.uniform2f(
    programData.uniforms[0].location,
    gl.canvas.width,
    gl.canvas.height
  );

  // Translation Uniform
  gl.uniform2f(programData.uniforms[1].location, 0, 0);

  // Draw
  {
    const primitiveType = gl.TRIANGLE_STRIP;
    const offset = 0;
    const count = 4;
    gl.drawArrays(primitiveType, offset, count);
  }
}
