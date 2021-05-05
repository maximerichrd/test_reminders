import { getUnixTime, subMinutes } from "date-fns"
import knexBuilder from "knex"
import {Knex} from "knex"

const knex: Knex = knexBuilder({
  client: "mysql",
  version: '5.7',
  connection: {
    host : '127.0.0.1',
    user : 'user',
    password : 'password',
    database : 'testdb',
    port: 6606
  }
})

export const REMINDER_TABLE = "reminders"

export type ReminderRow = {
  DOC_NUMBER: string
  STORE_ID: string
  CREATED_AT: Date
}

export type ReminderRowLight = Omit<ReminderRow, "DOC_NUMBER">

export const COLUMNS = {
  DOCUMENT_NUMBER: "DOC_NUMBER",
  STORE_ID: "STORE_ID",
  CREATED_AT: "CREATED_AT",
}


export async function sendReminders(
    checkWindowInMinutes: number,
    expiryTimeInMinutes: number,
    reminderPeriodicityInMinutes: number,
    knex: Knex
  ): Promise<void> {
    await knex.transaction(async trx => {
      const now = Date.now()
      const expiryDate = subMinutes(new Date(now), expiryTimeInMinutes)
  
      const subQuery = knex(REMINDER_TABLE)
        .select(COLUMNS.STORE_ID, knex.raw(`max(${COLUMNS.CREATED_AT}) as ${COLUMNS.CREATED_AT}`))
        .groupBy(COLUMNS.STORE_ID)
  
      const reminderRows: ReminderRowLight[] = await trx<ReminderRow>(REMINDER_TABLE)
        .select(COLUMNS.STORE_ID, COLUMNS.CREATED_AT)
        .where(COLUMNS.CREATED_AT, ">=", expiryDate)
        .whereIn([COLUMNS.STORE_ID, COLUMNS.CREATED_AT], subQuery)
        .distinct()
  
      const reminders = reminderRows.filter(row =>
        shouldWake(row, checkWindowInMinutes, reminderPeriodicityInMinutes, now)
      )
      console.log(reminderRows)
      console.log(`============== ${new Date(Date.now())} AFTER SHOULD_WAKE=================`)
      console.log(reminders)
      console.log(`============== DONE =================`)

      //const notifications = reminders.map(r => buildDDIReminderNotification(r.STORE_ID))
      //await notifyTopics(notifications)
    })
  }

  setInterval(() => sendReminders(1, 180, 30, knex), 30*1000);


  function shouldWake(
    reminder: ReminderRowLight,
    checkWindowInMinutes: number,
    reminderPeriodicityInMinutes: number,
    now: number
  ) {
    const nowInSeconds = getUnixTime(now)
    const createdAtInSeconds = getUnixTime(reminder.CREATED_AT)
    const elapsedSecondsSinceCreation = nowInSeconds - createdAtInSeconds
  
    const frequencyInSeconds = reminderPeriodicityInMinutes * 60
    const windowInSeconds = checkWindowInMinutes * 60
    const firstHalfHourInSeconds = 30 * 60
  
    // not before the first halfhour
    if (elapsedSecondsSinceCreation < firstHalfHourInSeconds) {
      return false
    }
    // every half-hour, starting from creation.
    else {
      return elapsedSecondsSinceCreation % frequencyInSeconds < windowInSeconds
    }
  }