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
  const program = createProgram(gl, vertexSource, fragmentSource);

  // Lookup attribute and uniform locations
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  )!;

  // Create attribute buffers and set vertex data
  const positionBuffer = prepareBuffer(gl, [
    ...[10, 20],
    ...[500, 20],
    ...[10, 200],
    ...[500, 200],
  ]);
  const colorBuffer = prepareBuffer(gl, [
    ...[1, 0, 0, 1], // Red
    ...[1, 1, 0, 1], // Yellow
    ...[0, 1, 0, 1], // Green
    ...[0, 1, 1, 1], // Blue
  ]);

  const programData: ProgramData = {
    program: program,
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
    ],
  };

  // Above this point is initialization

  // Below this point is rendering

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

  // Resolution Uniform update
  gl.uniform2f(
    programData.uniforms[0].location,
    gl.canvas.width,
    gl.canvas.height
  );

  // Draw
  {
    const primitiveType = gl.TRIANGLE_STRIP;
    const offset = 0;
    const count = 4;
    gl.drawArrays(primitiveType, offset, count);
  }
}
