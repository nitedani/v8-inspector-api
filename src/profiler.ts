import * as utils from "./utils";
import { Session, Profiler as IProfiler } from "inspector";

export default class Profiler {
  session: Session;

  constructor(session: Session) {
    this.session = session;
  }

  async enable() {
    await utils.invokeFunction(this.session, "Profiler.enable");
  }

  async disable() {
    await utils.invokeFunction(this.session, "Profiler.disable");
  }

  async start() {
    await utils.invokeFunction(this.session, "Profiler.start");
  }

  async stop() {
    return utils.invokeStop(
      "Profiler.stop",
      this.session
    ) as Promise<IProfiler.Profile>;
  }

  async startPreciseCoverage(args: any) {
    return utils.invokeFunction(
      this.session,
      "Profiler.startPreciseCoverage",
      args
    );
  }

  async stopPreciseCoverage() {
    return utils.invokeFunction(this.session, "Profiler.stopPreciseCoverage");
  }

  async takePreciseCoverage() {
    return utils.invokeStop("Profiler.takePreciseCoverage", this.session);
  }
}
