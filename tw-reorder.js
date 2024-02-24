// This Source Code Form is licensed MPL-2.0: http://mozilla.org/MPL/2.0
"use strict";

import * as prettier from "prettier";
import * as fs from 'fs';

const prettier_config = {
  // https://www.npmjs.com/package/prettier-plugin-tailwindcss
  // tailwindConfig: './tailwind.config.js',
  plugins: ["prettier-plugin-tailwindcss"],
  parser: "babel",
  semi: true,
};

const rx_class_nowsp = /(?<=\bclass[a-z_0-9]*=)('[^\'\"]+\s[^\'\"]+'|"[^\"]+\s[^\"]+"|`[^\`\"]+\s[^\`\"]+`)/gi;
const rx_class = /(?<=\bclass[a-z_0-9]*\s*=\s*)('[^\'\"]+\s[^\'\"]+'|"[^\"]+\s[^\"]+"|`[^\`\"]+\s[^\`\"]+`)/gi;
const rx_apply = /(?<=@apply\b)(\s+[^;`"']+\s[^;`"']+;)/g;

/// Reorder all tailwind class attributes in the input file, detected via regular expressions.
async function process_file (filename, { inplace, ignorespace })
{
  const itext = String (fs.readFileSync (filename));
  const regex = ignorespace ? rx_class : rx_class_nowsp;
  let otext = await async_replace (itext, regex, tw_reorder);
  otext = await async_replace (otext, rx_apply, tw_reorder);
  if (!inplace)
    process.stdout.write (otext);
  else if (otext !== itext)
    fs.writeFileSync (filename, otext);
}

/// Reorder tailwind class names in a `class="tw..."` attribute.
async function tw_reorder (classattr)
{
  const separators = "'\"`:;\t \n\v\f";
  const strip_separators = separators.search (classattr[0]) >= 0 && separators.search (classattr[classattr.length -1]) >= 0;
  const twstring = !strip_separators ? classattr : classattr.substr (1, classattr.length -2);
  // pad `class='tw'` to a valid html statement that prettier can digest
  const istmt = '<br class="' + twstring + '" />';
  const ostmt = await prettier.format (istmt, prettier_config);
  if (0)
    console.error ("INPUT :", istmt, "\nOUTPUT:", ostmt);
  // strip html statemnt
  const barestmt = ostmt.replace (/^\s*;?\s*<br\s+class="|"\s*\/>\s*;?\s*$/g, '');
  const result = !strip_separators ? barestmt : classattr[0] + barestmt + classattr[classattr.length -1];
  return result;
}

/// Implements `string.replace (pattern, func)` for `async func`.
async function async_replace (string, regex, asyncfunc)
{
  const replacements = await Promise.all (Array.from (string.matchAll (regex),
						      match => asyncfunc (...match)));
  let i = 0;
  return string.replace (regex, () => replacements[i++]);
}

// Parse arguments, usage: tw-reorder.js [--inplace] {FILE...}
const args = process.argv.slice (2); // skip [0]='node' [1]='script.js'
let files = [], inplace = false, ignorespace = false;
for (let arg of args) {
  if ('--inplace' === arg)
    inplace = true;
  else if ('-b' === arg)
    ignorespace = true;
  else
    files.push (arg);
}

// Reformat all given files
for (let file of files)
  await process_file (file, { inplace, ignorespace });
