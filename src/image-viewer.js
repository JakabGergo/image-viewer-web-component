import { LitElement, html } from "lit";
import { styles } from "./image-viewer.styles.js";

class ImageViewer extends LitElement {
  static properties = {
    _images: { state: true },
    _current: { state: true },
    _loading: { state: true },
    noRemove: { type: Boolean, attribute: "no-remove" },
    noAdd: { type: Boolean, attribute: "no-add" },
    showCounter: { type: Boolean, attribute: "show-counter" },
    maxImages: { type: Number, attribute: "max-images" },
  };

  static styles = styles;

  constructor() {
    super();
    this._images = [];
    this._current = 0;
    this._loading = false;
    this.noRemove = false;
    this.noAdd = false;
    this.showCounter = false;
    this.maxImages = null;
    this.onUpload = null; // async (file) => url
    this.onDelete = null; // async (image) => void
    this.onLoad = null; // async () => [{ url, name }]
  }

  async connectedCallback() {
    super.connectedCallback();
  }

  async loadImages() {
    if (this.onLoad) {
      this._loading = true;
      const images = await this.onLoad();
      this._images = this.maxImages ? images.slice(0, this.maxImages) : images;
      this._loading = false;
    }
  }

  set images(val) {
    this._images = val;
    this._current = 0;
  }

  render() {
    const imgs = this._images;
    const cur = this._current;
    const limitReached = this.maxImages && imgs.length >= this.maxImages;

    if (this._loading) {
      return html`<div id="drop-zone" style="cursor: default">
        Loading images...
      </div>`;
    }

    if (!imgs.length) {
      if (this.noAdd) {
        return html`<div id="drop-zone" style="cursor: not-allowed">
          No images to display
        </div>`;
      }
      return html`<div
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
    }

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

      ${this.showCounter
        ? html`<div id="counter">${cur + 1} / ${imgs.length}</div>`
        : ""}

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
        ${this.noAdd || limitReached
          ? ""
          : html`<button class="tb-btn" @click=${this._openPicker}>
              + Add more
            </button>`}
        ${this.noRemove
          ? ""
          : html`<button class="tb-btn danger" @click=${this._removeCurrent}>
              Remove this image
            </button>`}
      </div>
    `;
  }

  _dispatch(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
  }

  _go(idx) {
    this._current = (idx + this._images.length) % this._images.length;
    this._dispatch("image-changed", {
      index: this._current,
      name: this._images[this._current].name,
      url: this._images[this._current].url,
    });
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

  async _loadFiles(files) {
    const remaining = this.maxImages
      ? this.maxImages - this._images.length
      : Infinity;
    if (remaining <= 0) return;

    const newImgs = (
      await Promise.all(
        Array.from(files)
          .filter((f) => f.type.startsWith("image/"))
          .slice(0, remaining)
          .map(async (f) => {
            if (this.onUpload) {
              try {
                const url = await this.onUpload(f);
                return { url, name: f.name };
              } catch (error) {
                this._dispatch("upload-error", { file: f, error });
                return null;
              }
            }
            return { url: URL.createObjectURL(f), name: f.name };
          }),
      )
    ).filter(Boolean);

    this._images = [...this._images, ...newImgs];
    this._current = 0;

    this._dispatch("images-changed", {
      count: this._images.length,
      images: this._images,
    });
  }

  async _removeCurrent() {
    const image = this._images[this._current];
    if (this.onDelete) {
      await this.onDelete(image);
    } else {
      URL.revokeObjectURL(image.url);
    }
    const updated = [...this._images];
    updated.splice(this._current, 1);
    this._images = updated;
    this._current = Math.min(this._current, this._images.length - 1);

    this._dispatch("images-changed", {
      count: this._images.length,
      images: this._images,
    });
  }
}

customElements.define("image-viewer", ImageViewer);
