import { css, LitElement, html } from "lit";
import { property, customElement } from "lit/decorators.js";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
let MyElement = class extends LitElement {
  constructor() {
    super(...arguments);
    this.name = "World";
    this.count = 0;
  }
  render() {
    return html`
      <h1>Hello, ${this.name}!</h1>
      <button @click=${this._onClick} part="button">
        Click Count: ${this.count}
      </button>
      <slot></slot>
    `;
  }
  _onClick() {
    this.count++;
  }
  foo() {
    return "foo";
  }
};
MyElement.styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;
__decorateClass([
  property()
], MyElement.prototype, "name", 2);
__decorateClass([
  property({ type: Number })
], MyElement.prototype, "count", 2);
MyElement = __decorateClass([
  customElement("my-element")
], MyElement);
export { MyElement };
