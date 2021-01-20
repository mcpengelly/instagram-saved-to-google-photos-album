import { emptyDir } from 'fs-extra';

export async function clearDirectory(dirPath: string): Promise<void> {
  console.log('cleaning up existing /images folder')
  await emptyDir(dirPath);
}
