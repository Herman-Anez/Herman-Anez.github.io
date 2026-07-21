import { getBlogListCoordinator } from "@/modules/blog/3-infrastructure/presentation/vm-c/blog.coordinator";
import { Grid } from "@once-ui-system/core";
import Post from "./Post";

interface PostsProps {
  range?: [number] | [number, number];
  columns?: "1" | "2" | "3";
  thumbnail?: boolean;
  direction?: "row" | "column";
  exclude?: string[];
  locale?: string;
}

export async function Posts({
  range,
  columns = "1",
  thumbnail = false,
  exclude = [],
  direction,
  locale = "es",
}: PostsProps) {
  const flow = await getBlogListCoordinator({
    locale,
    range,
    exclude,
  });
  const displayedBlogs = flow.posts;

  return (
    <>
      {displayedBlogs.length > 0 && (
        <Grid columns={columns} s={{ columns: 1 }} fillWidth marginBottom="40" gap="16">
          {displayedBlogs.map((post) => (
            <Post key={post.slug} post={post} thumbnail={thumbnail} direction={direction} />
          ))}
        </Grid>
      )}
    </>
  );
}
