import { GithubIssueSearchResult } from './search-result';
import { render } from '@testing-library/react';
import React from 'react';
import { Issue } from '../service';
import { IndexableDocument } from '@backstage/search-common';

describe('the <GithubIssueSearchResult /> component', () => {
  const mockIssue = {
    title: 'fake-title',
    body: 'fake-body',
    user: {
      avatar_url: 'fake-avatar-url',
    },
  } as IndexableDocument & Partial<Issue>;

  beforeAll(() => {
    Object.freeze(mockIssue);
    Object.seal(mockIssue);
  });

  it('should render', () => {
    const ut = render(<GithubIssueSearchResult result={mockIssue} />);

    expect(ut).toBeTruthy();
  });

  it('should render the full title', () => {
    const ut = render(<GithubIssueSearchResult result={mockIssue} />);

    expect(ut.getByText(mockIssue.title)).toBeTruthy();
  });

  it('should render the full body when it is less than 101 characters', () => {
    const shortBody = 'a'.repeat(100);
    const ut = render(
      <GithubIssueSearchResult
        result={{
          ...mockIssue,
          body: shortBody,
        }}
      />,
    );

    expect(ut.getByText(shortBody)).toBeTruthy();
  });

  it('should render a shortened body when it is longer than 100 characters', () => {
    const longBody = 'a'.repeat(101);

    const ut = render(
      <GithubIssueSearchResult
        result={{
          ...mockIssue,
          body: longBody,
        }}
      />,
    );

    const expectedBody = `${longBody.substring(0, 100)}...`;
    expect(ut.getByText(expectedBody)).toBeTruthy();
  });

  it('should render the avatar image', () => {
    const ut = render(<GithubIssueSearchResult result={mockIssue} />);

    const avatarImage = ut.getByRole('img');
    expect(avatarImage.getAttribute('src')).toEqual(mockIssue.user!.avatar_url);
  });
});
