import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("webgl-app")
export class WebGLApp extends LitElement {
  render() {
    return html`
      <canvas></canvas>
      <p>UI Here</p>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "webgl-app": WebGLApp;
  }
}
