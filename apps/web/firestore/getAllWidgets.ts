import { FirestoreWidget } from "./types";
import { User } from "../component/AuthContext";

export default async function getAllWidgets(
  db: any,
  user: User | null
) {
  const widgetsRef = db.collection(user?.uid!);
  const snapshot = await widgetsRef.get();

  const widgets: FirestoreWidget[] = [];

  snapshot.forEach((doc: any) => {
    widgets.push(doc.data() as FirestoreWidget);
  });

  return widgets;
}
