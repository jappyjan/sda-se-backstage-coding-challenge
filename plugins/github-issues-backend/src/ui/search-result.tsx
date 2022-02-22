import { IndexableDocument } from '@backstage/search-common';
import { Issue } from '../service';
import React, { useMemo } from 'react';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@material-ui/core';

interface Props {
  result: IndexableDocument & Partial<Issue>;
}

export function GithubIssueSearchResult(props: Props) {
  const { result: issueDocument } = props;

  const summary = useMemo(() => {
    const body = issueDocument.body ?? '';
    const shortenedBody = body.substring(0, 100);
    if (shortenedBody.length < body.length) {
      return `${shortenedBody}...`;
    }
    return shortenedBody;
  }, [issueDocument.body]);

  const avatarUrl = useMemo(() => {
    if (!issueDocument.user) {
      return undefined;
    }

    if (!issueDocument.user.avatar_url) {
      return undefined;
    }

    return issueDocument.user.avatar_url;
  }, [issueDocument.user]);

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={avatarUrl} />
      </ListItemAvatar>
      <ListItemText primary={issueDocument.title} secondary={summary} />
    </ListItem>
  );
}
