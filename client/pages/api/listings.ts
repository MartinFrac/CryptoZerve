// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export type Data = {
  address: string;
  owner: string;
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
      address: "0x545e55831d4cf1dDDf9f67a197D4901DE5aD0925",
      owner: "44324",
      name: "TT train",
      description: "with coach",
      price: 25000,
      venue: "LTT club",
    },
    {
      address: "0x545e55831d4cf1dDDf9f67a197D4901DE5aD0925",
      owner: "44324",
      name: "TT regular",
      description: "3 hour slot",
      price: 700,
      venue: "LTT club",
    },
    {
      address: "0x545e55831d4cf1dDDf9f67a197D4901DE5aD0925",
      owner: "44324",
      name: "test",
      description: "desc",
      price: 500,
      venue: "random club",
    }
  ]);
}
