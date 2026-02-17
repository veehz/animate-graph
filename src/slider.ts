import { Animator } from "./animator";
import "./slider.css";

export class Slider {
  private container: HTMLElement;
  private animator: Animator;
  private input: HTMLInputElement;
  private label: HTMLSpanElement;

  constructor(selector: string | HTMLElement, animator: Animator) {
    this.animator = animator;
    const el =
      typeof selector === "string"
        ? document.querySelector(selector)
        : selector;
    if (!el) {
      throw new Error(`Element ${selector} not found`);
    }
    this.container = el as HTMLElement;
    this.container.classList.add("ag-slider-container");

    // Create slider input
    this.input = document.createElement("input");
    this.input.type = "range";
    this.input.className = "ag-slider-input";
    this.input.min = "0";
    this.input.max = Math.max(0, this.animator.steps() - 1).toString();
    this.input.value = this.animator.getStep().toString();

    // Create label
    this.label = document.createElement("span");
    this.label.className = "ag-slider-label";
    this.updateLabel();

    this.container.appendChild(this.input);
    this.container.appendChild(this.label);

    this.attachEvents();
  }

  private attachEvents() {
    this.input.addEventListener("input", (e) => {
      const step = parseInt((e.target as HTMLInputElement).value);
      this.animator.goto(step);
      // updateLabel will be called by the subscription
    });

    this.animator.subscribe((step, total) => {
      this.input.max = Math.max(0, total - 1).toString();
      this.input.value = step.toString();
      this.updateLabel();
    });
  }

  private updateLabel() {
    this.label.textContent = `Step: ${this.animator.getStep()} / ${
      this.animator.steps() - 1
    }`;
  }
}
