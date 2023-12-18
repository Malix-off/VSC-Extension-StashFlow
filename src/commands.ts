import { contributes } from '../package.json';
import { commands, Disposable, Command } from 'vscode';

type CommandCallback = Parameters<typeof commands.registerCommand>[1];

interface CommandWithCallback extends Command {
	callback: CommandCallback,
}

function getValidCommandWithCallback(command: Command): CommandWithCallback | undefined {
	const callbackOfCommand = getCallback(command);
	if (callbackOfCommand) {
		return { ...command, callback: callbackOfCommand };
	} else {
		return undefined;
	}
}

function getValidCommandWithCallbackList(commandList: Command[]): CommandWithCallback[] {
	return commandList
		.map(getValidCommandWithCallback)
		.filter((maybeCommandWithCallback): maybeCommandWithCallback is CommandWithCallback => {
			return maybeCommandWithCallback !== undefined;
		});
}

function getCallback(command: Command): CommandCallback | undefined {
	let callback: CommandCallback | undefined;

	switch (command.command) {
		case ('stashflow.changeOutAction'): {
			callback = console.log;
			break;
		}
		case ('stashflow.changeBackAction'): {
			callback = console.log;
			break;
		}
		default: {
			console.error(`Callback of command "${command.command}" is not implemented`);
			callback = undefined;
		}
	}

	return callback;
}

function getDisposable(command: CommandWithCallback): Disposable {
	return commands.registerCommand(command.command, command.callback);
}

export let commandWithCallbackList: CommandWithCallback[] = [];
if (contributes.hasOwnProperty('commands')) {
	commandWithCallbackList.push(...getValidCommandWithCallbackList(contributes.commands));
}

export const initialDisposablesList: Disposable[] = commandWithCallbackList.map((commandWithCallback) => {
	return getDisposable(commandWithCallback);
});
