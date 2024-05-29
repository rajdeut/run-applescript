export type Options = {
	/**
    Change the output style.

    When `false`, returns the value in a [recompilable source form](https://ss64.com/osx/osascript.html).

    @default true

    @example
    ```
    import {runAppleScript} from 'run-applescript';

    const result = await runAppleScript('return "unicorn"', {humanReadableOutput: false});

    console.log(result);
    //=> '"unicorn"'
    ```
    */
	readonly humanReadableOutput?: boolean;

	/**
    Additional arguments to pass to the script.

    @default []

    @example
    ```
    import {runAppleScript} from 'run-applescript';

    const result = await runAppleScript('return "unicorn"', {args: ['arg1', 'arg2']});

    console.log(result);
    //=> '"unicorn"'
    ```
    */
	readonly args?: string[];

	/**
    Whether to use 'spawn' or 'exec' for running the script.

    @default 'exec'

    @example
    ```
    import {runAppleScript} from 'run-applescript';

    const result = await runAppleScript('return "unicorn"', {spawnOrExec: 'spawn'});

    console.log(result);
    //=> '"unicorn"'
    ```
    */
	readonly spawnOrExec?: 'spawn' | 'exec';
};

/**
Run AppleScript asynchronously.

@param script - The script to run.
@returns The script result.

@example
```
import {runAppleScript} from 'run-applescript';

const result = await runAppleScript('return "unicorn"');

console.log(result);
//=> 'unicorn'
```
*/
export function runAppleScript(
	script: string,
	options?: Options
): Promise<string>;

/**
Run AppleScript synchronously.

@param script - The script to run.
@returns The script result.

@example
```
import {runAppleScriptSync} from 'run-applescript';

const result = runAppleScriptSync('return "unicorn"');

console.log(result);
//=> 'unicorn'
```
*/
export function runAppleScriptSync(script: string, options?: Options): string;
