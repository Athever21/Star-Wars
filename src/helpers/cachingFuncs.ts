import getApiData from "@/helpers/getApiData";

export const cacheResource = async (resourceTable: any) => {
  const time = Date.now();

  let data = (await getApiData(resourceTable[0])) as any;

  await resourceTable[1].deleteMany({});

  while (true) {
    for (const resource of data.results) {
      const linkArr = resource.url.split("/");
      resource._id = linkArr[linkArr.length - 2];

      for (const [field, value] of Object.entries(resource)) {
        if (Array.isArray(value)) {
          let arr = [];

          for (const link of value) {
            let linkArr = link.split("/");
            arr.push(linkArr[linkArr.length - 2]);
          }

          resource[field] = arr;
        }
        if (
          typeof value === "string" &&
          field !== "url" &&
          value.startsWith("https://")
        ) {
          let linkArr = value.split("/");
          resource[field] = linkArr[linkArr.length - 2];
        }
      }

      await resourceTable[2](resource);
    }

    if (!data.next) break;

    data = (await getApiData(data.next)) as any;
  }

  console.log(`Time taken to cache ${resourceTable[3]}: ${(Date.now() - time)/1000}s`);
};
