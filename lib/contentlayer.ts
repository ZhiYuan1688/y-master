import { pick } from "contentlayer/client"
import { Post, Video } from "contentlayer/generated"

export const allTagNames = ["Next.js", "MDX", "Next Conf", "React Conf"]
export const allTagSlugs = ["next", "mdx", "next-conf", "react-conf"]

export const formatVideoPreview = (video: Video) => {
  const partialVideo = pick(video, ["title", "description", "youtube", "tags"])

  return {
    ...partialVideo,
    title: partialVideo.title || partialVideo.youtube.title,
    type: video.type,
    publishedAt: partialVideo.youtube.publishedAt,
    tags: partialVideo.tags || [],
  }
}

export const formatPostPreview = (post: Post) => {
  const partialPost = pick(post, [
    "tags",
    "slug",
    "title",
    "description",
    "publishedAt",
    "publishedAtFormatted",
  ])

  return {
    ...partialPost,
    type: post.type,
    description: partialPost.description ?? null,
    tags: partialPost.tags || [],
  }
}

export const getVideoDetails = async (id: string) => {
  // console.log(id)
  // 源代码这里请求会超时，不知道什么原因本地js请求youtube都超时 只能写一个flask了
  const res = await fetch(
    `https://blog-api.ymaster.app/youtube_video?id=${id}`,
  ).then((x) => x.json())
  
  if (!res.items?.[0]) {
    throw new Error("Video not found")
  }

  const video = res.items[0]

  const duration = video.contentDetails?.duration
  const views = video.statistics?.viewCount
  const likes = video.statistics?.likeCount
  const thumbnail = video.snippet?.thumbnails?.maxres?.url
  const title = video.snippet?.title
  const publishedAt = video.snippet?.publishedAt

  return {
    views: views ? Number(views) : 0,
    likes: likes ? Number(likes) : 0,
    thumbnail,
    title,
    publishedAt,
    duration: duration
      ? duration
          // PT1M2S => 01:02
          .replace(/PT/, "")
          .replace(/H/, ":")
          .replace(/M/, ":")
          .replace(/S/, "")
          .split(":")
          .map((digit: string) => {
            if (Number(digit) <= 9) {
              return "0" + digit
            } else {
              return digit
            }
          })
          .join(":")
      : 0,
  }
}

// don't send fields we don't use to the client
// the biggest culprit is post.body.raw (the raw MDX source)
export const formatPost = (
  {
    title,
    slug,
    publishedAtFormatted,
    description,
    body,
    series,
    headings,
  }: Post,
  allPosts: Post[],
) => ({
  title,
  slug,
  publishedAtFormatted,
  description: description ?? null,
  body: {
    code: body.code,
  },
  headings:
    (headings as { heading: number; text: string; slug: string }[]) ?? null,
  series: series
    ? {
        title: series.title,
        posts: allPosts
          .filter((p) => p.series?.title === series.title)
          .sort(
            (a, b) =>
              Number(new Date(a.series!.order)) -
              Number(new Date(b.series!.order)),
          )
          .map((p) => {
            return {
              title: p.title,
              slug: p.slug,
              status: p.status,
              isCurrent: p.slug === slug,
            }
          }),
      }
    : null,
})

export type FormattedPost = ReturnType<typeof formatPost>
