import { extensions, Disposable, Uri } from 'vscode';
import { API, GitExtension, Repository, RepositoryState } from '../lib/vscodeGitExtension';
import { extensionContext } from './main';

interface IRepositoryWithPreviousState extends Repository {
	previousState: RepositoryState;
}

interface IAPIWithPreviousRepositories extends API {
	repositories: IRepositoryWithPreviousState[];
	previousRepositories: IRepositoryWithPreviousState[];
}

function initializeIRepositoryWithPreviousState(repository: Repository): IRepositoryWithPreviousState {
	return {
		...repository,
		previousState: repository.state,
	};
}

let repositoryStateChangedDisposableMap: Map<Uri, Disposable> = new Map();

function getDisposablesOfRepository(repository: IRepositoryWithPreviousState): Disposable {
	const repositoryDisposable = getDisposableOfRepositoryStateChange(repository);
	repositoryStateChangedDisposableMap.set(repository.rootUri, repositoryDisposable);
	return repositoryDisposable;
}

function initializeIAPIWithPreviousRepositories(api: API): IAPIWithPreviousRepositories {
	const initializedIRepositoriesWithPreviousState = api.repositories.map((repository: Repository) => initializeIRepositoryWithPreviousState(repository));
	return {
		...api,
		repositories: initializedIRepositoriesWithPreviousState,
		previousRepositories: initializedIRepositoriesWithPreviousState,
	};
}

const vscodeGitExtensionApiInstance: IAPIWithPreviousRepositories = initializeIAPIWithPreviousRepositories(
	extensions.getExtension<GitExtension>('vscode.git')!.exports.getAPI(1),
);

function getDisposableOfRepositoryStateChange(repository: IRepositoryWithPreviousState): Disposable {
	return repository.state.onDidChange(() => {
		// repository.previousState != repository.state
		if (
			// branch change
		) {
			handleBranchChange(repository);
		} else if (
			// branch rename
		) {
			handleBranchRename(repository);
		} else if (
			// stash rename
		) {
			handleStashRename(repository);
		}
		actualizePreviousState(repository);
	});
}

function actualizePreviousState(repository: IRepositoryWithPreviousState): void {
	repository.previousState = repository.state;
}

function handleBranchRename(repository: IRepositoryWithPreviousState): void {
	// repository.previousState != repository.state
}

function handleBranchChange(repository: IRepositoryWithPreviousState): void {
	// repository.previousState != repository.state
}

function handleStashRename(repository: IRepositoryWithPreviousState): void {
	// repository.previousState != repository.state
}

function getDisposableOfRepositoryOpened(api: IAPIWithPreviousRepositories): Disposable {
	return api.onDidOpenRepository((repository: Repository) => {
		extensionContext.subscriptions.push(
			getDisposablesOfRepository(
				initializeIRepositoryWithPreviousState(repository)
			)
		);
	});
}

function getDisposableOfRepositoryClosed(api: IAPIWithPreviousRepositories): Disposable {
	return api.onDidCloseRepository((repository: Repository) => {
		repositoryStateChangedDisposableMap.get(repository.rootUri)!.dispose();
		repositoryStateChangedDisposableMap.delete(repository.rootUri)!;
	});
}

const initialRepositoriesDisposables = vscodeGitExtensionApiInstance.repositories.map((repository) => {
	return getDisposablesOfRepository(repository);
});

export const initialDisposablesList: Disposable[] = [
	...initialRepositoriesDisposables,
	getDisposableOfRepositoryOpened(vscodeGitExtensionApiInstance),
	getDisposableOfRepositoryClosed(vscodeGitExtensionApiInstance),
];
