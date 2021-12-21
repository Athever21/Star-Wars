import https from "https";

export default (url: string) =>
  new Promise((resolve, reject) => {
    const req = https.get(url);

    let data = "";
    req.on("response", (resStream) => {
      if (resStream.statusCode != 200) {
        return reject({
          code: resStream.statusCode,
          message: resStream.statusMessage,
        });
      }

      resStream.on("data", (chunk) => (data += chunk.toString()));
      resStream.on("end", () => resolve(JSON.parse(data)));
      resStream.on("error", (err) => reject(err));
    });
    req.on("abort", (err: any) => reject(err));
    req.on("error", (err) => reject(err));
  });
