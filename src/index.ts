import { Session } from "inspector";
import Profiler from "./profiler";
import Heap from "./heap";

export class Inspector {
  session: Session | null;
  profiler: Profiler;
  heap: Heap;
  constructor() {
    const session = new Session();
    session.connect();
    this.session = session;
    this.profiler = new Profiler(this.session);
    this.heap = new Heap(this.session);
  }

  getCurrentSession() {
    return this.session;
  }

  async destroy() {
    if (!this.session) {
      return;
    }
    await this.profiler.disable();
    await this.heap.disable();
    this.session.disconnect();
    this.session = null;
  }
}
export default Inspector;