export const defaultWidget = `{
    "author": "Anonymous",
    "debug": true,
    "description": "A widget.",
    "name": "widget",
    "version": "1.0.0",
    "hooks": [],
    "component": {
        "element": "div",
        "className": "w-[128px] h-[128px] border grid place-items-center bg-white text-black",
        "children": [
            {
                "element": "span",
                "text": "Widget!",
                "eval": false
            }
        ]
    }
}`;
