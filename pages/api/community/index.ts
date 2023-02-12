import type { NextApiRequest, NextApiResponse } from "next";
import { handleError, ErrorResponse } from "../../../lib/prisma-util";
import { PrismaClient, Community } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/community:
 *   get:
 *     description: Returns a list of Community objects
 *     responses:
 *       200:
 *         description: A list of Community objects
 *         content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Community"
 *   post:
 *     description: Create a Community object
 *     parameters:
 *       - in: object
 *         name: Community
 *         required: true
 *         description: Community object to create
 *         application/json:
 *          schema:
 *            $ref: "#/components/schemas/Community"
 *     responses:
 *       200:
 *         description: The created Community object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Community"
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Community[] | ErrorResponse>
) {
  const { method, body } = req;

  switch (method) {
    case "GET":
      await handleGET();
      break;
    case "POST":
      const { Community: community, number: userId } = JSON.parse(JSON.stringify(body))
      await handlePOST(community, userId);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function handleGET() {
    try {
      const communities = await prisma.community.findMany();
      res.status(200).json(communities);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }

  async function handlePOST(community: Community, userId: number) {
    try {
      const response = await prisma.community.create({
        data: { 
          ...community,
          user: {
            connect: {
              userId : userId
            }
          }
         },
      });
      res.status(200).json([response]);
    } catch (error) {
      const errorResponse = handleError(error);
      res.status(400).json(errorResponse);
    }
  }
}