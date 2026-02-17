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
   */
  public subscribe(listener: (step: number, total: number) => void) {
    this.listeners.push(listener);
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
  public getStep() {
    return this.step;
  }

  /**
   * Returns the number of frames in the animator.
   * @returns The number of frames.
   */
  public steps() {
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
   * Inserts a snapshot of the current graph state into the animator.
   * @param graph - The graph to snapshot.
   */
  public snap(graph: Graph) {
    this.insert(graph.clone());
  }

  /**
   * Moves to a specific frame in the animation.
   * @param step - The frame number to move to.
   */
  public goto(step: number) {
    if (step >= 0 && step < this.frames.length) {
      this.step = step;
      this.activateFrame();
      this.notify();
    }
  }

  /**
   * Moves to the next frame in the animation.
   */
  public next() {
    this.goto(this.step + 1);
  }

  /**
   * Moves to the previous frame in the animation.
   */
  public prev() {
    this.goto(this.step - 1);
  }

  /**
   * Moves to the first frame in the animation.
   */
  public first() {
    this.goto(0);
  }

  /**
   * Moves to the last frame in the animation.
   */
  public last() {
    this.goto(this.frames.length - 1);
  }

  /**
   * Activates the current frame in the animation.
   */
  private activateFrame() {
    const frame = this.frames[this.step];
    frame.activate();
  }
}
