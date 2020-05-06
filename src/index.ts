export default (): void => {

  const canvas = document.createElement('canvas');

  canvas.id = "CursorLayer";
  canvas.width = 1224;
  canvas.height = 768;
  canvas.style.zIndex = '8';
  canvas.style.position = "absolute";
  canvas.style.border = "1px solid";

  document.body.appendChild(canvas);

  canvas.textContent = "Hello World";
}