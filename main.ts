import { App } from "./lib/app.ts";
import { load } from "./lib/config.ts";

async function main() {
  try {
    const [content] = Deno.args;
    const config = await load();
    const app = new App(config);
    await app.post(content);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.log("Request aborted");
      } else {
        console.error(error);
      }
    } else {
      console.error(error);
    }
  }
}

main();
