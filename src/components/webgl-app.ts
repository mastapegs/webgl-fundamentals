import { html, css, LitElement } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import {
  createProgram,
  prepareBuffer,
  prepareProgramAttributes,
  ProgramData,
  resizeCanvasToDisplaySize,
  clear,
} from "../webgl/utils";

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

  initializeWebGL() {
    this.gl = this.canvas.getContext("webgl")!;

    const program = createProgram(
      this.gl,
      `
      attribute vec2 a_position;
      uniform vec2 u_translation;

      varying vec2 v_position;

      void main() {
        gl_Position = vec4(a_position + u_translation, 0, 1);
        v_position = a_position;
      }
      `,
      `
      precision mediump float;
      varying vec2 v_position;

      void main() {
        // convert from clipspace -1,1 -> colorspace 0,1
        vec2 color_space = (vec2(10, 10) * v_position + vec2(1, 1)) / vec2(2, 2);

        gl_FragColor = vec4(color_space, 0.7, 1);
      }
      `
    );

    const positionAttributeLocation = this.gl.getAttribLocation(
      program,
      "a_position"
    );

    const resolutionUniformLocation = this.gl.getUniformLocation(
      program,
      "u_translation"
    )!;

    const trianglePointLength = 0.25;
    const positionBuffer = prepareBuffer(this.gl, [
      ...[0, trianglePointLength],
      ...[trianglePointLength, -1 * trianglePointLength],
      ...[-1 * trianglePointLength, -1 * trianglePointLength],
    ]);

    this.programData = {
      program,
      attributes: [
        {
          location: positionAttributeLocation,
          buffer: positionBuffer,
          size: 2,
        },
      ],
      uniforms: {
        translate: resolutionUniformLocation,
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

  drawScene() {
    if (this.programData) {
      resizeCanvasToDisplaySize(this.canvas);
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

      clear(this.gl, [1, 1, 1, 1]);

      this.gl.useProgram(this.programData.program);
      prepareProgramAttributes(this.gl, this.programData.attributes);
      this.gl.uniform2f(
        this.programData.uniforms.translate,
        this.deltaX,
        this.deltaY
      );

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
      <div id="ui">
        <div>
          <label for="x">X</label>
          <input
            id="x"
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value=${this.deltaX}
            @input=${this.handleX}
          />
        </div>
        <div>
          <label for="y">Y</label>
          <input
            id="y"
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value=${this.deltaY}
            @input=${this.handleY}
          />
        </div>
        <div>X: <span>${this.deltaX}</span></div>
        <div>Y: <span>${this.deltaY}</span></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "webgl-app": WebGLApp;
  }
}
