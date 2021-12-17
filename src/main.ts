import "./styles.css";
import { startApp } from "./webglApp";
import "./my-element";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

startApp(canvas);
