export class InteractionState {
  selectedVertices: Set<string> = new Set();
}

export class InteractionManager {
  state: InteractionState;

  constructor(state: InteractionState) {
    this.state = state;
  }

  highlightVertex(vertexId: string): boolean {
    return this.state.selectedVertices.has(vertexId);
  }
}
