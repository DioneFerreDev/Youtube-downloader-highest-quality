const express = require("express");
const app = express();
const path = require("path");
const ytdl = require("ytdl-core");

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


app.listen(3000, () => { console.log("rodando") });