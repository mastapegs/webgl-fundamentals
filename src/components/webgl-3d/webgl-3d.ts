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

    const cubePoints = [
      // F
      ...[0, 0, 1],
      ...[1, 0, 1],
      ...[1, 1, 1],

      ...[1, 0, 1],
      ...[1, 1, 1],
      ...[0, 1, 1],

      // B
      ...[1, 0, 0],
      ...[0, 0, 0],
      ...[1, 1, 0],

      ...[1, 1, 0],
      ...[1, 0, 0],
      ...[0, 1, 0],

      // L
      ...[0, 0, 0],
      ...[0, 0, 1],
      ...[0, 1, 1],

      ...[0, 0, 0],
      ...[0, 1, 1],
      ...[0, 1, 0],

      // R
      ...[1, 0, 1],
      ...[1, 0, 0],
      ...[1, 1, 1],

      ...[1, 1, 1],
      ...[1, 0, 0],
      ...[1, 1, 0],

      // U
      ...[0, 1, 0],
      ...[1, 1, 1],
      ...[1, 1, 0],

      ...[0, 1, 0],
      ...[0, 1, 1],
      ...[1, 1, 1],

      // D
      ...[0, 0, 0],
      ...[1, 0, 0],
      ...[1, 0, 1],

      ...[1, 0, 1],
      ...[0, 0, 1],
      ...[0, 0, 0],
    ];

    const colorPoints = [
      // F
      ...[1, 0, 0, 1], // Red
      ...[1, 0, 0, 1], // Red
      ...[1, 0, 0, 1], // Red
      ...[1, 0, 0, 1], // Red
      ...[1, 0, 0, 1], // Red
      ...[1, 0, 0, 1], // Red

      // B
      ...[1, 1, 0, 1], // Yellow
      ...[1, 1, 0, 1], // Yellow
      ...[1, 1, 0, 1], // Yellow
      ...[1, 1, 0, 1], // Yellow
      ...[1, 1, 0, 1], // Yellow
      ...[1, 1, 0, 1], // Yellow

      // L
      ...[0, 1, 0, 1], // Green
      ...[0, 1, 0, 1], // Green
      ...[0, 1, 0, 1], // Green
      ...[0, 1, 0, 1], // Green
      ...[0, 1, 0, 1], // Green
      ...[0, 1, 0, 1], // Green

      // R
      ...[0, 1, 1, 1], // Cyan
      ...[0, 1, 1, 1], // Cyan
      ...[0, 1, 1, 1], // Cyan
      ...[0, 1, 1, 1], // Cyan
      ...[0, 1, 1, 1], // Cyan
      ...[0, 1, 1, 1], // Cyan

      // U
      ...[0, 0, 1, 1], // Blue
      ...[0, 0, 1, 1], // Blue
      ...[0, 0, 1, 1], // Blue
      ...[0, 0, 1, 1], // Blue
      ...[0, 0, 1, 1], // Blue
      ...[0, 0, 1, 1], // Blue

      // D
      ...[1, 0, 1, 1], // Magenta
      ...[1, 0, 1, 1], // Magenta
      ...[1, 0, 1, 1], // Magenta
      ...[1, 0, 1, 1], // Magenta
      ...[1, 0, 1, 1], // Magenta
      ...[1, 0, 1, 1], // Magenta
    ];

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

  drawScene() {
    if (!this.programData) return;

    resizeCanvasToDisplaySize(this.canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    clear(this.gl, [0.9, 0.9, 0.9, 1]);

    this.gl.useProgram(this.programData.program);

    this.gl.enable(this.gl.CULL_FACE);

    prepareProgramAttributes(this.gl, this.programData.attributes);

    
  }

  render() {
    this.drawScene();
    return html`
      <div id="container">
        <canvas></canvas>
        <div id="ui">UI</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "webgl-3d": WebGL3D;
  }
}
