// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type ErrorData = {
  message: string
}

type SuccessData = {
    revalidated: boolean,
    message: string
  }

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ErrorData | SuccessData>
) {
    // Check for secret to confirm this is a valid request
    if (req.query.secret !== process.env.REVALIDATE_TOKEN) {
      return res.status(401).json({ message: 'Invalid token' })
    }
  
    const { revalidatePath } = req.body;

    try {
      // this should be the actual path not a rewritten path
      // e.g. for "/blog/[slug]" this should be "/blog/post-1"
      
      await res.revalidate(revalidatePath)
      return res.json({ message: revalidatePath, revalidated: true })
    } catch (err) {
      // If there was an error, Next.js will continue
      // to show the last successfully generated page
      return res.status(500).send({ message: 'Error revalidating :' + revalidatePath })
    }
  }