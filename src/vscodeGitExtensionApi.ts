import { extensions } from "vscode";
import { API, GitExtension } from "../lib/vscodeGitExtension";

export const vscodeGitExtensionApi: API = extensions.getExtension<GitExtension>('vscode.git')!.exports.getAPI(1);
