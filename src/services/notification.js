import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./liveFirebase";

export async function initNotifications() {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Permission denied");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: "BLckdlEmPiST05kuVStcbFIz11svyEmbnM47ft-7p_icVat7Gixrs2L_YynYYc3tJrdjvJPsbNr04NDSL7OVtSA"
    });

    console.log("FCM Token:", token);

    onMessage(messaging, (payload) => {
      console.log("Foreground Notification:", payload);

      alert(payload.notification.title);
    });

    return token;
  } catch (err) {
    console.error(err);
  }
}