import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const navidromeDir = process.env.NAVIDROME_DIR;

export async function POST(req: Request) {
    const { url } = await req.json();

    if (!url || !navidromeDir) {
        return NextResponse.json({ error: "Missing URL or NAVIDROME_DIR not set" }, { status: 400 });
    }

    const cmd = `yt-dlp -x --audio-format mp3 -o "${navidromeDir}/%(title)s.%(ext)s" "${url}"`;

    try {
        const { stdout } = await execAsync(cmd);
        return NextResponse.json({ success: true, message: stdout });
    } catch (err: any) {
        return NextResponse.json({ error: err.stderr || err.message }, { status: 500 });
    }
}
