const express = require("express");
const app = express();
const path = require("path");
const ytdl = require("ytdl-core");
const cp = require("child_process");
const ffmpegPath = require("ffmpeg-static");
const fs = require("fs");

app.use(express.static(path.join("contents")))
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "contents/index.html"));
})
app.post("/api/get-video", express.json(), async (req, res) => {
    const url = req.body.link
    try {
        const videoId = await ytdl.getURLVideoID(url)        
        const info = await ytdl.getBasicInfo(videoId)        
        res.json({ ok: true, info })
    } catch (error) {
        res.json({ok:false})}
})
app.post("/api/download-now", express.json(), async (req,res) => {
    const url = req.body.url;
    try {
        const videoId = await ytdl.getURLVideoID(url)
            ytdl.getInfo(videoId).then(info => {
                let name = info.videoDetails.title;                
                name = name.replaceAll("?","").replaceAll("|","").replaceAll("\\","").replaceAll(":","").replaceAll("/","").replaceAll("*","").replaceAll('"','').replaceAll("<","").replaceAll(">","");                
                let audioStream = ytdl.downloadFromInfo(info, {
                    quality: 'highestaudio'
                });
                let videoStream = ytdl.downloadFromInfo(info, {
                    quality: 'highestvideo'
                });
                let ffmpegProcess = cp.spawn(ffmpegPath, [
                    // supress non-crucial messages
                    '-loglevel', '8', '-hide_banner',
                    // input audio and video by pipe
                    '-i', 'pipe:3', '-i', 'pipe:4',
                    // map audio and video correspondingly
                    '-map', '0:a', '-map', '1:v',
                    // no need to change the codec
                    '-c', 'copy',
                    // output mp4 and pipe
                    '-f', 'matroska', 'pipe:5'
                ], {
                    // no popup window for Windows users
                    windowsHide: true,
                    stdio: [
                        // silence stdin/out, forward stderr,
                        'inherit', 'inherit', 'inherit',
                        // and pipe audio, video, output
                        'pipe', 'pipe', 'pipe'
                    ]
                });
                audioStream.pipe(ffmpegProcess.stdio[3]);
                videoStream.pipe(ffmpegProcess.stdio[4]);

                ffmpegProcess.stdio[5].pipe(fs.createWriteStream(path.join(__dirname,"/videos", `/${name}.mp4`)))                                
            })
            res.json({ok:true,message:"Download with success!!!"}) 
    } catch (error) {res.json({ok:false,message:"Não foi possível baixar o video!"})}
})


app.listen(3000, () => { console.log("rodando") });