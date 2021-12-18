import { render, html } from "lit";
var styles = "";
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}
function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
  var program = gl.createProgram();
  gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexShaderSource));
  gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource));
  gl.linkProgram(program);
  return program;
}
function clear(gl, color) {
  gl.clearColor(...color);
  gl.clear(gl.COLOR_BUFFER_BIT);
}
function resizeCanvasToDisplaySize(canvas2) {
  const displayWidth = canvas2.clientWidth;
  const displayHeight = canvas2.clientHeight;
  const needResize = canvas2.width !== displayWidth || canvas2.height !== displayHeight;
  if (needResize) {
    canvas2.width = displayWidth;
    canvas2.height = displayHeight;
  }
  return needResize;
}
function prepareBuffer(gl, vertexData) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
  return buffer;
}
function prepareProgramAttributes(gl, attributes) {
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
var vertexSource = "attribute vec2 a_position;\nattribute vec4 a_color;\n\nuniform vec2 u_resolution;\nuniform vec2 u_translation;\n\nvarying vec4 v_color;\n\nvoid main() {\n      // convert the position from pixels to 0.0 to 1.0\n  vec2 zeroToOne = a_position / u_resolution;\n\n      // convert from 0->1 to 0->2\n  vec2 zeroToTwo = zeroToOne * 2.0;\n\n      // convert from 0->2 to -1->+1 (clip space)\n  vec2 clipSpace = zeroToTwo - 1.0;\n\n  gl_Position = vec4((clipSpace + u_translation) * vec2(1, -1), 0, 1);\n  v_color = a_color;\n}";
var fragmentSource = "precision mediump float;\n\nvarying vec4 v_color;\n\nvoid main() {\n  gl_FragColor = v_color;\n}";
function startApp(canvas2) {
  const gl = canvas2.getContext("webgl");
  const rectangleProgram = createProgram(gl, vertexSource, fragmentSource);
  const positionAttributeLocation = gl.getAttribLocation(rectangleProgram, "a_position");
  const colorAttributeLocation = gl.getAttribLocation(rectangleProgram, "a_color");
  const resolutionUniformLocation = gl.getUniformLocation(rectangleProgram, "u_resolution");
  const translationUniformLocation = gl.getUniformLocation(rectangleProgram, "u_translation");
  const rectX = 10;
  const rectY = 10;
  const width = 500;
  const height = 200;
  const positionBuffer = prepareBuffer(gl, [
    ...[rectX, rectY],
    ...[rectX + width, rectY],
    ...[rectX, rectY + height],
    ...[rectX + width, rectY + height]
  ]);
  const colorBuffer = prepareBuffer(gl, [
    ...[1, 0, 0, 1],
    ...[1, 1, 0, 1],
    ...[0, 1, 0, 1],
    ...[0, 1, 1, 1]
  ]);
  const programData = {
    program: rectangleProgram,
    attributes: [
      {
        location: positionAttributeLocation,
        buffer: positionBuffer,
        size: 2
      },
      {
        location: colorAttributeLocation,
        buffer: colorBuffer,
        size: 4
      }
    ],
    uniforms: [
      {
        location: resolutionUniformLocation
      },
      {
        location: translationUniformLocation
      }
    ]
  };
  const ui = document.querySelector("#ui");
  render(renderUI(canvas2, gl, programData, 0, 0), ui);
  drawScene(canvas2, gl, programData, 0, 0);
}
function renderUI(canvas2, gl, programData, deltaX, deltaY) {
  const handleXInput = (event) => {
    const deltaX2 = event.target.value;
    const deltaY2 = document.querySelector("#y").value;
    drawScene(canvas2, gl, programData, deltaX2, Number(deltaY2));
  };
  const handleYInput = (event) => {
    const deltaX2 = document.querySelector("#x").value;
    const deltaY2 = event.target.value;
    drawScene(canvas2, gl, programData, Number(deltaX2), deltaY2);
  };
  return html`
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
  `;
}
function drawScene(canvas2, gl, programData, deltaX, deltaY) {
  resizeCanvasToDisplaySize(canvas2);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  clear(gl, [0, 0, 0, 0]);
  drawRectangle(gl, programData, deltaX, deltaY);
}
function drawRectangle(gl, programData, deltaX, deltaY) {
  gl.useProgram(programData.program);
  prepareProgramAttributes(gl, programData.attributes);
  gl.uniform2f(programData.uniforms[0].location, gl.canvas.width, gl.canvas.height);
  gl.uniform2f(programData.uniforms[1].location, deltaX, deltaY);
  {
    const primitiveType = gl.TRIANGLE_STRIP;
    const offset = 0;
    const count = 4;
    gl.drawArrays(primitiveType, offset, count);
  }
}
const canvas = document.querySelector("#canvas");
startApp(canvas);
