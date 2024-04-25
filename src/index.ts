import Docker from "dockerode";
import {
  CreateAnvilSchema,
  type CreateAnvilInternal,
  type CreateAnvil,
  type AnvilOptions,
  AnvilOptionsSchema,
} from "./schema";
import { toArgs } from "./options-to-args";
import { waitForServerPort, waitForServerStdout } from "./wait-for-server";

const ANVIL_DEFAULT_IMAGE = "ghcr.io/foundry-rs/foundry:master";

const docker = new Docker();

async function pullImage(image: string) {
  return new Promise((resolve, reject) => {
    docker.pull(image, (err: any, stream: NodeJS.ReadableStream) => {
      if (err) {
        reject(err);
      } else {
        docker.modem.followProgress(
          stream,
          (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          }
          // (event) => console.log(event.status)
        );
      }
    });
  });
}

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

  await pullImage(ANVIL_DEFAULT_IMAGE);

  const container = await docker.createContainer({
    Image: ANVIL_DEFAULT_IMAGE,
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

  const stream = await container.attach({
    stream: true,
    stdout: true,
    stderr: true,
  });

  await waitForServerPort(anvil.port);
  await waitForServerStdout(stream);

  if (instance.attachLogs) {
    stream.pipe(process.stdout);
  } else {
    stream.end();
  }

  const node = {
    containerId: container.id,
    idempotentKey,
    host: "http://127.0.0.1",
    port: anvil.port,
    url: `http://127.0.0.1:${anvil.port}`,
    async stop() {
      return await container.stop();
    },
  };

  return node;
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
