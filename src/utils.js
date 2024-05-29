import fs from 'node:fs';
import process from 'node:process';

export function platformCheck() {
	if (process.platform !== 'darwin') {
		throw new Error('macOS only');
	}
}

export function prepareScript(script) {
	if (!Array.isArray(script)) {
		// Check if the script string is a file path && file exists
		if (script.endsWith('.scpt') || script.endsWith('.applescript')) {
			if (fs.existsSync(script)) {
				return [script];
			}

			throw new Error(
				`AppleScript does not exist to run: ${script}`,
			);
		}

		script = script.split('\n');
	}

	// Loop through script and add another element containing "-e" in front of each item
	return script.map(item => '-e ' + item.replaceAll('\\', '\\\\'));
	// .replaceAll('"', '\\"')]);
}
