import { Activate, Deactivate, ExtensionContext } from 'vscode';
import commands from './commands';
import vscodeGitExtensionApiClient from './vscodeGitExtensionApiClient';

export var extensionContextGlobal: ExtensionContext;

export const activate: Activate = (extensionContext) => {
	extensionContextGlobal = extensionContext;
	console.log('StashFlow Activated');
	commands();
	vscodeGitExtensionApiClient();
}

export const deactivate: Deactivate = () => {
	console.log('StashFlow Deactivated');
}
