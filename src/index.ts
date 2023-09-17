import Docker from "dockerode";
import fs from "node:fs/promises";
import path from "node:path";

type State = {
  containerId: string | null;
};

export class StateManager {
  statePath: string = path.join(process.cwd(), ".anvild", "state.json");
  constructor(statePath?: string) {
    if (statePath) this.statePath = statePath;
  }
  async checkFile() {
    try {
      const stateFile = await fs.stat(this.statePath);
      return stateFile.isFile();
    } catch (error: any) {
      return false;
    }
  }
  async readState(): Promise<State> {
    const isExists = await this.checkFile();
    if (isExists) return JSON.parse(await fs.readFile(this.statePath, "utf-8"));
    return { containerId: null };
  }

  async saveState(state: State) {
    const isExists = await this.checkFile();
    // if (!isExists)
    //   await fs.mkdir(path.dirname(this.statePath), { recursive: true });
    console.log(path.dirname(this.statePath), isExists);
    if (isExists) return;
    return await fs.writeFile(this.statePath, JSON.stringify(state), "utf-8");
  }
}

type CreateAnvilDeps = {
  docker: Docker;
  stateManager: StateManager;
};

console.log(process.stdout.isTTY);
const createAnvil = async ({ docker, stateManager }: CreateAnvilDeps) => {
//   const list = await docker.listContainers({
//     filters: { label: ["anvild=anvild"] },
//   });
//   if (list.length) {
//     for (const service of list) {
//       const container = await docker.getContainer(service.Id);
//       await container.stop();
//     }
//     console.log(list);
//     return;
//   }
  const state = await stateManager.readState();
  if (state) {
    console.log(state);
    // return;
  }
  const container = await docker.createContainer({
    Image: "ghcr.io/foundry-rs/foundry:latest",
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: process.stdout.isTTY,
    OpenStdin: false,
    StdinOnce: false,
    Cmd: ["anvil --port 9090 --host 0.0.0.0"],
    Labels: { anvild: "anvild" },
    ExposedPorts: {
      "9090/tcp": {},
    },
    HostConfig: {
      PortBindings: {
        "9090/tcp": [
          {
            HostIP: "0.0.0.0",
            HostPort: "9090",
          },
        ],
      },
    },
  });
  console.log(container.id);
  await container.start();

  const stream = await container.attach({
    stream: true,
    stdout: true,
    stderr: true,
  });
  stream.pipe(process.stdout);
  //   console.log(container, status);
};

(async () => {
  // const creat
  await createAnvil({
    docker: new Docker(),
    stateManager: new StateManager("./"),
  });
  //   console.log(ls);
})();
