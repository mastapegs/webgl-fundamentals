import { ProgramData, createProgram } from "../../webgl/utils";
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
      // B

      // L
      // R
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
  }

  connectedCallback(): void {
    super.connectedCallback();
    setTimeout(() => this.initializeWebGL());
  }

  render() {
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
