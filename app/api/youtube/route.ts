import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const channelUrl = searchParams.get('channelUrl')

  if (!channelUrl) {
    return NextResponse.json({ error: 'Channel URL is required' }, { status: 400 })
  }

  try {
    const handle = extractHandle(channelUrl)

    // Step 1: Get channel ID
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${handle}&key=${API_KEY}`
    )
    const channelData = await channelRes.json()
    const channelId = channelData.items?.[0]?.id?.channelId

    if (!channelId) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
    }

    // Step 2: Get channel details
    const detailsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`
    )
    const detailsData = await detailsRes.json()
    const channel = detailsData.items?.[0]

    // Step 3: Fetch top 50 videos in a single call
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=viewCount&maxResults=50&key=${API_KEY}`
    )
    const videosData = await videosRes.json()

    const videoIds = (videosData.items ?? [])
      .map((v: any) => v.id.videoId)
      .filter(Boolean)
      .join(',')

    const statsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&id=${videoIds}&key=${API_KEY}`
    )
    const statsData = await statsRes.json()

    return NextResponse.json({
      channel: {
        id: channelId,
        name: channel?.snippet?.title,
        description: channel?.snippet?.description,
        thumbnail: channel?.snippet?.thumbnails?.default?.url,
        subscribers: channel?.statistics?.subscriberCount,
        totalViews: channel?.statistics?.viewCount,
        videoCount: channel?.statistics?.videoCount,
      },
      videos: statsData.items?.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails?.medium?.url,
        publishedAt: video.snippet.publishedAt,
        views: parseInt(video.statistics.viewCount || '0'),
        likes: parseInt(video.statistics.likeCount || '0'),
        comments: parseInt(video.statistics.commentCount || '0'),
        duration: video.contentDetails.duration,
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

function extractHandle(url: string): string {
  const patterns = [
    /@([^/?\s]+)/,
    /\/channel\/([^/?\s]+)/,
    /\/c\/([^/?\s]+)/,
    /\/user\/([^/?\s]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return url
}
