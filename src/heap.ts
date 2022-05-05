import * as utils from "./utils";
import { Session } from "inspector";
import { PassThrough } from "stream";
export default class Heap {
  session: Session;

  constructor(session: Session) {
    this.session = session;
  }

  async enable() {
    await utils.invokeFunction(this.session, "HeapProfiler.enable");
  }

  async disable() {
    await utils.invokeFunction(this.session, "HeapProfiler.disable");
  }

  async startSampling() {
    await utils.invokeFunction(this.session, "HeapProfiler.startSampling");
  }

  async stopSampling() {
    return utils.invokeStop("HeapProfiler.stopSampling", this.session);
  }

  async startTimeline() {
    await utils.invokeFunction(
      this.session,
      "HeapProfiler.startTrackingHeapObjects",
      { trackAllocations: true }
    );
  }

  stopTimeline() {
    const stream = new PassThrough();
    const getChunk = (m: any) => {
      stream.push(m.params.chunk);
    };
    this.session.on("HeapProfiler.addHeapSnapshotChunk", getChunk);
    this.session.post("HeapProfiler.stopTrackingHeapObjects", (err) => {
      this.session.removeListener(
        "HeapProfiler.addHeapSnapshotChunk",
        getChunk
      );
      stream.emit("finish");
      stream.emit("end");
      stream.end();
      if (err) throw err;
    });
    return stream;
  }

  takeSnapshot() {
    const stream = new PassThrough();
    const getChunk = (m: any) => {
      stream.push(m.params.chunk);
    };
    this.session.on("HeapProfiler.addHeapSnapshotChunk", getChunk);
    this.session.post("HeapProfiler.takeHeapSnapshot", (err: any, _r: any) => {
      this.session.removeListener(
        "HeapProfiler.addHeapSnapshotChunk",
        getChunk
      );
      stream.emit("finish");
      stream.emit("end");
      stream.end();
      if (err) throw err;
    });
    return stream;
  }
}
