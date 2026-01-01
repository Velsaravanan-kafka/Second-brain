export type Node = {
  id: string;
  title: string;
  children: Node[];
  content?: string;
  icon?: string | null;
};
