const fs = require("fs");
const pandoc = require("pandoc-filter-promisified");
const extractSectionFactory = require("./extractSection")

const { CodeBlock } = pandoc;

function filterOutIncludeHeader(headers) {
    const [_, classes, keyValuePairs] = headers;
    const newKeyValuePairs = keyValuePairs.filter(([key, value]) => key !== `include`)
    const newHeaders = [headers[0], headers[1], newKeyValuePairs]
    return newHeaders;
}

function replaceContentSections(contentString, file) {
    const lines = fs.readFileSync(file, 'utf8').split(`\n`);
    const sectionDefinitions = contentString.split(`\n`)
    
    const extractSection = extractSectionFactory(lines)
    const sections = sectionDefinitions.map(extractSection).join(`\n`)

    return sections;
}

async function action(elt, pandocOutputFormat, meta) {
  if (elt.t === `CodeBlock`) {
    console.warn(JSON.stringify(elt, null, 4));
    const [headers, content] = elt.c;
    const [_, classes, keyValuePairs] = headers;

    const includeKeyValuePair = keyValuePairs.find(([key, value]) => key === `include`)

    // it's a normal code block, no need to do anything
    if(!includeKeyValuePair) return;

    const [, includeValue] = includeKeyValuePair;

    // filter out the include value if another filter processes this code block
    const newHeaders = filterOutIncludeHeader(headers)

    const newContent = replaceContentSections(content, includeValue)
    return CodeBlock(newHeaders, newContent);
  }
}

module.exports = action;
