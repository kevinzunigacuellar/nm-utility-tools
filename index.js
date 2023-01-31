import fs from "node:fs/promises";
import path from "node:path";

const PAGESIZE = 10;
const output = [];

// to limit the number of requests
const LIMIT = 500;
let counter = 0;

async function getImages({ pageNumber } = { pageNumber: 1 }) {
  const data = await fetch("https://qa.materialsmine.org/api/graphql", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      query: `query Images($input: imageQueryInput) {
        images(input: $input) {
          totalItems
          pageSize
          pageNumber
          totalPages
          hasPreviousPage
          hasNextPage
          images {
            file
            description
            microscopyType
            type
            metaData {
              title
              id
              doi
              keywords
            }
          }
        }
      }`,
      variables: {
        input: {
          pageSize: PAGESIZE,
          pageNumber,
        },
      },
    }),
  }).then((res) => res.json());

  const { images, hasNextPage, totalPages } = data.data.images;

  console.log(`fetched page ${pageNumber} of ${totalPages}`);
  output.push(...images);

  // limit requests code
  if (hasNextPage && counter < LIMIT) {
    counter++;
    await getImages({ pageNumber: pageNumber + 1 });
  }
}

try {
  await getImages();
} catch (error) {
  console.log(error);
}

await fs.writeFile("./data/images.json", JSON.stringify(output));
