import { EventEmitter } from "events";

export interface InteractionInfo {
  adjEdges: Map<any, Set<string>>;
  adjVertices: Map<any, Set<any>>;
}

export class InteractionState {
  selectedVertices: Set<any> = new Set();
}

export class InteractionManager extends EventEmitter {
  state = new InteractionState();
  interactionInfo: InteractionInfo;

  constructor(interactionInfo?: InteractionInfo) {
    super();
    this.interactionInfo = interactionInfo || { adjEdges: new Map(), adjVertices: new Map() };
  }

  vertexClicked(vertexId: string, ctrlKey: boolean) {
    if (ctrlKey) {
      if (this.state.selectedVertices.has(vertexId)) {
        this.state.selectedVertices.delete(vertexId);
      } else {
        this.state.selectedVertices.add(vertexId);
      }
    } else {
      if (this.state.selectedVertices.has(vertexId)) {
        this.state.selectedVertices.clear();
      } else {
        this.state.selectedVertices.clear();
        this.state.selectedVertices.add(vertexId);
      }
    }
    this.triggerRedraw();
  }

  /**
   * only available in MarkVertexInteractionManager
   * @param vertexId
   * @returns
   */
  markVertex(vertexId: string): boolean {
    return false;
  }

  isSelectedVertex(vertexId: string): boolean {
    return this.state.selectedVertices.has(vertexId);
  }

  highlightVertex(vertexId: string): boolean {
    if (this.state.selectedVertices.has(vertexId)) {
      return true;
    }
    const isAdj = Array.from(this.state.selectedVertices).find((v) => this.interactionInfo.adjVertices.get(v)?.has(vertexId)) != undefined;
    if (isAdj) {
      return true;
    }
    return false;
  }

  highlightEdge(edgeId: string): boolean {
    return Array.from(this.state.selectedVertices).some((v) => this.interactionInfo.adjEdges.get(v)?.has(edgeId));
  }

  reset() {
    this.state = new InteractionState();
  }

  triggerRedraw() {
    this.emit("redraw");
  }

  copy(): InteractionManager {
    const newInstance = new InteractionManager();
    newInstance.state = this.state;
    newInstance.interactionInfo = this.interactionInfo;
    return newInstance;
  }
}

/**
 * InteractionManager that does not allow to select vertices
 * only the markVertex are marked
 */
export class MarkVertexInteractionManager extends InteractionManager {
  vertexMark: Set<any>;

  constructor(vertexMark: Set<any>) {
    super();
    this.vertexMark = vertexMark;
  }

  vertexClicked(vertexId: string, ctrlKey: boolean): void {
    return;
  }

  markVertex(vertexId: string): boolean {
    return this.vertexMark.has(vertexId);
  }
}
