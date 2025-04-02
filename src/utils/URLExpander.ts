export class URLExpander {
  private baseUrl: string;
  private limit: number;
  private offsetParam: string;

  constructor(url: string) {
    const urlObj = new URL(url);
    this.baseUrl = urlObj.origin + urlObj.pathname;
    this.limit = parseInt(urlObj.searchParams.get('limit') || '100', 10);
    this.offsetParam = 'offset';
    urlObj.searchParams.delete(this.offsetParam);
    this.baseUrl += '?' + urlObj.searchParams.toString();
  }

  expand(count: number): string[] {
    const urls: string[] = [];
    for (let offset = this.limit; offset < count; offset += this.limit) {
      urls.push(`${this.baseUrl}&${this.offsetParam}=${offset}`);
    }
    return urls;
  }
}
