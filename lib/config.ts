export type Config = {
  relays: string[];
  privateKey: string;
}

export const load = async (): Promise<Config> => {
  try {
    const configString = await Deno.readTextFile("./config.json");
    const configJson = JSON.parse(configString);

    return {
      relays: configJson.relays,
      privateKey: configJson.privateKey,
    };
  } catch {
    throw new Error("Failed to load config");
  }
}