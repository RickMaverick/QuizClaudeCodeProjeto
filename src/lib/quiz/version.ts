import { createHash } from "node:crypto";
import { questions } from "@/data/questions";

/** Hash curto do banco de perguntas ativas, gravado em `question_set_version`. */
export const QUESTION_SET_VERSION = createHash("sha256")
  .update(
    JSON.stringify(
      questions
        .filter((q) => q.active)
        .map(({ id, level, statement, answer }) => [id, level, statement, answer]),
    ),
  )
  .digest("hex")
  .slice(0, 12);
