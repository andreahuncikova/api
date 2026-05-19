import {
  type Request,
  type Response
} from "express";

import * as cron from "node-cron";
import { ScheduledTask } from "node-cron";
import https from "https";

const MINUTES_DELTA = 1;
const URL = "https://api-e7dw.onrender.com/api-docs/";

let counter = 0;
let task: ScheduledTask | null = null;
let stopTimeout: ReturnType<typeof setTimeout> | null = null;

function pingServer() {
  https.get(URL, () => {
    counter -= MINUTES_DELTA;
    console.log('Pinged the server. Minutes left:', counter);
  });
}

function stopPingingServer() {
  if (task) {
    task.stop();
    task = null;
    console.log('Stopped the cron job due to inactivity');
  }
}

function cleanUpTasks() {
  // clear pending stop timeout so it doesn't fire and kill the next cron
  if (stopTimeout) {
    clearTimeout(stopTimeout);
    stopTimeout = null;
  }
  // stop and remove all scheduled tasks
  for (const t of cron.getTasks().values()) {
    t.stop();
  }
  cron.getTasks().clear();
  task = null;
}

export async function startCron(req: Request, res: Response) {
  try {
    cleanUpTasks();

    const totalDuration = parseInt(req.params.duration as string) || 60;
    counter = totalDuration;

    const cronPattern = "*/" + MINUTES_DELTA + " * * * *";
    task = cron.schedule(cronPattern, pingServer);
    task.start();

    stopTimeout = setTimeout(stopPingingServer, totalDuration * 60 * 1000);

    res.status(200).send("Started background task (duration:" + totalDuration + " mins)");

  } catch (error) {
    console.log("Error:" + error);
    res.status(500).send(error);
  }
}
