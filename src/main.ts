import "./styles.css";
import { startApp } from "./webgl/webglApp";
// import "./my-element";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

startApp(canvas);
