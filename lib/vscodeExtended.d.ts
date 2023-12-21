declare module 'vscode' {
	/**
	 * **Required**
	 *
	 * Entry point of a VSCode Extension
	 *
	 * Called when the first [Activation Event](https://code.visualstudio.com/api/references/activation-events) happens
	 *
	 * [_(Source)_](https://code.visualstudio.com/api/get-started/extension-anatomy#extension-entry-file)
	 */
	export type Activate = (extensionContext: ExtensionContext) => void;

	/**
	 * **Optional**
	 *
	 * Called before an extension is deactivated
	 *
	 * Gives a chance to clean up before an extension becomes deactivated
	 *
	 * For many extensions, explicit cleanup may not be required, and the deactivate method can be removed. However, if an extension needs to perform an operation when VS Code is shutting down or the extension is disabled or uninstalled, this is the method to do so.
	 *
	 * [_(Source)_](https://code.visualstudio.com/api/get-started/extension-anatomy#extension-entry-file)
	 */
	export type Deactivate = () => void;

	/**
	 * - [Motivations](https://stackoverflow.com/questions/55554018/purpose-for-subscribing-a-command-in-vscode-extension#:~:text=all%20disposable%20objects%20that%20your%20extension%20creates%20should%20go%20into%20subscriptions%20in%20some%20way%20so%20that%20they%20can%20be%20properly%20cleaned%20up%20when%20your%20extension%20is%20unloaded)
	 */
	export function createDisposable<T extends Disposable>(context: ExtensionContext, disposable: T): T {
		context.subscriptions.push(disposable);
		return disposable;
	};
}
