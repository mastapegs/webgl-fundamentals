export type Color = [number, number, number, number];

export interface ProgramData {
  program: WebGLProgram;
  attributes: AttributeData[];
  uniforms: UniformData;
}

export interface AttributeData {
  location: number;
  buffer: WebGLBuffer;
  size: number;
}

export interface UniformData {
  [key: string]: WebGLUniformLocation;
}

export function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

export function createProgram(
  gl: WebGLRenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string
) {
  var program = gl.createProgram()!;
  gl.attachShader(
    program,
    createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  );
  gl.attachShader(
    program,
    createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  );
  gl.linkProgram(program);
  return program;
}

export function clear(gl: WebGLRenderingContext, color: Color) {
  gl.clearColor(...color);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  const needResize =
    canvas.width !== displayWidth || canvas.height !== displayHeight;

  if (needResize) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}

export function prepareBuffer(gl: WebGLRenderingContext, vertexData: number[]) {
  const buffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
  return buffer;
}

export function prepareProgramAttributes(
  gl: WebGLRenderingContext,
  attributes: AttributeData[]
) {
  attributes.forEach(({ location, buffer, size }) => {
    gl.enableVertexAttribArray(location);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
  });
}

export interface Attribute {
  name: string;
  buffer: WebGLBuffer;
  numComponents: number;
}

export function createAttributeSetters(
  gl: WebGLRenderingContext,
  program: WebGLProgram
) {
  const attributeSetter = (attributes: Attribute[]): void => {
    attributes.forEach(({ name, buffer, numComponents }) => {
      const location = gl.getAttribLocation(program, name);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(location);
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.vertexAttribPointer(
        location,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
    });
  };
  return attributeSetter;
}

export function createUniformSetters(
  gl: WebGLRenderingContext,
  program: WebGLProgram
) {}
