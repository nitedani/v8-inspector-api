import { Session } from "inspector";

export const invokeFunction = (session: Session, fnName: string, args = {}) => {
  return new Promise<void>((resolve, reject) => {
    session.post(fnName, args, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

export const invokeStop = (fnName: string, session: Session) => {
  return new Promise((resolve, reject) => {
    session.post(fnName, (err: Error | null, res: any) => {
      if (err) return reject(err);
      const data = res.profile || res.result;
      resolve(data);
    });
  });
};
