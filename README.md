# image-viewer-wc

A lightweight, framework-agnostic image upload and viewer Web Component built with [Lit](https://lit.dev). Drop it into React, Vue, Angular, or plain HTML — no framework required.

---

## Features

- Drag & drop or click to upload images
- Thumbnail strip navigation
- Prev / next buttons + keyboard arrow key navigation
- Click to zoom — fullscreen overlay, close with `Escape`
- Custom storage via callbacks (MinIO, S3, Cloudinary, etc.)
- Independent instances on the same page
- Configurable via HTML attributes

---

## Installation

```bash
npm install image-viewer-wc
```

---

## Basic usage

```html
<image-viewer></image-viewer>

<script type="module">
  import 'image-viewer-wc';
</script>
```

---

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `no-add` | Boolean | `false` | Hide the upload button |
| `no-remove` | Boolean | `false` | Hide the delete button |
| `show-counter` | Boolean | `false` | Show `1 / 5` counter below the image |
| `max-images` | Number | `null` | Limit the number of images |

### Examples

```html
<!-- hide remove button -->
<image-viewer no-remove></image-viewer>

<!-- hide both buttons — read only viewer -->
<image-viewer no-add no-remove></image-viewer>

<!-- show counter, limit to 5 images -->
<image-viewer show-counter max-images="5"></image-viewer>
```

---

## Properties & methods

| Name | Type | Description |
|---|---|---|
| `viewer.images` | `Array` | Preload images: `[{ url, name }]` |
| `viewer.loadImages()` | Method | Manually trigger `onLoad` |
| `viewer.onLoad` | `async () => [{ url, name }]` | Called on mount to fetch images |
| `viewer.onUpload` | `async (file) => url` | Called when a file is picked |
| `viewer.onDelete` | `async (image) => void` | Called when an image is removed |

### Preload images

```js
const viewer = document.querySelector('image-viewer');
viewer.images = [
  { url: 'https://example.com/photo1.jpg', name: 'photo1.jpg' },
  { url: 'https://example.com/photo2.jpg', name: 'photo2.jpg' },
];
```

---

## Custom storage

By default images are stored in memory (lost on refresh). Provide callbacks to connect your own storage.

### With a REST API

```js
const viewer = document.querySelector('image-viewer');

viewer.onLoad = async () => {
  const res = await fetch('/api/images');
  return await res.json(); // [{ url, name }]
};

viewer.onUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/images', { method: 'POST', body: formData });
  const data = await res.json();
  return data.url;
};

viewer.onDelete = async (image) => {
  await fetch(`/api/images/${encodeURIComponent(image.name)}`, {
    method: 'DELETE'
  });
};

viewer.loadImages();
```

### With Cloudinary

```js
viewer.onUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_preset');
  const res = await fetch('https://api.cloudinary.com/v1_1/your_cloud/image/upload', {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  return data.secure_url;
};
```

---

## Events

| Event | Detail | Description |
|---|---|---|
| `image-changed` | `{ index, name, url }` | Fired when the user navigates to a different image |
| `images-changed` | `{ count, images }` | Fired when images are added or removed |
| `upload-error` | `{ file, error }` | Fired when `onUpload` throws an error |

### Example

```js
const viewer = document.querySelector('image-viewer');

viewer.addEventListener('image-changed', (e) => {
  console.log('Now viewing:', e.detail.name, 'at index', e.detail.index);
});

viewer.addEventListener('images-changed', (e) => {
  console.log('Total images:', e.detail.count);
});

viewer.addEventListener('upload-error', (e) => {
  alert(`Failed to upload ${e.detail.file.name}: ${e.detail.error.message}`);
});
```

---

## Framework usage

### React

```jsx
import 'image-viewer-wc';

export default function App() {
  return <image-viewer show-counter max-images="10" />;
}
```

### Vue

```html
<script setup>
import 'image-viewer-wc';
</script>

<template>
  <image-viewer show-counter max-images="10" />
</template>
```

### Angular

In your module, add `CUSTOM_ELEMENTS_SCHEMA`:

```ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import 'image-viewer-wc';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
```

Then use it in templates:

```html
<image-viewer show-counter max-images="10"></image-viewer>
```

---

## Keyboard shortcuts

| Key | Action |
|---|---|
| `ArrowLeft` | Previous image |
| `ArrowRight` | Next image |
| `Escape` | Close zoom overlay |

---

## Multiple independent instances

Each `<image-viewer>` is completely independent — different storage, different images, different configuration:

```html
<!-- admin: full control, connected to storage -->
<image-viewer id="admin-viewer" show-counter></image-viewer>

<!-- user: read only, same storage -->
<image-viewer id="user-viewer" no-add no-remove show-counter></image-viewer>

<!-- local: memory only, no storage -->
<image-viewer id="local-viewer" max-images="3"></image-viewer>
```

---

## Demo application

The demo page (`index.html`) in this repository connects to a **MinIO** storage server via a small **Express** backend (`server.js`). This is just one example of how to use the component with real storage — the component itself has no dependency on MinIO or Express.

---

### Architecture

```
Browser (index.html)
      │
      │ fetch /api/images
      ▼
Express server (server.js) running on port 3001
      │
      │ MinIO SDK
      ▼
MinIO bucket (fd-project-2026) running on port 9123
```

---

### Requirements

- [Node.js](https://nodejs.org)
- [Docker](https://docker.com) — to run MinIO
- A MinIO instance running locally

---

### Run MinIO with Docker

```bash
docker run -p 9123:9000 -p 9124:9001 \
  -e MINIO_ROOT_USER=your_access_key \
  -e MINIO_ROOT_PASSWORD=your_secret_key \
  quay.io/minio/minio server /data --console-address ":9001"
```

Then open `http://localhost:9124` to access the MinIO console and create a bucket called `fd-project-2026`.

---

### Environment variables

Create a `.env` file in the project root based on `.env.example`:

```env
VITE_MINIO_URL=http://localhost:9123
VITE_MINIO_BUCKET=fd-project-2026
VITE_MINIO_ACCESS_KEY=your_access_key
VITE_MINIO_SECRET_KEY=your_secret_key
```

---

### Install dependencies

```bash
npm install
```

---

### Run the demo

Open two terminals:

```bash
# terminal 1 — Vite dev server
npm run dev

# terminal 2 — Express API server
npm run server
```

Then open `http://localhost:5173`.

---

### API endpoints

The Express server exposes three endpoints used by the demo:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/images` | List all images from the bucket |
| `POST` | `/api/images` | Upload a new image |
| `DELETE` | `/api/images/:key` | Delete an image by key |

---

### Note

The component itself is completely storage-agnostic. You can replace MinIO with any storage provider — S3, Cloudinary, Firebase, or your own backend — by providing your own `onLoad`, `onUpload`, and `onDelete` callbacks. See the [Custom storage](#custom-storage) section above.

---

## License

MIT © Gergő Jakab