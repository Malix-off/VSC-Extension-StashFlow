import { contributes } from '../package.json';
import { commands, Disposable, Command } from 'vscode';

type CommandCallback = Parameters<typeof commands.registerCommand>[1];

interface CommandWithCallback extends Command {
	callback: CommandCallback,
}

function getValidCommandWithCallback(command: Command): CommandWithCallback | undefined {
	const callbackOfCommand = getCallbackOfCommand(command);
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

function getCallbackOfCommand(command: Command): CommandCallback | undefined {
	let commandCallback: CommandCallback | undefined;

	switch (command.command) {
		case ('stashflow.changeOutAction'): {
			commandCallback = console.log;
			break;
		}
		case ('stashflow.changeBackAction'): {
			commandCallback = console.log;
			break;
		}
		default: {
			console.error(`Callback of command "${command.command}" is not implemented`);
			commandCallback = undefined;
		}
	}

	return commandCallback;
}

function getDisposableOfCommand(command: CommandWithCallback): Disposable {
	return commands.registerCommand(command.command, command.callback);
}

export let commandWithCallbackList: CommandWithCallback[] = [];
if (contributes.hasOwnProperty('commands')) {
	commandWithCallbackList.push(...getValidCommandWithCallbackList(contributes.commands));
}

export const commandDisposableList: Disposable[] = commandWithCallbackList.map((commandWithCallback) => {
	return getDisposableOfCommand(commandWithCallback);
});
