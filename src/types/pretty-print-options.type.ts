export interface PrettyPrintOptions {
  stripCwd?: boolean;
  enabled?: boolean;
}

export const prettyPrintOptionsDefault: PrettyPrintOptions = {
  stripCwd: false,
  enabled: true,
};
