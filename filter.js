import { readFile, writeFile } from "node:fs/promises";

try {
  // read file
  const json = await readFile("./data/images.json", "utf-8");
  const images = JSON.parse(json);

  // filter the data
  const filterByTEM = images
    .filter((a) => a.microscopyType === "TEM" && !a.file.includes("undefined"))
    .map((item) => {
      const fileURL = `https://qa.materialsmine.org${item.file}`;
      return { ...item, file: fileURL };
    });

  // write file
  console.log("Writing file 'images-tem.json'");
  await writeFile("./data/images-tem.json", JSON.stringify(filterByTEM));
  console.log("Done filtering");
} catch (error) {
  console.log(error);
}
