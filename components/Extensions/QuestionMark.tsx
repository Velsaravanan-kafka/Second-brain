import { Mark, mergeAttributes } from "@tiptap/core";

export const QuestionMark = Mark.create({
  name: "questionMark",

  // 1. THE MISSING LINK (This fixes persistence)
  // It tells Tiptap: "When you load the database, look for this specific tag."
  parseHTML() {
    return [
      {
        tag: "span.question-highlight",
      },
    ];
  },

  // 2. CONFIGURATION
  addAttributes() {
    return {
      id: {
        default: null,
        // READER: Look for 'data-id'
        parseHTML: (element) => element.getAttribute("data-id"),
        // WRITER: Write 'data-id'
        renderHTML: (attributes) => ({
          "data-id": attributes.id,
        }),
      },
      isSolved: {
        default: false,
        // READER: Look for 'data-is-solved'
        parseHTML: (element) =>
          element.getAttribute("data-is-solved") === "true",
        // WRITER: Write 'data-is-solved'
        renderHTML: (attributes) => ({
          "data-is-solved": attributes.isSolved,
        }),
      },
    };
  },

  keepOnSplit: false,
  exitable: true,

  // 3. RENDERER
  renderHTML({ HTMLAttributes }) {
    const colorClass = HTMLAttributes.isSolved
      ? "border-green-500 hover:bg-green-50"
      : "border-red-400 hover:bg-red-50";

    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        class: `question-highlight border-b-2 border-dashed cursor-help transition-colors ${colorClass}`,
      }),
      0,
    ];
  },
});
