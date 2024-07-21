import { exec, type ExecException } from 'node:child_process';

export const execShellCommand = async (
  cmd: string,
): Promise<{ error?: string | ExecException; result?: string }> =>
  await new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error !== null) {
        resolve({ error });
      }
      if (stderr?.length > 0) {
        resolve({ error: stderr.substring(stderr.indexOf('{')) });
      }

      resolve({ result: stdout });
    });
  });
