const { execSync } = require("child_process");

function execPandocOnFile(fileName) {
  const stdout = execSync(
    `pandoc -s -t markdown test/examples/${fileName} --filter bin/filter.js`
  );
  return String(stdout);
}

test("line ranges", () => {
  const output = execPandocOnFile(`lines.md`);
  console.log(output);
  expect(output).toMatchSnapshot();
});
