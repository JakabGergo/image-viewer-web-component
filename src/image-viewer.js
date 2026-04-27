// image-viewer.js
import { LitElement, html } from "lit";
import { styles } from "./image-viewer.styles.js";

class ImageViewer extends LitElement {
  static properties = {
    _images: { state: true },
    _current: { state: true },
  };

  static styles = styles;

  constructor() {
    super();
    this._images = [];
    this._current = 0;
  }

  render() {
    const imgs = this._images;
    const cur = this._current;

    if (!imgs.length)
      return html` <div
        id="drop-zone"
        @click=${this._openPicker}
        @dragover=${(e) => {
          e.preventDefault();
          e.target.classList.add("dragover");
        }}
        @dragleave=${(e) => e.target.classList.remove("dragover")}
        @drop=${this._onDrop}
      >
        Drop images here or click to upload
      </div>`;

    return html`
      <div id="main-stage">
        <img class="main" src=${imgs[cur].url} alt=${imgs[cur].name} />
        <button class="nav prev" @click=${() => this._go(cur - 1)}>
          &#8592;
        </button>
        <button class="nav next" @click=${() => this._go(cur + 1)}>
          &#8594;
        </button>
      </div>
      <div class="thumbs">
        ${imgs.map(
          (img, i) => html`
            <img
              class="thumb ${i === cur ? "active" : ""}"
              src=${img.url}
              @click=${() => this._go(i)}
            />
          `,
        )}
      </div>
      <div class="toolbar">
        <button @click=${this._openPicker}>+ Add more</button>
        <button class="danger" @click=${this._removeCurrent}>
          Remove this image
        </button>
      </div>
    `;
  }

  _go(idx) {
    this._current = (idx + this._images.length) % this._images.length;
  }

  _onDrop(e) {
    e.preventDefault();
    this._loadFiles(e.dataTransfer.files);
  }

  _openPicker() {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.multiple = true;
    inp.accept = "image/*";
    inp.onchange = (e) => this._loadFiles(e.target.files);
    inp.click();
  }

  _loadFiles(files) {
    const newImgs = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
    this._images = [...this._images, ...newImgs];
    this._current = 0;
  }

  _removeCurrent() {
    URL.revokeObjectURL(this._images[this._current].url);
    const updated = [...this._images];
    updated.splice(this._current, 1);
    this._images = updated;
    this._current = Math.min(this._current, this._images.length - 1);
  }
}

customElements.define("image-viewer", ImageViewer);
