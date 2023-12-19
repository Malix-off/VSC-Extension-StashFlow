import { extensions, Disposable } from 'vscode';
import { API, GitExtension, Repository } from '../lib/vscodeGitExtension';
import { extensionContextGlobal } from './main';

interface IRepositoryWithPreviousState extends Repository {
	previousState: Repository["state"];
}

interface IAPIWithPreviousRepositories extends API {
	repositories: IRepositoryWithPreviousState[];
	previousRepositories: IAPIWithPreviousRepositories["repositories"];
}

function initializeIRepositoryWithPreviousState(repository: Repository): IRepositoryWithPreviousState {
	return {
		...repository,
		previousState: repository.state,
	};
}

type RepositoryDisposable = Disposable;
type APIDisposable = Disposable;

let repositoryDisposablesMap: Map<IRepositoryWithPreviousState["rootUri"], RepositoryDisposable[]> = new Map();

function getDisposablesOfRepository(repository: IRepositoryWithPreviousState): RepositoryDisposable[] {
	const repositoryDisposables: RepositoryDisposable[] = [
		getDisposableOfRepositoryStateChange(repository),
	];
	repositoryDisposablesMap.set(repository.rootUri, repositoryDisposables);
	return repositoryDisposables;
}

function disposeDisposablesOfRepository(repository: IRepositoryWithPreviousState) {
	repositoryDisposablesMap.get(repository.rootUri)!
		.forEach((disposable: Disposable) => {
			disposable.dispose();
		});
	repositoryDisposablesMap.delete(repository.rootUri)!;
}

function initializeIAPIWithPreviousRepositories(api: API): IAPIWithPreviousRepositories {
	const initializedIRepositoriesWithPreviousState = api.repositories.map((repository) => initializeIRepositoryWithPreviousState(repository));
	return {
		...api,
		repositories: initializedIRepositoriesWithPreviousState,
		previousRepositories: initializedIRepositoriesWithPreviousState,
	};
}

const vscodeGitExtensionApiInstance: IAPIWithPreviousRepositories = initializeIAPIWithPreviousRepositories(
	extensions.getExtension<GitExtension>('vscode.git')!.exports.getAPI(1),
);

function getDisposableOfRepositoryStateChange(repository: IRepositoryWithPreviousState): RepositoryDisposable {
	return repository.state.onDidChange(() => {
		console.log(repository.state);
		// repository.previousState != repository.state
		// if (
		// 	// branch change
		// ) {
		// 	handleBranchChange(repository);
		// } else if (
		// 	// branch rename
		// ) {
		// 	handleBranchRename(repository);
		// } else if (
		// 	// stash rename
		// ) {
		// 	handleStashRename(repository);
		// }
		actualizePreviousState(repository);
	});
}

function actualizePreviousState(repository: IRepositoryWithPreviousState): void {
	repository.previousState = repository.state;
}

// function handleBranchRename(repository: IRepositoryWithPreviousState): void {
// 	// repository.previousState != repository.state
// }

// function handleBranchChange(repository: IRepositoryWithPreviousState): void {
// 	// repository.previousState != repository.state
// }

// function handleStashRename(repository: IRepositoryWithPreviousState): void {
// 	// repository.previousState != repository.state
// }

function getDisposableOfRepositoryOpened(api: IAPIWithPreviousRepositories): APIDisposable {
	return api.onDidOpenRepository((repository) => {
		extensionContextGlobal.subscriptions.push(
			...getDisposablesOfRepository(
				initializeIRepositoryWithPreviousState(repository)
			)
		);
	});
}

function getDisposableOfRepositoryClosed(api: IAPIWithPreviousRepositories): APIDisposable {
	return api.onDidCloseRepository((repository) => {
		disposeDisposablesOfRepository(repository as IRepositoryWithPreviousState);
	});
}

const initialInitializedRepositories = vscodeGitExtensionApiInstance.repositories;

const initialInitializedRepositoriesDisposables: RepositoryDisposable[] = initialInitializedRepositories
	.map((repository) => getDisposablesOfRepository(repository))
	.flat();

export const initialDisposablesList: Disposable[] = [
	...initialInitializedRepositoriesDisposables,
	getDisposableOfRepositoryOpened(vscodeGitExtensionApiInstance),
	getDisposableOfRepositoryClosed(vscodeGitExtensionApiInstance),
];
