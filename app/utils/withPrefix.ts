const storagePrefix = 'dotoday';

type TagFunction = (
  strings: TemplateStringsArray,
  ...values: string[]
) => string;
const idTag: TagFunction = (strings, ...values) =>
  strings.reduce(
    (acc, str, i) => acc + (i < values.length ? `${str}${values[i]}` : str),
    '',
  );
export const withPrefix: TagFunction = (strings, ...values) =>
  `${storagePrefix}:${idTag(strings, ...values)}`;
