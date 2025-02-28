import { v4 as uuidv4 } from "uuid";

export class VertexId {
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

export class LayoutVertex {
  label: string;
  id: VertexId;

  constructor(label: any) {
    this.label = String(label);
    this.id = new VertexId(label);
  }

  public getId(): VertexId {
    return this.id;
  }

  public getLabel(): string {
    return this.label;
  }

  public isCliqueCenter(): boolean {
    return false;
  }
}

export class CliqueCenter extends LayoutVertex {
  constructor() {
    super(uuidv4());
  }

  public isCliqueCenter(): boolean {
    return true;
  }
}
