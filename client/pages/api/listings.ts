// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export type Data = {
  name: string;
  description: string;
  price: Number;
  venue: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  res.status(200).json([
    {
      name: "TT train",
      description: "with coach",
      price: 25000,
      venue: "LTT club",
    },
    {
      name: "TT regular",
      description: "3 hour slot",
      price: 700,
      venue: "LTT club",
    },
    {
      name: "test",
      description: "desc",
      price: 500,
      venue: "random club",
    }
  ]);
}
