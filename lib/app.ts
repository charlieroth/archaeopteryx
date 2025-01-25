import { Config } from "./config.ts";
import { NRelay1, NSecSigner } from "@nostrify/nostrify";
import * as nip19 from "@nostr/tools/nip19";

export class App {
  private config: Config;
  private signer: NSecSigner;

  constructor(config: Config) {
    this.config = config;
    const { type, data } = nip19.decode(this.config.privateKey);
    if (type === "nsec" && data instanceof Uint8Array) {
      this.signer = new NSecSigner(data);
    } else {
      throw new Error("Invalid private key");
    }
  }

  async post(content: string) {
    if (!this.signer || !this.config) {
      throw new Error("App is not initialized");
    }

    if (content.length === 0) {
      throw new Error("Content is required");
    }

    const event = await this.signer.signEvent({ 
      kind: 1,
      content: content,
      tags: [],
      created_at: Math.floor(Date.now() / 1000)
    });
    const relay = new NRelay1(this.config.relays[0]);
    const signal = AbortSignal.timeout(5000);
    await relay.event(event, { signal });
    await relay.close();
  }
}