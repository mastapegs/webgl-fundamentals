import { html, css, LitElement } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { mat3, vec2 } from "gl-matrix";
import {
  createProgram,
  prepareBuffer,
  prepareProgramAttributes,
  ProgramData,
  resizeCanvasToDisplaySize,
  clear,
} from "../../webgl/utils";
import vertexShaderSource from "./vertex.glsl?raw";
import fragmentShaderSource from "./fragment.glsl?raw";
import { roundTo100 } from "../../utils";

@customElement("webgl-app")
export class WebGLApp extends LitElement {
  static styles = css`
    :host {
      width: 100%;
      height: 100%;
    }
    canvas {
      width: 100%;
      height: 100vh;
      display: block;
    }
    #ui {
      background-color: hsla(0, 0%, 100%, 0.75);
      padding: 8px;
      position: absolute;
      top: 20px;
      right: 20px;
      border: 1px solid hsla(0, 0%, 0%, 0.5);
      border-radius: 8px;
      box-shadow: 5px 5px 5px 5px hsla(0, 0%, 0%, 0.5);
    }
  `;

  @query("canvas") canvas!: HTMLCanvasElement;
  @state() gl!: WebGLRenderingContext;
  @state() programData!: ProgramData;
  @state() deltaX = 0;
  @state() deltaY = 0;
  @state() theta = 0;
  @state() scale = 1;

  initializeWebGL() {
    this.gl = this.canvas.getContext("webgl")!;

    const translatePoint = (
      point: [number, number],
      dX: number,
      dY: number
    ): [number, number] => [point[0] + dX, point[1] + dY];

    const triangleSize = 150;
    const dX = triangleSize * -0.5;
    const dY = -0.5 * triangleSize * Math.cos(Math.PI / 3);
    const equilateralTrianglePoints = [
      ...translatePoint([0, 0], dX, dY),
      ...translatePoint([triangleSize, 0], dX, dY),
      ...translatePoint(
        [
          triangleSize * Math.cos(Math.PI / 3),
          triangleSize * Math.sin(Math.PI / 3),
        ],
        dX,
        dY
      ),
    ];
    const positionBuffer = prepareBuffer(this.gl, equilateralTrianglePoints);

    const colors = [...[1, 0, 0, 1], ...[0, 1, 0, 1], ...[0, 0, 1, 1]];
    const colorBuffer = prepareBuffer(this.gl, colors);
    
    const program = createProgram(
      this.gl,
      vertexShaderSource,
      fragmentShaderSource
    );
    
    const positionAttributeLocation = this.gl.getAttribLocation(
      program,
      "a_position"
    );
    const colorAttributeLocation = this.gl.getAttribLocation(
      program,
      "a_color"
    );
    const matrixUniformLocation = this.gl.getUniformLocation(
      program,
      "u_matrix"
    )!;

    this.programData = {
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
      uniforms: {
        matrix: matrixUniformLocation,
      },
    };
  }

  connectedCallback(): void {
    super.connectedCallback();
    setTimeout(() => this.initializeWebGL());
  }

  handleX(event: Event) {
    this.deltaX = Number((event.target as HTMLInputElement).value);
  }
  handleY(event: Event) {
    this.deltaY = Number((event.target as HTMLInputElement).value);
  }
  handleTheta(event: Event) {
    this.theta = Number((event.target as HTMLInputElement).value);
  }
  handleScale(event: Event) {
    this.scale = Number((event.target as HTMLInputElement).value);
  }

  drawScene() {
    if (this.programData) {
      resizeCanvasToDisplaySize(this.canvas);
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

      clear(this.gl, [0.9, 0.9, 0.9, 1]);

      this.gl.useProgram(this.programData.program);
      prepareProgramAttributes(this.gl, this.programData.attributes);

      const projectionMatrix = mat3.create();
      mat3.projection(
        projectionMatrix,
        this.gl.canvas.clientWidth,
        this.gl.canvas.clientHeight
      );
      const scaleMatrix = mat3.create();
      mat3.fromScaling(scaleMatrix, vec2.fromValues(this.scale, -this.scale));
      const rotationMatrix = mat3.create();
      mat3.fromRotation(rotationMatrix, this.theta);
      const translationMatrix = mat3.create();
      mat3.fromTranslation(
        translationMatrix,
        vec2.fromValues(
          this.deltaX + this.gl.canvas.clientWidth / 2,
          this.deltaY + this.gl.canvas.clientHeight / 2
        )
      );

      let matrix = mat3.create();
      mat3.multiply(matrix, projectionMatrix, translationMatrix);
      mat3.multiply(matrix, matrix, rotationMatrix);
      mat3.multiply(matrix, matrix, scaleMatrix);

      this.gl.uniformMatrix3fv(this.programData.uniforms.matrix, false, matrix);

      const primitiveType = this.gl.TRIANGLES;
      const offset = 0;
      const count = 3;
      this.gl.drawArrays(primitiveType, offset, count);
    }
  }

  render() {
    this.drawScene();
    return html`
      <canvas></canvas>
      <form id="ui">
        <div>
          <input
            id="x"
            type="range"
            min="-240"
            max="240"
            step="1"
            value=${this.deltaX}
            @input=${this.handleX}
          />
          <label for="x">X</label>
        </div>
        <div>
          <input
            id="y"
            type="range"
            min="-320"
            max="320"
            step="1"
            value=${this.deltaY}
            @input=${this.handleY}
          />
          <label for="y">Y</label>
        </div>
        <div>
          <input
            id="theta"
            type="range"
            min=${Math.PI * -2}
            max=${Math.PI * 2}
            step="0.01"
            value=${this.theta}
            @input=${this.handleTheta}
          />
          <label for="theta">Theta</label>
        </div>
        <div>
          <input
            id="scale"
            type="range"
            min="0"
            max="2"
            step="0.01"
            value=${this.scale}
            @input=${this.handleScale}
          />
          <label for="scale">Scale</label>
        </div>
        <div>X: <span>${this.deltaX}</span></div>
        <div>Y: <span>${this.deltaY}</span></div>
        <div>Theta: <span>${roundTo100(this.theta)}</span></div>
        <div>Scale: <span>${roundTo100(this.scale)}</span></div>
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "webgl-app": WebGLApp;
  }
}
