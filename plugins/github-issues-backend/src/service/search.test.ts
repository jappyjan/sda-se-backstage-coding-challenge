import { DefaultGithubIssuesCollator } from './search';
import { Issue } from './github-api.types';
import nock from 'nock';

describe('the DefaultGithubIssuesCollator', () => {
  let collator: DefaultGithubIssuesCollator;
  let nockMockScope: nock.Scope;

  beforeAll(() => {
    nockMockScope = nock('https://api.github.com', {
      allowUnmocked: true,
    });
  });

  beforeEach(() => {
    collator = new DefaultGithubIssuesCollator({
      owner: 'fake-owner',
      name: 'fake-repo',
    });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(() => {
    nock.restore();
  });

  it('should fail if the api is not available', async () => {
    await expect(collator.execute()).rejects.toThrow(
      'Failed to fetch issues from https://api.github.com/repos/fake-owner/fake-repo/issues',
    );
  });

  it('should map issues to the indexable document schema', async () => {
    nockMockScope.get('/repos/fake-owner/fake-repo/issues').reply(200, [
      {
        title: 'fake-title',
        body: 'fake-body',
        html_url: 'fake-url',
      } as Partial<Issue>,
    ]);

    const result = await collator.execute();

    expect(result).toEqual([
      {
        title: 'fake-title',
        text: 'fake-body',
        location: 'fake-url',
        body: 'fake-body',
        html_url: 'fake-url',
      },
    ]);
  });
});
