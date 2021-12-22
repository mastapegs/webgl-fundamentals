attribute vec3 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
  vec4 position = u_matrix * vec4(a_position, 1);
  
  gl_Position = position;
  v_color = a_color;
}