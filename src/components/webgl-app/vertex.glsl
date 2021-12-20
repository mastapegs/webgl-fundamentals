attribute vec2 a_position;
attribute vec4 a_color;

uniform mat3 u_matrix;

varying vec4 v_color;

void main() {
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;

  gl_Position = vec4(position, 0, 1);
  v_color = a_color;
}