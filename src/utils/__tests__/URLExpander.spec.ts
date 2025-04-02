import { URLExpander } from '../URLExpander';

describe('URLExpander', () => {
  it('should generate paginated URLs correctly', () => {
    const url = 'https://api.sam.gov/prod/federalorganizations/v1/orgs?api_key=REPLACE_WITH_API_KEY&limit=100&offset=0&status=Active&level=9';
    const count = 400;

    const expander = new URLExpander(url);
    const result = expander.expand(count);

    expect(result).toEqual([
      'https://api.sam.gov/prod/federalorganizations/v1/orgs?api_key=REPLACE_WITH_API_KEY&limit=100&status=Active&level=9&offset=100',
      'https://api.sam.gov/prod/federalorganizations/v1/orgs?api_key=REPLACE_WITH_API_KEY&limit=100&status=Active&level=9&offset=200',
      'https://api.sam.gov/prod/federalorganizations/v1/orgs?api_key=REPLACE_WITH_API_KEY&limit=100&status=Active&level=9&offset=300',
    ]);
  });

  it('should return an empty array if count is less than or equal to limit', () => {
    const url = 'https://api.sam.gov/prod/federalorganizations/v1/orgs?api_key=REPLACE_WITH_API_KEY&limit=100&offset=0&status=Active&level=9';
    const count = 100;

    const expander = new URLExpander(url);
    const result = expander.expand(count);

    expect(result).toEqual([]);
  });
});
