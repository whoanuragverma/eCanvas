"use client";
import { useEffect, useState } from "react";
import WidgetEditor from "../../../component/WidgetEditor";
import WidgetRenderer from "../../../component/WidgetRenderer";
import { useParams } from "next/navigation";
import getWidget from "../../../firestore/getWidget";
import { db } from "../../firebase";
import { useAuth } from "../../../component/AuthContext";
export default function Home() {
  const { slug } = useParams();
  const auth = useAuth();
  const [text, setText] = useState<string | undefined>();

  useEffect(() => {
    if (slug) {
      getWidget(db, auth.user, slug.toString()).then((widget) => {
        setText(
          JSON.stringify({
            ...widget,
            preview: undefined,
          })
        );
      });
    }
  }, [slug]);
  return (
    <div className="flex">
      <WidgetEditor text={text} setText={setText} />
      <WidgetRenderer text={text} />
    </div>
  );
}
