import Docker from "dockerode";
import {
  CreateAnvilSchema,
  type CreateAnvilInternal,
  type CreateAnvil,
} from "./schema";
import { toArgs } from "./options-to-args";
import { waitForServer } from "./wait-for-server";

const docker = new Docker();

const createPortConfig = (port: number) => {
  const config = {
    ExposedPorts: {} as { [key: string]: {} },
    HostConfig: {
      PortBindings: {} as {
        [key: string]: {
          HostIP: string;
          HostPort: string;
        }[];
      },
    },
  };
  config.ExposedPorts[`${port}/tcp`] = {};
  config.HostConfig.PortBindings[`${port}/tcp`] = [
    {
      HostIP: "0.0.0.0",
      HostPort: port.toString(),
    },
  ];
  return config;
};

const createAnvilInternal = async ({
  anvil,
  instance,
}: CreateAnvilInternal) => {
  const args = toArgs(anvil);
  const argsString = args.join(" ");
  const idempotentKey = args.join("-");
  const container = await docker.createContainer({
    Image: "ghcr.io/foundry-rs/foundry:latest",
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: process.stdout.isTTY,
    OpenStdin: false,
    StdinOnce: false,
    Cmd: [`anvil ${argsString}`],
    Labels: { anvild: "anvild", anvild_idempotent_key: idempotentKey },
    ...createPortConfig(anvil.port),
  });

  await container.start();

  if (instance.attachLogs) {
    const stream = await container.attach({
      stream: true,
      stdout: true,
      stderr: true,
    });

    stream.pipe(process.stdout);
  }

  await waitForServer(anvil.port);

  return {
    containerId: container.id,
    idempotentKey,
    host: "http://127.0.0.1",
    port: anvil.port,
    async stop() {
      return await container.stop();
    },
  };
};

export const cleanAll = async () => {
  const list = await docker.listContainers({
    filters: { label: ["anvild=anvild"] },
  });

  if (!list.length) return;

  for (const service of list) {
    const container = await docker.getContainer(service.Id);
    await container.stop();
  }
};

export const createAnvil = async (opts: CreateAnvil) => {
  const props = await CreateAnvilSchema.parseAsync(opts);
  return await createAnvilInternal(props);
};

(async () => {
  await cleanAll();
  const node = await createAnvil({ instance: { attachLogs: false } });
  await node.stop();
  console.log(node);
})();
