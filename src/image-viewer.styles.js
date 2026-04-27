import { css } from "lit";

export const styles = css`
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