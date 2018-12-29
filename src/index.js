const fs = require("fs");
const pandoc = require("pandoc-filter-promisified");
const dedent = require(`./dedent`);
const extractSectionFactory = require("./extractSection");

const { CodeBlock } = pandoc;

const defaultConfig = {
  include: ``,
  dedent: true
};

function filterOutOwnHeaders(headers) {
  const [_, classes, keyValuePairs] = headers;
  const ownHeaders = Object.keys(defaultConfig);

  const newKeyValuePairs = keyValuePairs.filter(
    ([key, value]) => !ownHeaders.includes(key)
  );
  const newHeaders = [headers[0], headers[1], newKeyValuePairs];

  return newHeaders;
}

function replaceContentSections(contentString, config) {
  const codeLines = fs.readFileSync(config.include, "utf8").split(`\n`);
  const sectionDefinitions = contentString.split(`\n`);

  const extractSection = extractSectionFactory(codeLines);
  let sections = sectionDefinitions.map(extractSection);

  if (config.dedent) {
    sections = sections.map(dedent);
  }

  return sections.join(`\n`);
}

function getConfig(headers) {
  const [_, classes, keyValuePairs] = headers;

  const config = defaultConfig;
  Object.keys(config).forEach(configKey => {
    const keyValuePair = keyValuePairs.find(
      ([key, value]) => key === configKey
    );
    if (!keyValuePair) return;

    const [, value] = keyValuePair;
    config[configKey] = value;
  });

  // string to bool
  if (typeof config.dedent === `string`)
    config.dedent = JSON.parse(config.dedent);
  return config;
}

async function action(elt, pandocOutputFormat, meta) {
  if (elt.t === `CodeBlock`) {
    // console.warn(JSON.stringify(elt, null, 4));
    const [headers, content] = elt.c;

    const config = getConfig(headers);

    // it's a normal code block, no need to do anything
    if (!config.include) return;

    // filter out the include value if another filter processes this code block
    const newHeaders = filterOutOwnHeaders(headers);
    let newContent = replaceContentSections(content, config);

    return CodeBlock(newHeaders, newContent);
  }
}

module.exports = action;
