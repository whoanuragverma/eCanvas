"use client";
import { useState } from "react";
import WidgetEditor from "../../component/WidgetEditor";
import { defaultWidget } from "../../constant/defaultWidget";
import WidgetRenderer from "../../component/WidgetRenderer";

export default function Home() {
  const [text, setText] = useState<string | undefined>(defaultWidget);

  return (
    <div className="flex">
      <WidgetEditor text={text} setText={setText} />
      <WidgetRenderer text={text} />
    </div>
  );
}
