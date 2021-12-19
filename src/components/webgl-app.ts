import { html, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";

@customElement("webgl-app")
export class WebGLApp extends LitElement {
  @query("canvas") canvas!: HTMLCanvasElement;

  initializeWebGL() {
    console.log(this.canvas);
  }

  connectedCallback(): void {
    super.connectedCallback();
    setTimeout(() => this.initializeWebGL());
  }

  render() {
    return html`
      <canvas></canvas>
      <p>UI Here</p>
      ${console.log("render() called")}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "webgl-app": WebGLApp;
  }
}
