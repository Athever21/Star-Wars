const getApiData = require("../../src/helpers/getApiData").default;

describe("Test getApiData helper function", () => {
  it("it should return data from api", async() => {
    const data = await getApiData("https://swapi.py4e.com/api/films/?format=json");

    expect(data.count).toEqual(7);
  });

  it("it should handle error", async() => {
    try {
      await getApiData("https://swapi.py4e.com/api/film/?format=json");
    } catch (e) {
      expect(e.code).toEqual(404);
    }
  });
});