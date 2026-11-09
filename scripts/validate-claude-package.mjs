#!/usr/bin/env node
// Validate the small Claude directory package without requiring account access.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (rel) => readFileSync(path.join(root, rel), 'utf8');
const plugin = JSON.parse(read('.claude-plugin/plugin.json'));
const marketplace = JSON.parse(read('.claude-plugin/marketplace.json'));

assert.match(plugin.name, /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);
assert.equal(plugin.name, 'kernelcad-design-skills');
assert.equal(plugin.version, read('VERSION').trim());
assert.equal(plugin.repository, 'https://github.com/w1ne/kernelcad-skills');
assert.equal(plugin.license, 'MIT');
assert(!('skills' in plugin), 'Default skill discovery requires no explicit skills array');
assert(!('kernelcad' in plugin), 'Do not ship nonstandard manifest fields');
assert(!('mcpServers' in plugin), 'Use the existing KernelCAD connector, not a duplicate server');

const published = marketplace.plugins.find((p) => p.name === plugin.name);
assert(published, 'Marketplace must contain the plugin');
assert.equal(published.version, plugin.version);
assert.equal(published.source, './');
assert(read('README.md').includes(`claude plugin install ${plugin.name}@${marketplace.name}`));

const dir = path.join(root, 'skills');
const names = readdirSync(dir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name).sort();
assert(names.length >= 28, `Missing skills: found only ${names.length}`);
for (const name of names) {
  const text = read(`skills/${name}/SKILL.md`);
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1];
  assert(frontmatter, `Missing frontmatter: ${name}`);
  assert(new RegExp(`^name:\\s*${name}\\s*$`, 'm').test(frontmatter), `Invalid skill name: ${name}`);
  assert(/^description:\s*\S/m.test(frontmatter), `Missing description: ${name}`);
}

const image = readFileSync(path.join(root, '.claude-plugin/icon.png'));
assert(image.byteLength < 2 * 1024 * 1024, 'Icon exceeds 2 MiB');
assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'Icon must be a PNG');
assert.equal(image.readUInt32BE(16), 512, 'Icon must be 512 px wide');
assert.equal(image.readUInt32BE(20), 512, 'Icon must be 512 px high');
console.log(`PASS: ${plugin.name}@${plugin.version}, ${names.length} discoverable skills, consistent marketplace, 512px icon`);
