// das wird benötigt, damit useSession() funktioniert
// da useSession() bei der Aufrufung eine Anfrage an den Server sendet (Get und Post)
// und auth hat schon GET und POST für uns definiert, daher müssen wir das selbst nicht tun!
export { GET, POST } from "@/lib/auth";
