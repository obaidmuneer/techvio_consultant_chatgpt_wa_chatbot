import express from 'express'
import webhookRoute from './routes/webhook.mjs'
import whatsappRoute from './routes/whatsapp.mjs'
import path from 'path'

const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json())
const __dirname = path.resolve();

app.use('/webhook', webhookRoute)
app.use('/whatsapp', whatsappRoute)

app.get('/', express.static(path.join(__dirname, "/public/index.html")));
app.use('*', express.static(path.join(__dirname, "/public")));

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}!`))