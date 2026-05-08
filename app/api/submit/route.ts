export async function POST(req: Request) {
    const data = await req.json();
  
    console.log("Received:", data);
  
    return Response.json({ success: true });
  }