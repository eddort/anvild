import Docker from "dockerode";
import {
  CreateAnvilSchema,
  type CreateAnvilInternal,
  type CreateAnvil,
  type AnvilOptions,
  AnvilOptionsSchema,
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

  if (instance.forceRecreate) {
    await cleanByConfig(anvil);
  }

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

export const cleanByConfig = async (anvilConfig: AnvilOptions) => {
  const config = await AnvilOptionsSchema.parseAsync(anvilConfig);
  const args = toArgs(config);
  const idempotentKey = args.join("-");
  const list = await docker.listContainers({
    filters: {
      label: ["anvild=anvild", `anvild_idempotent_key=${idempotentKey}`],
    },
  });

  if (!list.length) return false;

  for (const service of list) {
    const container = await docker.getContainer(service.Id);
    await container.stop();
  }

  return true;
};

export const createAnvil = async (opts: CreateAnvil) => {
  const config = await CreateAnvilSchema.parseAsync(opts);
  return await createAnvilInternal(config);
};
