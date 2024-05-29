import test from 'ava';
import {runAppleScript, runAppleScriptSync} from './index.js';

test('exec - async', async t => {
	t.is(await runAppleScript('return "unicorn"'), 'unicorn');
});

test('exec - sync', t => {
	t.is(runAppleScriptSync('return "unicorn"'), 'unicorn');
});

test('exec - async - non-human readable output', async t => {
	t.is(await runAppleScript('return "unicorn"', {humanReadableOutput: false}), '"unicorn"');
});

test('exec - sync - non-human readable output', t => {
	t.is(runAppleScriptSync('return "unicorn"', {humanReadableOutput: false}), '"unicorn"');
});

test('exec - async - non-human readable output (arrays)', async t => {
	t.is(await runAppleScript('return {"unicorn"}', {humanReadableOutput: false}), '{"unicorn"}');
});

test('exec - sync - non-human readable output (arrays)', t => {
	t.is(runAppleScriptSync('return {"unicorn"}', {humanReadableOutput: false}), '{"unicorn"}');
});

test('spawn - async', async t => {
	t.is(await runAppleScript('return "unicorn"', {spawnOrExec: 'spawn'}), 'unicorn');
});

test('spawn - sync', t => {
	t.is(runAppleScriptSync('return "unicorn"', {spawnOrExec: 'spawn'}), 'unicorn');
});

test('spawn - async - non-human readable output', async t => {
	t.is(await runAppleScript('return "unicorn"', {humanReadableOutput: false, spawnOrExec: 'spawn'}), '"unicorn"');
});

test('spawn - sync - non-human readable output', t => {
	t.is(runAppleScriptSync('return "unicorn"', {humanReadableOutput: false, spawnOrExec: 'spawn'}), '"unicorn"');
});

test('spawn - async - non-human readable output (arrays)', async t => {
	t.is(await runAppleScript('return {"unicorn"}', {humanReadableOutput: false, spawnOrExec: 'spawn'}), '{"unicorn"}');
});

test('spawn - sync - non-human readable output (arrays)', t => {
	t.is(runAppleScriptSync('return {"unicorn"}', {humanReadableOutput: false, spawnOrExec: 'spawn'}), '{"unicorn"}');
});

test('argument passing', async t => {
	t.is(await runAppleScript(['on run argv', 'return item 1 of argv', 'end run'], {args: ['unicorn', 'cake']}), 'unicorn');
});

test('multiline script with args', async t => {
	t.is(await runAppleScript('on run argv\nreturn item 1 of argv\nend run', {args: ['unicorn', 'cake']}), 'unicorn');
});
