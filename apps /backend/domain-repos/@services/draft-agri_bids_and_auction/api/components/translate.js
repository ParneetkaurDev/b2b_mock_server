const yaml = require("js-yaml");
const fs = require("fs");

const getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter(
      (dirent) =>
        dirent.isDirectory() ||
        (dirent.isFile() && dirent.name.includes(".json"))
    )
    .map((dirent) => dirent.name);

const traverse = (source) => {
  const path = getDirectories(source);
  if (path.length === 0) return `${source}/${path}`;
  else {
    const allPaths = [];
    path.forEach((item) => {
      if (item.includes(".json")) {
        allPaths.push(`${source}/${item}`);
        return;
      }
      const finalPath = traverse(`${source}/${item}`);
      allPaths.push(finalPath);
    });
    return allPaths;
  }
};

let folderName = "Agri_Equipment_Hiring";
const traversedPaths = traverse("./Examples/Agri_Equipment_Hiring");

traversedPaths.forEach((path, i) => {
  path.forEach((jsonPath, j) => {
    const file = fs.readFileSync(jsonPath).toString();
    let doc = yaml.load(file);
    let existingYamlFile;
    let replacePath = jsonPath
      .replace(folderName, folderName + "_yaml")
      .replace(".json", ".yaml");

    try {
      console.log("replacePath ------------ ", replacePath);
      existingYamlFile = fs.readFileSync(replacePath).toString();
      existingYamlFile = yaml.load(existingYamlFile);
    } catch (err) {
      console.log("Yaml doesn't exist");
    }

    const details = { summary: "", description: "", value: "" };

    if (existingYamlFile) {
      details.summary = existingYamlFile.summary;
      details.description = existingYamlFile.description;
    }

    doc = { ...details, value: doc };

    const yamlDoc = yaml.dump(doc);

    fs.writeFileSync(replacePath, yamlDoc);
  });
});
