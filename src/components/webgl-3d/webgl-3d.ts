import {
  ProgramData,
  createProgram,
  prepareBuffer,
  prepareProgramAttributes,
  resizeCanvasToDisplaySize,
  clear,
} from "../../webgl/utils";
import { html, css, LitElement } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import vertexShaderSource from "./vertex.glsl?raw";
import fragmentShaderSource from "./fragment.glsl?raw";
import { cubePoints, colorPoints } from "./vertexData";
import { mat4, vec3 } from "gl-matrix";
import { roundTo100 } from "../../utils";

@customElement("webgl-3d")
export class WebGL3D extends LitElement {
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
    #container {
      position: relative;
    }
    #ui {
      display: inline-block;
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
  @state() deltaZ = 0;
  @state() scale = 1;
  @state() theta = 0;

  initializeWebGL() {
    this.gl = this.canvas.getContext("webgl")!;

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

    const positionBuffer = prepareBuffer(this.gl, cubePoints);
    const colorBuffer = prepareBuffer(this.gl, colorPoints);

    this.programData = {
      program,
      attributes: [
        {
          location: positionAttributeLocation,
          buffer: positionBuffer,
          size: 3,
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
  handleZ(event: Event) {
    this.deltaZ = Number((event.target as HTMLInputElement).value);
  }
  handleScale(event: Event) {
    this.scale = Number((event.target as HTMLInputElement).value);
  }
  handleTheta(event: Event) {
    this.theta = Number((event.target as HTMLInputElement).value);
  }

  drawScene() {
    if (!this.programData) return;

    resizeCanvasToDisplaySize(this.canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    clear(this.gl, [0.9, 0.9, 0.9, 1]);

    this.gl.useProgram(this.programData.program);

    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);

    prepareProgramAttributes(this.gl, this.programData.attributes);

    const projectionMatrix = mat4.create();
    mat4.ortho(
      projectionMatrix,
      0,
      this.gl.canvas.clientWidth,
      this.gl.canvas.clientHeight,
      0,
      -600,
      600
    );
    const baseScale = 100;
    const scaleMatrix = mat4.create();
    mat4.fromScaling(
      scaleMatrix,
      vec3.fromValues(
        this.scale * baseScale,
        this.scale * baseScale,
        this.scale * baseScale
      )
    );
    const rotationMatrix = mat4.create();
    mat4.fromRotation(rotationMatrix, this.theta, vec3.fromValues(1, 1/2, 1/3));
    const translationMatrix = mat4.create();
    mat4.fromTranslation(
      translationMatrix,
      vec3.fromValues(
        this.deltaX + this.gl.canvas.clientWidth / 2,
        this.deltaY + this.gl.canvas.clientHeight / 2,
        this.deltaZ
      )
    );

    let matrix = mat4.create();
    mat4.multiply(matrix, projectionMatrix, translationMatrix);
    mat4.multiply(matrix, matrix, rotationMatrix);
    mat4.multiply(matrix, matrix, scaleMatrix);

    this.gl.uniformMatrix4fv(this.programData.uniforms.matrix, false, matrix);

    const primitiveType = this.gl.TRIANGLES;
    const offset = 0;
    const count = 36;
    this.gl.drawArrays(primitiveType, offset, count);
  }

  render() {
    this.drawScene();
    return html`
      <div id="container">
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
              id="z"
              type="range"
              min="-400"
              max="400"
              step="1"
              value=${this.deltaZ}
              @input=${this.handleZ}
            />
            <label for="z">Z</label>
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
          <div>X: <span>${this.deltaX}</span></div>
          <div>Y: <span>${this.deltaY}</span></div>
          <div>Z: <span>${this.deltaZ}</span></div>
          <div>Scale: <span>${this.scale}</span></div>
          <div>Theta: <span>${roundTo100(this.theta)}</span></div>
        </form>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "webgl-3d": WebGL3D;
  }
}
