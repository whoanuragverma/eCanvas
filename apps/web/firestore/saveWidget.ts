import { Firestore, doc, setDoc } from "firebase/firestore";
import { User } from "../component/AuthContext";
import { FirestoreWidget } from "./types";

export default async function saveWidget(
  db: Firestore,
  user: User | null,
  widget: FirestoreWidget
) {
  const widgetRef = doc(db, user?.uid!, widget.name);

  const status = await setDoc(widgetRef, widget);

  return status;
}
