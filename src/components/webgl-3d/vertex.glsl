attribute vec3 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
  vec4 position = u_matrix * vec4(a_position, 1);

  float fudgeFactor = 1.2;
  float zToDivideBy = 1.0 + position.z * fudgeFactor;
  
  gl_Position = vec4(position.xy * zToDivideBy, position.zw);
  v_color = a_color;
}