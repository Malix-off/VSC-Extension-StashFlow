import { contributes } from '../package.json';
import { commands, Disposable, Command } from "vscode";

type CommandCallback = Parameters<typeof commands.registerCommand>[1];

interface CommandWithCallback extends Command {
	callback: CommandCallback,
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

export const commandList: CommandWithCallback[] = (contributes.commands as Command[])
	.map((command): CommandWithCallback | void => {
		const callbackOfCommand = getCallbackOfCommand(command);
		if (callbackOfCommand) {
			return { ...command, callback: callbackOfCommand };
		}
	})
	.filter((maybeCommandWithCallback): maybeCommandWithCallback is CommandWithCallback => {
		return maybeCommandWithCallback !== undefined;
	});

export const disposableList: Disposable[] = commandList.map((command) => {
	return getDisposableOfCommand(command);
});
