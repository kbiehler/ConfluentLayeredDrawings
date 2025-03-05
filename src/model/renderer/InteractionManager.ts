import { EventEmitter } from "events";
import { VertexId } from "@/model/types";

export interface InteractionInfo {
  adjEdges: Map<VertexId, Set<string>>;
  adjVertices: Map<VertexId, Set<VertexId>>;
}

export class InteractionState {
  selectedVertices: Set<VertexId> = new Set();
  vertexMouseOver: Set<VertexId> = new Set();
}

export class InteractionManager extends EventEmitter {
  state = new InteractionState();
  interactionInfo: InteractionInfo;

  constructor(interactionInfo?: InteractionInfo) {
    super();
    this.interactionInfo = interactionInfo || { adjEdges: new Map(), adjVertices: new Map() };
  }

  vertexMouseOver(vertexId: VertexId) {
    this.state.vertexMouseOver.add(vertexId);
    this.triggerRedraw();
  }

  vertexMouseOut(vertexId: VertexId) {
    this.state.vertexMouseOver.delete(vertexId);
    this.triggerRedraw();
  }

  vertexClicked(vertexId: VertexId, ctrlKey: boolean) {
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
  markVertex(vertexId: VertexId): boolean {
    return false;
  }

  isSelectedVertex(vertexId: VertexId): boolean {
    return this.state.selectedVertices.has(vertexId);
  }

  highlightVertex(vertexId: VertexId): boolean {
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

  vertexClicked(vertexId: VertexId, ctrlKey: boolean): void {
    return;
  }

  markVertex(vertexId: VertexId): boolean {
    return this.vertexMark.has(vertexId);
  }
}
