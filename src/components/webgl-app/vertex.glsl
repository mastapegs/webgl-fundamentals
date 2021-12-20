attribute vec2 a_position;

uniform mat3 u_matrix;

varying vec2 v_position;

void main() {
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;

  gl_Position = vec4(position, 0, 1);
  v_position = a_position;
}