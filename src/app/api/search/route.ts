import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: Request) {
    const { query } = await req.json();

    if (!query) {
        return NextResponse.json({ error: "Missing search query" }, { status: 400 });
    }

    const cmd = `yt-dlp "ytsearch5:${query}" --print-json --skip-download`;

    try {
        const { stdout } = await execAsync(cmd, { maxBuffer: 10 * 1024 * 1024 });
        const lines = stdout.trim().split("\n");
        const results = lines.map(line => JSON.parse(line));

        return NextResponse.json({ results });
    } catch (err: any) {
        return NextResponse.json({ error: err.stderr || err.message }, { status: 500 });
    }
}
