// src/utils/documentationLearner.ts

import axios from 'axios';
import * as cheerio from 'cheerio';

export class DocumentationLearner {
  private knowledge: string = '';

  async learnFromUrl(url: string): Promise<void> {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data as string);
      const text = $('body').text();
      this.knowledge += text + '\n\n';
    } catch (error) {
      console.error(`Error learning from ${url}:`, error);
    }
  }

  async learnFromMultipleUrls(urls: string[]): Promise<void> {
    for (const url of urls) {
      await this.learnFromUrl(url);
    }
  }

  getKnowledge(): string {
    return this.knowledge;
  }
}