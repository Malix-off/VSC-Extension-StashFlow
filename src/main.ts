import { ExtensionContext } from 'vscode';
import { disposableList } from "./disposables";

export function activate(context: ExtensionContext): void {
	console.log('StashFlow Enabled');
	context.subscriptions.push(...disposableList);
	console.log('StashFlow Ready');
}

export function deactivate(): void {

}
