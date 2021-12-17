import {
  createShader,
  createProgram,
  resizeCanvasToDisplaySize,
  clear,
} from "./webgl-utils";

export function startApp(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl")!;
  const vertexShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    `
    attribute vec2 a_position;
    uniform vec2 u_resolution;
    
    void main() {
      // convert the position from pixels to 0.0 to 1.0
      vec2 zeroToOne = a_position / u_resolution;
   
      // convert from 0->1 to 0->2
      vec2 zeroToTwo = zeroToOne * 2.0;
   
      // convert from 0->2 to -1->+1 (clip space)
      vec2 clipSpace = zeroToTwo - 1.0;
   
      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }
    `
  );

  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.5, 1.0);
    }
    `
  );

  const program = createProgram(gl, vertexShader, fragmentShader);

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [
    ...[10, 20],
    ...[80, 20],
    ...[10, 30],
    ...[10, 30],
    ...[80, 20],
    ...[80, 30],
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );

  // Above this point is initialization

  // Below this point is rendering

  resizeCanvasToDisplaySize(canvas);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  clear(gl, [0, 0, 0, 0]);

  gl.useProgram(program);

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  {
    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );
  }

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  {
    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }
}
