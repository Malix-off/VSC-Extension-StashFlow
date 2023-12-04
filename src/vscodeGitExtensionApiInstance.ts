import { extensions } from 'vscode';
import { API, GitExtension } from '../lib/vscodeGitExtension';

export const vscodeGitExtensionApiInstance: API = extensions.getExtension<GitExtension>('vscode.git')!.exports.getAPI(1);
