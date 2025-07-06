// import dayjs from 'dayjs'
// import { createRequire } from 'module';
// import Subscription from '../models/subscription.model.js';
// import { sendReminderEmail } from '../utils/send-emial.js';

// const require = createRequire(import.meta.url)
// const { serve } = require("@upstash/workflow/express");

// const REMINDERS = [7, 5, 2, 1];

// export const sendReminders = serve(async(context) => {
//     const { subscriptionId } = context.requestPayload;
//     const subscription = await fetchSubscription(context, subscriptionId);

//     if(!subscription || subscription.status !== 'active') return;

//     const renewalDate = dayjs(subscription.renewalDate);

//     if(renewalDate.isBefore(dayjs())){
//         console.log(`Renewal data has passed for subscription ${subscriptionId}. Stopping workflow.`);
//         return;
//     }

//     for (const daysBefore of REMINDERS){
//         const reminderDate = renewalDate.subtract(daysBefore, 'day');
        
//         if(reminderDate.isAfter(dayjs())){
//             await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate)
//         }
//         await triggerReminder(context, `${daysBefore} days before Reminder`, subscription)
//     }

// });


// const  fetchSubscription = async(context, subscriptionId) => {
//     return await context.run('get subscrition', async() =>{
//         return Subscription.findById(subscriptionId).populate('user', 'name, email')
//     })
// }


// // Create are sleep Remainder
// const sleepUntilReminder = async(context, label, date) => {
//     console.log(`Sleeping until ${label} reminder at ${date}`);
//     await context.sleepUntil(label, date.toDate());
// }


// const triggerReminder = async(context, label, subscription) => {
//     return await context.run(label, async() => {
//         console.log(`Triggering ${label} remainder`)
//         //  Send email, sms, push notification...
//         await sendReminderEmail({
//             to: subscription.user.email,
//             type: label,
//             subscription,
//         })
//     })
// }


import dayjs from 'dayjs'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-emial.js';

const REMINDERS = [7, 5, 2, 1]

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if(!subscription || subscription.status !== 'active') return;

  const renewalDate = dayjs(subscription.renewalDate);

  if(renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');

    if(reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
    }

    if (dayjs().isSame(reminderDate, 'day')) {
      await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
    }
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  })
}

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);

    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    })
  })
}
