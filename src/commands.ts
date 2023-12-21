import { contributes } from '../package.json';
import { commands, Disposable, Command, createDisposable } from 'vscode';
import { extensionContextGlobal } from './main';

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
	switch (command.command) {
		case ('stashflow.changeOutAction'): {
			return console.log;
		}
		case ('stashflow.changeBackAction'): {
			return console.log;
		}
		default: {
			console.error(`Callback of command "${command.command}" is not implemented`);
			return undefined;
		}
	}
}

function getDisposable(command: CommandWithCallback): Disposable {
	return createDisposable(
		extensionContextGlobal,
		commands.registerCommand(command.command, command.callback)
	);
}

let commandWithCallbackList: CommandWithCallback[] = [
	...getValidCommandWithCallbackList(contributes.commands)
];

export default function main(): void {
	commandWithCallbackList.forEach((commandWithCallback) => {
		return getDisposable(commandWithCallback);
	});
}
