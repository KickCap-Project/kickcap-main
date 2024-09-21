self.addEventListener("install", function (e) {
  console.log("fcm sw install..");
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  console.log("fcm sw activate..");
});

self.addEventListener("push", function (e) {
  console.log("push: ", e.data.json());
  if (!e.data.json()) return;

  const notification = e.data.json().notification;
  let data = e.data.json().data;
  const notificationTitle = notification.title;
  const notificationOptions = {
    body: notification.body,
    icon: "/logo192.png",
    data: data.url,
  };

  e.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

self.addEventListener("notificationclick", function (event) {
  console.log("notification click");
  event.notification.close();
  let url = event.notification.data;
  clients.openWindow(url);
});
