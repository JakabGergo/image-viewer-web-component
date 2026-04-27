// image-viewer.js
import { LitElement, html, css } from "lit";

class ImageViewer extends LitElement {
  static properties = {
    _images: { state: true },
    _current: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
    }

    #drop-zone {
      border: 1.5px dashed #ccc;
      border-radius: 12px;
      padding: 2.5rem;
      text-align: center;
      cursor: pointer;
    }
    #drop-zone.dragover {
      background: #eef5ff;
      border-color: #3b82f6;
    }

    #main-stage {
      position: relative;
      background: #f5f5f5;
      border-radius: 12px;
      aspect-ratio: 16/9;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    img.main {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: white;
      border: 1px solid #ddd;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      cursor: pointer;
    }
    .nav.prev {
      left: 10px;
    }
    .nav.next {
      right: 10px;
    }

    .thumbs {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      margin-top: 12px;
    }
    .thumb {
      width: 64px;
      height: 48px;
      object-fit: cover;
      border-radius: 6px;
      cursor: pointer;
      opacity: 0.6;
      border: 2px solid transparent;
    }
    .thumb.active {
      opacity: 1;
      border-color: #3b82f6;
    }
  `;

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
      <button @click=${this._openPicker}>+ Add more</button>
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
}

customElements.define("image-viewer", ImageViewer);
