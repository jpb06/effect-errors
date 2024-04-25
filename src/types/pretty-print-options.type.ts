export interface PrettyPrintOptions {
  enabled?: boolean;
  stripCwd?: boolean;
  reverseSpans?: boolean;
}

export const prettyPrintOptionsDefault: PrettyPrintOptions = {
  enabled: true,
  stripCwd: false,
  reverseSpans: true,
};
