import * as utils from "./utils";
import { Session } from "inspector";

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
    return new Promise<string>((resolve, reject) => {
      const res: string[] = [];
      const getChunk = (m: any) => {
        res.push(m.params.chunk);
      };
      this.session.on("HeapProfiler.addHeapSnapshotChunk", getChunk);
      this.session.post("HeapProfiler.stopTrackingHeapObjects", (err) => {
        this.session.removeListener(
          "HeapProfiler.addHeapSnapshotChunk",
          getChunk
        );
        if (err) return reject(err);
        resolve(res.join(""));
      });
    });
  }

  takeSnapshot() {
    return new Promise<string>((resolve, reject) => {
      const res: string[] = [];
      const getChunk = (m: any) => {
        res.push(m.params.chunk);
      };
      this.session.on("HeapProfiler.addHeapSnapshotChunk", getChunk);
      this.session.post(
        "HeapProfiler.takeHeapSnapshot",
        undefined,
        (err: any, _r: any) => {
          this.session.removeListener(
            "HeapProfiler.addHeapSnapshotChunk",
            getChunk
          );
          if (err) return reject(err);
          resolve(res.join(""));
        }
      );
    });
  }
}
