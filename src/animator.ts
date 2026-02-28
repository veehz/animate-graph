import { Graph } from "./graph";

/**
 * Animates a graph by storing snapshots of a graph and playing back each frame.
 */
export class Animator {
  private frames: Graph[];
  private step: number;
  constructor(frames: Graph[] = []) {
    this.frames = frames;
    this.step = 0;

    if (this.frames.length) {
      this.frames[0].update();
    }
  }

  private listeners: Array<(step: number, total: number) => void> = [];

  /**
   * Subscribe to changes in the animator state.
   * @param listener - The callback function.
   * @returns An unsubscribe function.
   */
  public subscribe(listener: (step: number, total: number) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) =>
      listener(this.step, this.frames.length)
    );
  }

  /**
   * Returns the current frame index.
   * @returns The current frame index.
   */
  public get currentStep() {
    return this.step;
  }

  /**
   * Returns the number of frames in the animator.
   * @returns The number of frames.
   */
  public get length() {
    return this.frames.length;
  }

  /**
   * Inserts a graph into the animator.
   * @param graph - The graph to insert.
   */
  public insert(graph: Graph) {
    this.frames.push(graph);
    this.notify();
  }

  /**
   * Inserts a clone of the current graph state into the animator.
   * @param graph - The graph to clone.
   */
  public snap(graph: Graph) {
    this.insert(graph.clone(true));
  }

  /**
   * Moves to a specific frame in the animation.
   * @param step - The frame number to move to.
   */
  public goto(step: number) {
    if (step < 0 || step >= this.frames.length) {
      return false;
    }

    this.step = step;
    this.activateFrame();
    this.notify();
    return true;
  }

  /**
   * Moves to the next frame in the animation.
   */
  public next() {
    return this.goto(this.step + 1);
  }

  /**
   * Moves to the previous frame in the animation.
   */
  public prev() {
    return this.goto(this.step - 1);
  }

  /**
   * Moves to the first frame in the animation.
   */
  public first() {
    return this.goto(0);
  }

  /**
   * Moves to the last frame in the animation.
   */
  public last() {
    return this.goto(this.frames.length - 1);
  }

  /**
   * Gets the current frame in the animation.
   */
  public get currentFrame() {
    return this.frames[this.step];
  }

  /**
   * Activates the current frame in the animation.
   */
  private activateFrame() {
    this.currentFrame.activate();
  }
}
