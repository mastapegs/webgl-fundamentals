import {
  createProgram,
  resizeCanvasToDisplaySize,
  clear,
  prepareBuffer,
  prepareProgramAttributes,
  ProgramData,
} from "./webgl-utils";

export function startApp(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl")!;
  const program = createProgram(
    gl,
    `
    attribute vec2 a_position;
    attribute vec4 a_color;

    uniform vec2 u_resolution;
    
    varying vec4 v_color;
    
    void main() {
      // convert the position from pixels to 0.0 to 1.0
      vec2 zeroToOne = a_position / u_resolution;
  
      // convert from 0->1 to 0->2
      vec2 zeroToTwo = zeroToOne * 2.0;
  
      // convert from 0->2 to -1->+1 (clip space)
      vec2 clipSpace = zeroToTwo - 1.0;
  
      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      v_color = a_color;
    }
    `,
    `
    precision mediump float;

    varying vec4 v_color;
    
    void main() {
      gl_FragColor = v_color;
    }
    `
  );

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
    program,
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
