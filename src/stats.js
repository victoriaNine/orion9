import Stats from 'stats.js';

export default function setupStats () {
  const stats = new Stats();
  stats.dom.style.left = "0px";
  stats.dom.style.width = "80px";
  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  requestAnimationFrame(function loop () {
    stats.update();
    requestAnimationFrame(loop);
  });
}
