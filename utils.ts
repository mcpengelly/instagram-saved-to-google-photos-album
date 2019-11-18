import { emptyDir } from 'fs-extra';

export async function clearDirectory(dirPath: string): Promise<void> {
  await emptyDir(dirPath);
}
