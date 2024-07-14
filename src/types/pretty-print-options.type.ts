export interface PrettyPrintOptions {
  enabled?: boolean;
  stripCwd?: boolean | undefined;
  reverseSpans?: boolean | undefined;
}

export const prettyPrintOptionsDefault: PrettyPrintOptions = {
  enabled: true,
  stripCwd: false,
  reverseSpans: true,
};
