import{w as b,p as _}from"./vendor.405c1e9d.js";const A=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function o(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerpolicy&&(i.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?i.credentials="include":n.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(n){if(n.ep)return;n.ep=!0;const i=o(n);fetch(n.href,i)}};A();function p(e,t,o){const r=e.createShader(t);return e.shaderSource(r,o),e.compileShader(r),r}function S(e,t,o){var r=e.createProgram();return e.attachShader(r,p(e,e.VERTEX_SHADER,t)),e.attachShader(r,p(e,e.FRAGMENT_SHADER,o)),e.linkProgram(r),r}function R(e,t){e.clearColor(...t),e.clear(e.COLOR_BUFFER_BIT)}function L(e){const t=e.clientWidth,o=e.clientHeight,r=e.width!==t||e.height!==o;return r&&(e.width=t,e.height=o),r}function m(e,t){const o=e.createBuffer();return e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,new Float32Array(t),e.STATIC_DRAW),o}function T(e,t){t.forEach(({location:o,buffer:r,size:n})=>{e.enableVertexAttribArray(o),e.bindBuffer(e.ARRAY_BUFFER,r);const i=e.FLOAT,c=!1,a=0,s=0;e.vertexAttribPointer(o,n,i,c,a,s)})}var w=`attribute vec2 a_position;
attribute vec4 a_color;

uniform vec2 u_resolution;
uniform vec2 u_translation;

varying vec4 v_color;

void main() {
      // convert the position from pixels to 0.0 to 1.0
  vec2 zeroToOne = a_position / u_resolution;

      // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

      // convert from 0->2 to -1->+1 (clip space)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4((clipSpace + u_translation) * vec2(1, -1), 0, 1);
  v_color = a_color;
}`,F=`precision mediump float;

varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}`;function E(e){const t=e.getContext("webgl"),o=S(t,w,F),r=t.getAttribLocation(o,"a_position"),n=t.getAttribLocation(o,"a_color"),i=t.getUniformLocation(o,"u_resolution"),c=t.getUniformLocation(o,"u_translation"),a=10,s=10,u=500,l=200,h=m(t,[a,s,a+u,s,a,s+l,a+u,s+l]),v=m(t,[1,0,0,1,1,1,0,1,0,1,0,1,0,1,1,1]),d={program:o,attributes:[{location:r,buffer:h,size:2},{location:n,buffer:v,size:4}],uniforms:[{location:i},{location:c}]},y=document.querySelector("#ui");b(B(e,t,d,0,0),y),f(e,t,d,0,0)}function B(e,t,o,r,n){const i=a=>{const s=a.target.value,u=document.querySelector("#y").value;f(e,t,o,s,Number(u))},c=a=>{const s=document.querySelector("#x").value,u=a.target.value;f(e,t,o,Number(s),u)};return _`
    <label for="x">X</label>
    <input
      id="x"
      type="range"
      min="0"
      max="1"
      step="0.005"
      value=${String(r)}
      @input=${i}
    />
    <label for="y">Y</label>
    <input
      id="y"
      type="range"
      min="0"
      max="1"
      step="0.005"
      value=${String(n)}
      @input=${c}
    />
  `}function f(e,t,o,r,n){L(e),t.viewport(0,0,t.canvas.width,t.canvas.height),R(t,[0,0,0,0]),P(t,o,r,n)}function P(e,t,o,r){e.useProgram(t.program),T(e,t.attributes),e.uniform2f(t.uniforms[0].location,e.canvas.width,e.canvas.height),e.uniform2f(t.uniforms[1].location,o,r);{const n=e.TRIANGLE_STRIP,i=0,c=4;e.drawArrays(n,i,c)}}const g=document.querySelector("#canvas");E(g);
