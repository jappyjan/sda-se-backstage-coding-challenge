import { DocumentCollator, IndexableDocument } from '@backstage/search-common';
import fetch from 'node-fetch';
import { Issue } from './github-api.types';

interface RepositoryIdentifier {
  owner: string;
  name: string;
}

export class DefaultGithubIssuesCollator implements DocumentCollator {
  public readonly type: string;
  private readonly repository: RepositoryIdentifier;

  public constructor(repositoryIdentifier: RepositoryIdentifier) {
    this.repository = repositoryIdentifier;
    this.type = `github-issues-${repositoryIdentifier.owner}-${repositoryIdentifier.name}`;
  }

  async execute(): Promise<IndexableDocument[]> {
    const url = `https://api.github.com/repos/${this.repository.owner}/${this.repository.name}/issues`;
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch issues from ${url}`);
    }

    const issues = (await response.json()) as Issue[];
    return issues.map(
      issue =>
        ({
          ...issue,
          title: issue.title,
          text: issue.body,
          location: issue.html_url,
        } as IndexableDocument),
    );
  }
}
