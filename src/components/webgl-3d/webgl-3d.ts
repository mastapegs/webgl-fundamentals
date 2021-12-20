import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

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

  render() {
    return html`
      <div id="container">
        <canvas></canvas>
        <div id="ui"></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "webgl-3d": WebGL3D;
  }
}
