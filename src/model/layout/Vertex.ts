import { v4 as uuidv4 } from "uuid";
import { VertexId } from "@/model/types";

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
