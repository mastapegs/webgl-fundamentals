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
  @state() theta = Math.PI / 2;
  @state() scale = 1;

  initializeWebGL() {
    this.gl = this.canvas.getContext("webgl")!;

    const program = createProgram(
      this.gl,
      `
      attribute vec2 a_position;
      uniform vec2 u_scale;
      uniform vec2 u_rotation;
      uniform vec2 u_translation;
      varying vec2 v_position;

      void main() {
        vec2 scaledPosition = a_position * u_scale;
        
        // vec2 rotatedPosition = vec2(
        //   a_position.x * u_rotation.y + a_position.y * u_rotation.x,
        //   a_position.y * u_rotation.y - a_position.x * u_rotation.x
        // );

        vec2 rotatedPosition = vec2(
          scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
          scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x
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
    const scaleUniformLocation = this.gl.getUniformLocation(
      program,
      "u_scale"
    )!;
    const rotationUniformLocation = this.gl.getUniformLocation(
      program,
      "u_rotation"
    )!;
    const translationUniformLocation = this.gl.getUniformLocation(
      program,
      "u_translation"
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
        scale: scaleUniformLocation,
        rotation: rotationUniformLocation,
        translation: translationUniformLocation,
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

      clear(this.gl, [1, 1, 1, 1]);

      this.gl.useProgram(this.programData.program);
      prepareProgramAttributes(this.gl, this.programData.attributes);
      this.gl.uniform2f(
        this.programData.uniforms.scale,
        this.scale,
        this.scale
      );
      this.gl.uniform2f(
        this.programData.uniforms.rotation,
        Math.cos(this.theta),
        Math.sin(this.theta)
      );
      this.gl.uniform2f(
        this.programData.uniforms.translation,
        this.deltaX,
        this.deltaY
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
        <div>Theta: <span>${this.roundTo100(this.theta)}</span></div>
        <div>Scale: <span>${this.roundTo100(this.scale)}</span></div>
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "webgl-app": WebGLApp;
  }
}
