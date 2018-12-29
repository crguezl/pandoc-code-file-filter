const { execSync } = require("child_process");

function execPandocOnFile(fileName) {
  const stdout = execSync(
    `pandoc -s -t markdown test/examples/${fileName} --filter bin/filter.js`
  );
  return String(stdout);
}

test("line ranges", () => {
  const output = execPandocOnFile(`lines.md`);
  expect(output).toMatchSnapshot();
});

test("regex sections", () => {
  const output = execPandocOnFile(`regex.md`);
  expect(output).toMatchSnapshot();
});

test("section offsets", () => {
  const output = execPandocOnFile(`offset.md`);
  expect(output).toMatchSnapshot();
});

test("no dedent", () => {
  const output = execPandocOnFile(`no-dedent.md`);
  expect(output).toMatchSnapshot();
});
