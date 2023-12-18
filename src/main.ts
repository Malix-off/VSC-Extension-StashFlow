import { ExtensionContext } from 'vscode';
import { initialDisposablesList as initialCommandDisposableList } from './commands';
import { initialDisposablesList as initialGitDisposablesList } from './vscodeGitExtensionApiClient';

export let extensionContext: ExtensionContext;

export function activate(context: ExtensionContext): void {
	extensionContext = context;
	console.log('StashFlow Activated');
	context.subscriptions.push(
		...initialCommandDisposableList,
		...initialGitDisposablesList
	);
}

export function deactivate(): void {
	console.log('StashFlow Deactivated');
}
