import { ExtensionContext } from 'vscode';
import { disposableList } from "./disposables";

export function activate(context: ExtensionContext): void {
	console.log('StashFlow Activated');
	context.subscriptions.push(...disposableList);
}

export function deactivate(): void {
	console.log('StashFlow Deactivated');
}
