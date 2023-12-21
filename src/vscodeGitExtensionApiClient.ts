import { extensions, Disposable, createDisposable } from 'vscode';
import { API, GitExtension, Repository } from '../lib/vscodeGitExtension';
import { extensionContextGlobal } from './main';

var vscodeGitExtensionApiInstance: API = extensions.getExtension<GitExtension>('vscode.git')!.exports.getAPI(1);

module repositoryManager {
	type Key = Repository['rootUri'];
	type Value = {
		previousState: Repository['state'] | undefined,
		disposableList: disposableManager.RepositoryDisposable[],
	};

	const map: Map<Key, Value> = new Map();

	export function add(repository: Repository) {
		return map.set(
			repository.rootUri,
			{
				previousState: undefined,
				disposableList: disposableManager.initializeRepositoryDisposables(repository),
			}
		);
	}

	export function getPreviousState(repository: Repository) {
		return map.get(repository.rootUri)!.previousState;
	}

	export function actualizePreviousState(repository: Repository) {
		map.get(repository.rootUri)!.previousState = repository.state;
	}

	export function pushDisposables(repository: Repository, disposables: Value['disposableList']) {
		return map.get(repository.rootUri)!.disposableList.push(...disposables);
	}

	export function remove(repository: Repository) {
		map.get(repository.rootUri)!.disposableList
			.forEach((disposable) => {
				disposable.dispose();
			});
		return map.delete(repository.rootUri)!;
	}
}

module disposableManager {
	export type RepositoryDisposable = Disposable;
	export type APIDisposable = Disposable;


	const initialRepositoryDisposables: ((repository: Repository) => RepositoryDisposable)[] = [
		StateChangeDisposableOf,
	];

	const initialAPIDisposables: ((api: API) => APIDisposable)[] = [
		disposableOfRepositoryOpened,
		disposableOfRepositoryClosed,
	];

	function StateChangeDisposableOf(repository: Repository): RepositoryDisposable {
		return createDisposable(
			extensionContextGlobal,
			repository.state.onDidChange(() => {
				console.log(`Repository: ${repository.rootUri}\nEvent: State Changed\nPrevious: ${repositoryManager.getPreviousState(repository)}\nNew: ${repository.state}`);
				/*
					if (
						// Branch Changed
					) {
						Actions.handleBranchChange(repository);
					} else if (
						// Branch Renamed
					) {
						Actions.handleBranchRename(repository);
					} else if (
						// Stash Renamed
					) {
						Actions.handleStashRename(repository);
					}
				*/
				repositoryManager.actualizePreviousState(repository);
			})
		);
	}

	function disposableOfRepositoryOpened(api: API): APIDisposable {
		return createDisposable(
			extensionContextGlobal,
			api.onDidOpenRepository((repository) => {
				repositoryManager.add(repository);
			})
		);
	}

	function disposableOfRepositoryClosed(api: API): APIDisposable {
		return createDisposable(
			extensionContextGlobal,
			api.onDidCloseRepository((repository) => {
				repositoryManager.remove(repository);
			})
		);
	}

	export function initializeRepositoryDisposables(repository: Repository): RepositoryDisposable[] {
		return initialRepositoryDisposables.map((disposable) => disposable(repository));
	}

	export function initializeAPIDisposables(api: API): APIDisposable[] {
		return initialAPIDisposables.map((disposable) => disposable(api));
	}
}

/*
	namespace actions {
		export function handleBranchRename(repository: Repository): void {
		}

		export function handleBranchChange(repository: Repository): void {
		}

		export function handleStashRename(repository: Repository): void {
		}
	}
*/

export default function main(): void {
	vscodeGitExtensionApiInstance.repositories.forEach((repository) => repositoryManager.add(repository));
	disposableManager.initializeAPIDisposables(vscodeGitExtensionApiInstance);
}
