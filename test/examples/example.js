// match line numbers 232-5353
// or regexp /asdf/ - /wasd/
const sectionRegexp = /^\s*(\d*|\/.*\/)\s*-\s*(\d*|\/.*\/)\s*$/i

const isRegExp = marker => marker.startsWith(`/`)

const extractSectionFactory = lines => sectionDefinition => {
    const matches = sectionDefinition.match(sectionRegEx)

    // empty section definition or text that does not match a section definition is just returned the same way
    if(!matches) return sectionDefinition

    const [_, begin, end] = matches;
    console.warn(begin, end);

    let beginLineNumber = null;
    let endLineNumber = null;

    if(isRegExp(begin)) {

    } else {
        beginLineNumber = parseInt(begin, 10);
    }

    if(isRegExp(end)) {
        endLineNumber = lines.length - 1;
    } else if (end === ``) {
        // can leave out end marker
        endLineNumber = lines.length - 1;
    } else {
        endLineNumber = parseInt(end, 10);
    }

    return lines.slice(beginLineNumber - 1, endLineNumber).join(`\n`)
}

function xor(a,b) {
    return a ^ b
}

module.exports = extractSectionFactory