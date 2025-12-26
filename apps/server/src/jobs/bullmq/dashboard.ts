import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ElysiaAdapter } from "@bull-board/elysia";
import { emailQueue, stripeQueue, embeddingsQueue } from "./queues";

const serverAdapter = new ElysiaAdapter("/admin/queues");

createBullBoard({
  queues: [
    new BullMQAdapter(emailQueue),
    new BullMQAdapter(stripeQueue),
    new BullMQAdapter(embeddingsQueue),
  ],
  serverAdapter,
});

export const bullBoardPlugin = serverAdapter.registerPlugin();
