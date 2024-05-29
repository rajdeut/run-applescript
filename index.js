import process from 'node:process';
import {promisify} from 'node:util';
import {spawn, spawnSync, execFile, execFileSync} from 'node:child_process';

const execFileAsync = promisify(execFile);

export async function runAppleScript(
	script,
	{humanReadableOutput = true, spawnOrExec = 'exec', args = []} = {},
) {
	platformCheck();
	return executeAppleScriptAsync({
		script,
		humanReadableOutput,
		sync: false,
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
		sync: true,
		spawnOrExec,
		args,
	});
}

function platformCheck() {
	if (process.platform !== 'darwin') {
		throw new Error('macOS only');
	}
}

function prepareScript(script) {
	if (!Array.isArray(script)) {
		script = script.split('\n');
	}

	// Loop through script and add another element containing "-e" in front of each item
	return script.map(item => '-e ' + item.replaceAll('\\', '\\\\'));
	// .replaceAll('"', '\\"')]);
}

function executeAppleScriptSync({
	script,
	humanReadableOutput = true,
	args = [],
	spawnOrExec = 'spawn',
}) {
	const outputArguments = humanReadableOutput ? [] : ['-ss'];

	// ExecFile - Sync
	if (spawnOrExec === 'exec') {
		const stdout = execFileSync(
			'osascript',
			[...prepareScript(script), ...args, ...outputArguments],
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
		[...prepareScript(script), ...args, ...outputArguments],
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

async function executeAppleScriptAsync({
	script,
	humanReadableOutput = true,
	args = [],
	spawnOrExec = 'spawn',
}) {
	const outputArguments = humanReadableOutput ? [] : ['-ss'];

	// ExecFile - Async
	if (spawnOrExec === 'exec') {
		const {stdout} = await execFileAsync('osascript', [
			...prepareScript(script),
			...args,
			...outputArguments,
		]);
		return stdout.trim();
	}

	// Spawn - ASync
	const child = spawn('osascript', [
		...prepareScript(script),
		...args,
		...outputArguments,
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
