import Docker from "dockerode";
import { AnvilOptionsSchema, type AnvilOptions } from "./schema";
import { toArgs } from "./options-to-args";

const docker = new Docker();

type CreateAnvilDeps = {
  anvil: AnvilOptions;
};

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

const createAnvil = async ({ anvil }: CreateAnvilDeps) => {
  const list = await docker.listContainers({
    filters: { label: ["anvild=anvild"] },
  });
  console.log(list);
  if (list.length) {
    for (const service of list) {
      const container = await docker.getContainer(service.Id);
      await container.stop();
    }
    //   console.log(list);
    return;
  }
  const args = toArgs(anvil).join(" ");
  const container = await docker.createContainer({
    Image: "ghcr.io/foundry-rs/foundry:latest",
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: process.stdout.isTTY,
    OpenStdin: false,
    StdinOnce: false,
    Cmd: [`anvil ${args}`],
    Labels: { anvild: "anvild" },
    ...createPortConfig(anvil.port),
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
  const anvil = await AnvilOptionsSchema.parseAsync({ port: 9002 });
  await createAnvil({
    anvil,
  });
})();
