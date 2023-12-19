import { Activate, Deactivate, ExtensionContext } from 'vscode';
import { initialDisposablesList as initialCommandDisposableList } from './commands';
import { initialDisposablesList as initialGitDisposablesList } from './vscodeGitExtensionApiClient';

export var extensionContextGlobal: ExtensionContext;

export const activate: Activate = function (extensionContext) {
	extensionContextGlobal = extensionContext;
	console.log('StashFlow Activated');
	extensionContextGlobal.subscriptions.push(
		...initialCommandDisposableList,
		...initialGitDisposablesList,
	);
}

export const deactivate: Deactivate = function () {
	console.log('StashFlow Deactivated');
}
