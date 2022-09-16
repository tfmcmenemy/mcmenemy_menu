import { CalendarPageFrontEnd } from "../calendar/calendarPageFontEnd.js";

const calendarPageFontEnd = new CalendarPageFrontEnd();
calendarPageFontEnd.addInteractionsToDayCards();
calendarPageFontEnd.addMobileMenuInteractions();

// //Experiment to try out the notifications API.
// //This is currently not supported by IOS
// document.querySelector("body").addEventListener("click", () => {
//   Notification.requestPermission().then((perm) => {
//     if (perm === "granted") {
//       new Notification("This is a test", {
//         body: "This is the body of the notification",
//       });
//     }
//   });
// });

// //Setting a time out function using Promises
// function waitALittle(time, codeToRun) {
//   return new Promise((resolve, reject) => {
//     if (typeof time != "number") {
//       reject(`${time} is not a number.`);
//       return;
//     }

//     resolve(function () {
//       setTimeout(() => {
//         codeToRun();
//       }, time);
//     });
//   });
// }

// function sayHi(name) {
//   console.log(`Hello ${name}`);
// }

// // waitALittle(2000, () => {
// //   sayHi("Tom");
// // })
// //   .then((data) => {
// //     data();
// //   })
// //   .catch((err) => {
// //     console.log(err);
// //   });

// //Using async await in order to have promises wait until other promises are resolved.
// let firstOne = function (num) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(num * 2);
//     }, 1000);
//   });
// };

// let secondOne = function (num) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(num * 2);
//     }, 1000);
//   });
// };

// async function testRun() {
//   let num = await firstOne(1);
//   let two = await secondOne(num);
//   console.log(two);
// }

// testRun();
