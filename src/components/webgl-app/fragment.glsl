precision mediump float;
varying vec2 v_position;

void main() {
  // convert from clipspace -1,1 -> colorspace 0,1
  vec2 shrink_color = vec2(10, 10);
  vec2 color_space = (shrink_color * v_position + vec2(1, 1)) / vec2(2, 2);

  gl_FragColor = vec4(color_space, 0.7, 1);
}