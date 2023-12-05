import { ExtensionContext } from 'vscode';
import { commandDisposableList } from './commands';

export function activate(context: ExtensionContext): void {
	console.log('StashFlow Activated');
	context.subscriptions.push(
		...commandDisposableList,
	);
}

export function deactivate(): void {
	console.log('StashFlow Deactivated');
}
