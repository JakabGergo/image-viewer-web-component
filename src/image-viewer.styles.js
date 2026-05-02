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
    border-radius: 8px;
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

  .nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    border: 0.5px solid #ddd;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    color: #333;
    transition: background 0.1s;
    z-index: 2;
    line-height: 1;
  }
  .nav-btn:hover {
    background: #f3f3f3;
  }
  .nav-btn:active {
    transform: translateY(-50%) scale(0.95);
  }

  .tb-btn {
    font-size: 12px;
    padding: 5px 12px;
    border-radius: 8px;
    border: 0.5px solid #ddd;
    background: transparent;
    color: #444;
    cursor: pointer;
    transition: background 0.1s;
  }
  .tb-btn:hover {
    background: #f3f3f3;
  }
  .tb-btn.danger {
    color: #dc2626;
    border-color: #fca5a5;
  }
  .tb-btn.danger:hover {
    background: #fef2f2;
  }

  .thumbs {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    margin-top: 12px;
    justify-content: center;
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
  button.danger {
    color: #dc2626;
    border-color: #fca5a5;
  }
  button.danger:hover {
    background: #fef2f2;
  }
  .toolbar {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 12px;
  }

  #counter {
    text-align: center;
    font-size: 12px;
    color: #888;
    border-radius: 20px;
    background: white;
    margin-top: 8px;
  }
`;
