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
}
