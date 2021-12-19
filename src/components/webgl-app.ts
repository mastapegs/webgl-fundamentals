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
  @state() thetaX = Math.PI / 2;
  @state() thetaY = 0;

  initializeWebGL() {
    this.gl = this.canvas.getContext("webgl")!;

    const program = createProgram(
      this.gl,
      `
      attribute vec2 a_position;
      uniform vec2 u_rotation;
      uniform vec2 u_translation;
      varying vec2 v_position;

      void main() {
        vec2 rotatedPosition = vec2(
          a_position.x * u_rotation.y + a_position.y * u_rotation.x,
          a_position.y * u_rotation.y - a_position.x * u_rotation.x
        );

        gl_Position = vec4(rotatedPosition + u_translation, 0, 1);
        v_position = a_position;
      }
      `,
      `
      precision mediump float;
      varying vec2 v_position;

      void main() {
        // convert from clipspace -1,1 -> colorspace 0,1
        vec2 shrink_color = vec2(10, 10);
        vec2 color_space = (shrink_color * v_position + vec2(1, 1)) / vec2(2, 2);

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

    const rotationUniformLocation = this.gl.getUniformLocation(
      program,
      "u_rotation"
    )!;

    const trianglePointLength = 0.5;
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
        translation: resolutionUniformLocation,
        rotation: rotationUniformLocation,
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
  handleThetaX(event: Event) {
    this.thetaX = Number((event.target as HTMLInputElement).value);
  }
  handleThetaY(event: Event) {
    this.thetaY = Number((event.target as HTMLInputElement).value);
  }

  drawScene() {
    if (this.programData) {
      resizeCanvasToDisplaySize(this.canvas);
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

      clear(this.gl, [1, 1, 1, 1]);

      this.gl.useProgram(this.programData.program);
      prepareProgramAttributes(this.gl, this.programData.attributes);
      this.gl.uniform2f(
        this.programData.uniforms.translation,
        this.deltaX,
        this.deltaY
      );
      this.gl.uniform2f(
        this.programData.uniforms.rotation,
        Math.cos(this.thetaX),
        Math.sin(this.thetaX)
      );

      const primitiveType = this.gl.TRIANGLES;
      const offset = 0;
      const count = 3;
      this.gl.drawArrays(primitiveType, offset, count);
    }
  }

  roundTo100(number: number) {
    return Math.round(number * 100) / 100;
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
            min="-1"
            max="1"
            step="0.01"
            value=${this.deltaX}
            @input=${this.handleX}
          />
          <label for="x">X</label>
        </div>
        <div>
          <input
            id="y"
            type="range"
            min="-1"
            max="1"
            step="0.01"
            value=${this.deltaY}
            @input=${this.handleY}
          />
          <label for="y">Y</label>
        </div>
        <div>
          <input
            id="thetaX"
            type="range"
            min=${Math.PI * -2}
            max=${Math.PI * 2}
            step="0.01"
            value=${this.thetaX}
            @input=${this.handleThetaX}
          />
          <label for="thetaY">thetaX</label>
        </div>
        <div>
          <input
            id="thetaY"
            type="range"
            min=${Math.PI * -2}
            max=${Math.PI * 2}
            step="0.01"
            value=${this.thetaY}
            @input=${this.handleThetaY}
          />
          <label for="thetaX">thetaY</label>
        </div>
        <div>X: <span>${this.deltaX}</span></div>
        <div>Y: <span>${this.deltaY}</span></div>
        <div>Theta X: <span>${this.roundTo100(this.thetaX)}</span></div>
        <div>Theta Y: <span>${this.roundTo100(this.thetaY)}</span></div>
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "webgl-app": WebGLApp;
  }
}
