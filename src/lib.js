
import {promisify} from 'node:util';
import {spawn, spawnSync, execFile, execFileSync} from 'node:child_process';
import {prepareScript} from './utils.js';

const execFileAsync = promisify(execFile);

export function executeAppleScriptSync({
	script,
	humanReadableOutput = true,
	args,
	spawnOrExec = 'spawn',
}) {
	if (!humanReadableOutput) {
		args.push('-ss');
	}

	// ExecFile - Sync
	if (spawnOrExec === 'exec') {
		const stdout = execFileSync(
			'osascript',
			[...prepareScript(script), ...args],
			{
				encoding: 'utf8',
				stdio: ['ignore', 'pipe', 'ignore'],
				timeout: 500,
			},
		);
		return stdout.trim();
	}

	// Spawn - Sync
	const result = spawnSync(
		'osascript',
		[...prepareScript(script), ...args],
		{
			stdio: ['ignore', 'pipe', 'ignore'],
		},
	);

	if (result.status !== 0) {
		throw new Error(
			`AppleScript exited with code ${result.status}: ${result.stderr.toString()}`,
		);
	}

	return result.stdout.toString().trim();
}

export async function executeAppleScriptAsync({
	script,
	humanReadableOutput = true,
	args,
	spawnOrExec = 'spawn',
}) {
	if (!humanReadableOutput) {
		args.push('-ss');
	}

	// ExecFile - Async
	if (spawnOrExec === 'exec') {
		const {stdout} = await execFileAsync('osascript', [
			...prepareScript(script),
			...args,
		]);
		return stdout.trim();
	}

	// Spawn - ASync
	const child = spawn('osascript', [
		...prepareScript(script),
		...args,
	]);
	return new Promise((resolve, reject) => {
		let stdout = '';
		child.stdout.on('data', data => {
			stdout += data.toString();
		});

		child.on('error', error => reject(error));

		child.on('close', code => {
			if (code === 0) {
				resolve(stdout.trim());
			} else {
				reject(new Error(`AppleScript exited with code ${code}`));
			}
		});
	});
}
