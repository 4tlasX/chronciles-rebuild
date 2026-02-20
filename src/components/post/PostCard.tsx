import { ReactNode } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardMeta,
  CardFooter,
  CardActions,
} from '@/components/card';
import { PostContent } from './PostContent';
import { PostMeta } from './PostMeta';
import { PostDate } from './PostDate';
import type { Post } from '@/lib/db';

export interface PostCardProps {
  post: Post;
  actions?: ReactNode;
  footer?: ReactNode;
  showMeta?: boolean;
}

export function PostCard({
  post,
  actions,
  footer,
  showMeta = true,
}: PostCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Post #{post.id}</CardTitle>
        <CardMeta>
          <PostDate date={post.createdAt} />
        </CardMeta>
      </CardHeader>

      <CardBody>
        <PostContent content={post.content} />
        {showMeta && Object.keys(post.metadata).length > 0 && (
          <PostMeta metadata={post.metadata} />
        )}
      </CardBody>

      {footer && <CardFooter>{footer}</CardFooter>}
      {actions && <CardActions>{actions}</CardActions>}
    </Card>
  );
}
