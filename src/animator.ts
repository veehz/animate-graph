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
  }

  /**
   * Inserts a snapshot of the current graph state into the animator.
   * @param graph - The graph to snapshot.
   */
  public snap(graph: Graph) {
    this.frames.push(graph.clone());
  }

  /**
   * Moves to a specific frame in the animation.
   * @param step - The frame number to move to.
   */
  public goto(step: number) {
    if (step >= 0 && step < this.frames.length) {
      this.step = step;
      this.activateFrame();
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
