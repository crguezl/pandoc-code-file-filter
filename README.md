# pandoc-code-file-filter

A filter for pandoc to include code sections from a file.

## Installation & Usage

```
npm install -g pandoc-code-file-filter
```

Make sure the global npm modules are in your `$PATH`
Then you can use the filter with the `--filter` option

```
pandoc <args> --filter pandoc-code-file-filter
```

## Features

In contrast to [pandoc-code-filter]() you can include multiple sections.

Sections can be defined either by:

* **line numbers**: Simply include a section consisting of a range of line numbers: `3-20`, `10-` (10 to end of file)
* **regex**: Include a section beginning at the first match of a regex up to the first match of the second regex:
    ```
    /function hello()/ - /return/
    ```

In Markdown you create a code block and use curly braces to define the include path.
Sections are defined in the body of the code block line by line.

````
```{include=test.cpp}
3-20
22-25
/function hello()/ - /return/
``` 
````

You can still add classes to the code block:

````
```{include=test.cpp .cpp}
``` 

// same as

```cpp
<test.cpp>
``` 
````

You can also write code, new lines or comments in between the sections:

````
```{include=test.cpp .cpp}
3-20

// some comment introducing the next section
/function hello()/ - /return/
``` 
````