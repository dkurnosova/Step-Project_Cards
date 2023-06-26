import express from 'express'
import path from 'path'

const PORT = process.env.PORT || 3002
const app = express()

app.use(express.static(path.resolve('./build')))
app.get("/*", (req, res) => {
    res.sendFile(path.resolve('./build/index.html'))
})

app.listen(PORT, () => {
    console.log(`Server is listening on Port ${PORT}`);
})