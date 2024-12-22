export interface PrettyPrintOptions {
  enabled?: boolean;
  stripCwd?: boolean | undefined;
  reverseSpans?: boolean | undefined;
  hideStackTrace?: boolean;
}

export const prettyPrintOptionsDefault: PrettyPrintOptions = {
  enabled: true,
  stripCwd: false,
  reverseSpans: true,
  hideStackTrace: true,
};
