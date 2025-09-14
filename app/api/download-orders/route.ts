import fs from 'fs'
import path from 'path'

export async function GET (req: Request) {
  const filePath = path.join(process.cwd(), 'orders.json')
  if (!fs.existsSync(filePath)) {
    return new Response(JSON.stringify([]), { status: 200 })
  }
  const data = fs.readFileSync(filePath, 'utf-8')
  return new Response(data, { status: 200 })
}
