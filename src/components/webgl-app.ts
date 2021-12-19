import { html, css, LitElement } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { createProgram, prepareBuffer, ProgramData } from "../webgl/utils";

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
  `;

  @query("canvas") canvas!: HTMLCanvasElement;
  @state() gl!: WebGLRenderingContext;
  @state() programData!: ProgramData;

  initializeWebGL() {
    this.gl = this.canvas.getContext("webgl")!;

    const program = createProgram(
      this.gl,
      `
      attribute vec2 a_position;

      void main() {
        gl_Position = vec4(a_position, 0, 1);
      }
      `,
      `
      precision mediump float;

      void main() {
        gl_FragColor = vec4(1, 1, 1, 1);
      }
      `
    );

    const positionAttributeLocation = this.gl.getAttribLocation(
      program,
      "a_position"
    );

    const positionBuffer = prepareBuffer(this.gl, [
      ...[0, 1],
      ...[1, -1],
      ...[-1, -1],
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
      uniforms: [],
    };
  }

  connectedCallback(): void {
    super.connectedCallback();
    setTimeout(() => this.initializeWebGL());
  }

  render() {
    if (this.programData) {
      console.log(this.programData);
    }
    return html`
      <canvas></canvas>
      <div>UI Here</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "webgl-app": WebGLApp;
  }
}
