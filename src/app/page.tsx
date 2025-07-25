"use client";

import { useState } from "react";

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  duration: string;
  webpage_url: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Video[]>([]);
  const [downloading, setDownloading] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query) return;

    const res = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.results) {
      setResults(
        data.results.map((r: any) => ({
          id: r.id,
          title: r.title,
          thumbnail: r.thumbnail,
          channel: r.uploader,
          duration: r.duration_string || r.duration,
          webpage_url: r.webpage_url,
        }))
      );
    }
  }

  async function handleDownload(url: string) {
    setDownloading(url);
    const res = await fetch("/api/download", {
      method: "POST",
      body: JSON.stringify({ url }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Download started ✅");
    } else {
      const data = await res.json();
      alert("Failed: " + data.error);
    }
    setDownloading(null);
  }

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">🎵 YouTube Audio Downloader</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a song or paste YouTube link..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Search
        </button>
      </form>

      <div className="space-y-4">
        {results.map((video) => (
          <div
            key={video.id}
            className="flex items-center gap-4 p-4 border rounded-lg"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-24 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h2 className="font-semibold">{video.title}</h2>
              <p className="text-sm text-gray-600">
                {video.channel} • {video.duration}
              </p>
            </div>
            <button
              onClick={() => handleDownload(video.webpage_url)}
              disabled={downloading === video.webpage_url}
              className="px-3 py-1 bg-green-600 text-white rounded-lg"
            >
              {downloading === video.webpage_url
                ? "Downloading..."
                : "Download"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
