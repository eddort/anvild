import net from "net";

export function waitForServer(port: number) {
  return new Promise((resolve, reject) => {
    const serverCheckInterval = 500;
    const maxAttempts = 30;

    let attempts = 0;

    const checkServer = () => {
      const socket = net.createConnection(port, "127.0.0.1");

      socket.on("connect", () => {
        socket.end();
        clearInterval(interval);
        resolve(true);
      });

      socket.on("error", () => {
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          reject(new Error("Timeout: server unavailable"));
        }
      });
    };

    const interval = setInterval(checkServer, serverCheckInterval);
  });
}
