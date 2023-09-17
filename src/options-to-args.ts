function toFlagCase(key: string) {
  return `--${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`;
}
export function toArgs(options: {
  [key: string]: string | boolean | number | bigint | undefined;
}) {
  return Object.entries(options)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .flatMap(([key, value]) => {
      if (value === undefined) {
        return [];
      }

      const flag = toFlagCase(key);

      if (value === false) {
        return [];
      } else if (value === true) {
        return [flag];
      }

      const stringified = value.toString();
      if (stringified === "") {
        return [flag];
      }

      return [flag, stringified];
    });
}
