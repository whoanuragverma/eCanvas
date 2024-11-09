import { Firestore, doc, getDoc } from "firebase/firestore";
import { User } from "../component/AuthContext";
import { FirestoreWidget } from "./types";

export default async function getWidget(
  db: Firestore,
  user: User | null,
  name: string
) {
  const widgetRef = doc(db, user?.uid!, name);

  const data = await getDoc(widgetRef);

  return data.data() as FirestoreWidget;
}
