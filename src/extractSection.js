// match line numbers 232-5353
// or regexp /asdf/ - /wasd/
// and with offsets /asdf/-5 - /wasd/+2
const sectionRegEx = /^\s*(\d*|\/.*\/)([+-]\d*)?\s*-\s*(\d*|\/.*\/)([+-]\d*)?\s*$/i;

const isRegEx = marker => marker.startsWith(`/`);

const getMatchingLineNumber = (lines, regEx, start = 0) => {
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }

  // remove beginning and closing slash
  regEx = new RegExp(escapeRegExp(regEx.slice(1, -1)), `i`);

  for (let i = start; i < lines.length; i++) {
    if (regEx.test(lines[i])) return i + 1;
  }

  throw new Error(
    `pandoc-code-file-filter: RegExp does not match any line: "${String(
      regEx
    )}"`
  );
};

const extractSectionFactory = lines => sectionDefinition => {
  const matches = sectionDefinition.match(sectionRegEx);

  // empty section definition or text that does not match a section definition is just returned the same way
  if (!matches) return sectionDefinition;

  const [_, begin, beginOffset, end, endOffset] = matches;
  //   console.warn(begin, end, beginOffset, endOffset);

  let beginLineNumber = null;
  let endLineNumber = null;

  if (isRegEx(begin)) {
    beginLineNumber = getMatchingLineNumber(lines, begin);
  } else {
    beginLineNumber = parseInt(begin, 10);
  }

  if (isRegEx(end)) {
    endLineNumber = getMatchingLineNumber(lines, end, beginLineNumber);
  } else if (end === ``) {
    // can leave out end marker
    endLineNumber = lines.length - 1;
  } else {
    endLineNumber = parseInt(end, 10);
  }

  if (beginOffset) beginLineNumber += parseInt(beginOffset, 10);
  if (endOffset) endLineNumber += parseInt(endOffset, 10);

  return lines.slice(beginLineNumber - 1, endLineNumber).join(`\n`);
};

module.exports = extractSectionFactory;
