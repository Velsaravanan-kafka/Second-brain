import { Mark, mergeAttributes } from "@tiptap/core";

export const ImportantMark = Mark.create({
  name: "importantMark",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      id: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-important-id]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-important-id": HTMLAttributes.id,
        // Visual Style: Amber background, rounded edges
        class:
          "bg-amber-200 text-stone-900 px-0.5 rounded-sm decoration-clone box-decoration-clone border-b-2 border-amber-400",
      }),
      0,
    ];
  },
});
