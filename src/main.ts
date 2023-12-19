import { Activate, Deactivate, ExtensionContext } from 'vscode';
import { initialDisposablesList as initialCommandDisposableList } from './commands';
import { initialDisposablesList as initialGitDisposablesList } from './vscodeGitExtensionApiClient';

export let extensionContext: ExtensionContext;

export const activate: Activate = function (context) {
	extensionContext = context;
	console.log('StashFlow Activated');
	context.subscriptions.push(
		...initialCommandDisposableList,
		...initialGitDisposablesList,
	);
}

export const deactivate: Deactivate = function () {
	console.log('StashFlow Deactivated');
}
