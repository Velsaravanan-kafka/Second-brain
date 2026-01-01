import { Mark, mergeAttributes } from "@tiptap/core";

export const VocabularyMark = Mark.create({
  name: "vocabularyMark",

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
        tag: "span[data-vocab-id]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-vocab-id": HTMLAttributes.id,
        // Visual Style: Blue background, rounded edges
        class:
          "bg-blue-200 text-stone-900 px-0.5 rounded-sm decoration-clone box-decoration-clone border-b-2 border-blue-400",
      }),
      0,
    ];
  },
});
