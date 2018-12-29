# pandoc-code-file-filter

A filter for pandoc to include code sections from a file.

## Installation & Usage

```
npm install -g pandoc-code-file-filter
```

Make sure the global npm modules are in your `$PATH`.
Then you can use the filter with the `--filter` option

```
pandoc <args> --filter pandoc-code-file-filter
```

## Features

In contrast to [pandoc-include-code](https://github.com/owickstrom/pandoc-include-code), this filter allows to include multiple sections and define sections using string matching.

Sections can be defined either by:

* **line numbers**: Simply include a section consisting of a range of line numbers: `3-20`, `10-` (10 to end of file)
* **string matching**: Include a section beginning at the first match of a string up to the first match of the second string:
    ```
    /function hello()/ - /return/
    ```
* **offsets**: You can combine string matching with line offsets.
    First the line number matching the string is determined and a positive or negative offset is added to it.
    ```
    // will span a section from 5 lines before `function hello()` to the line after the `return` match
    /function hello()/-5 - /return/+1
    ```
* **dedent**: Automatically dedents common whitespace at the beginning of the section's lines. Can be turned off by passing `dedent=false`.

## Examples

In Markdown you create a code block and use curly braces to define the include path (relative to where pandoc is invoked from).
Sections are defined in the body of the code block line by line.

````
```{include=test.cpp dedent=false}
3-20
22-25
/function hello()/ - /return/


/slashes must be escaped! \/\/ code comment/ - /return/
``` 
````

You can still add **classes** to the code block:

````
```{include=test.cpp .cpp}
``` 

// same as

```cpp
<test.cpp>
``` 
````

You can also **write code, new lines or comments in between the sections**:

````
```{include=test.cpp .cpp}
3-20

// some comment introducing the next section, this will also be in the final output
/function hello()/ - /return/+1
``` 
````

> Note that if you want to use slashes in the string matching they need to be escaped: `\/`
