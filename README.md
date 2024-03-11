# Tailwind CSS Sorting for Emacs

Emacs script to run the [Tailwind CSS Prettier plugin](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) for class sorting via key binding.

The logic is split into two files:

- **tw-reorder.js** - NodeJS script to reorder Tailwind CSS classes in `class="..."` or `@apply...;` strings using Prettier.
  The script searches for `class(Name)?="tailwindclasses..."` assignments in the input via regular expressions and
  invokes `prettier-plugin-tailwindcss` to sort these snippets. No other contents are modified.
- **tw-reorder.el** - Emacs Lisp script to run `tw-reorder.js` on the current buffer via key binding

## Usage

1. **tw-reorder.js**:
   - Install `prettier-plugin-tailwindcss` and its dependencies:
     ```sh
     npm install	# prettier prettier-plugin-tailwindcss
     ```
   - Run the script on any HTML or JavaScript file that contains Tailwind CSS classes, e.g.:
     ```sh
     node tw-reorder.js index.html            # reorder classes in index.html, write to stdout
     node tw-reorder.js -b component.js       # ignore assignment whitespacs in: className = "..."
     node tw-reorder.js --inplace index.html  # reorder and write the result back into index.html
     ```
2. **tw-reorder.el**:
   - To add support to emacs, execute `(load-file "tw-reorder.el")` in emacs or use [require](https://www.gnu.org/software/emacs/manual/html_node/elisp/Named-Features.html#index-require).
     This defines a function that pastes the current buffer contents into the command `node tw-reorder.js -b` and replaces the current buffer contents with the result.
   - Open a file containing Tailwind CSS classes in Emacs, e.g. an HTML or JavaScript file.
   - Press `F8` to reformat and sort the Tailwind CSS classes in the current buffer.
   - The key binding can be modified by changing the `global-set-key` command in `tw-reorder.el`.

## License

This project is licensed under the [MPL-2.0](https://github.com/tim-janik/tw-reorder/blob/trunk/LICENSE) license.


## Example

```html
<!-- Before: -->
<div class="flex-col bg-gray-100 text-gray-900 flex rounded-lg justify-center shadow-md items-center py-8 mt-4 px-6 lg:w-1/2 w-full max-w-xl"></div>
<!-- After: -->
<div class="mt-4 flex w-full max-w-xl flex-col items-center justify-center rounded-lg bg-gray-100 px-6 py-8 text-gray-900 shadow-md lg:w-1/2"></div>
```
