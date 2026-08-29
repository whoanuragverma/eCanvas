import { deleteDoc, doc } from "firebase/firestore";
import { User } from "../component/AuthContext";

export default async function deleteWidget(
  db: any,
  user: User | null,
  name: string
) {
  const widgetRef = doc(db, user?.uid!, name);

  await deleteDoc(widgetRef);

  window.location.reload();
}
