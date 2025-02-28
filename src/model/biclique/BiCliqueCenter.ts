import { v4 as uuidv4 } from "uuid";

export class BiCliqueCenter {
  uuid: string;
  constructor() {
    this.uuid = uuidv4();
  }
}
