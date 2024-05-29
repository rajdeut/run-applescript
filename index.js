import {platformCheck} from './src/utils.js';
import {executeAppleScriptAsync, executeAppleScriptSync} from './src/lib.js';

export async function runAppleScript(
	script,
	{humanReadableOutput = true, spawnOrExec = 'exec', args = []} = {},
) {
	platformCheck();
	return executeAppleScriptAsync({
		script,
		humanReadableOutput,
		spawnOrExec,
		args,
	});
}

export function runAppleScriptSync(
	script,
	{humanReadableOutput = true, spawnOrExec = 'exec', args = []} = {},
) {
	platformCheck();
	return executeAppleScriptSync({
		script,
		humanReadableOutput,
		spawnOrExec,
		args,
	});
}
