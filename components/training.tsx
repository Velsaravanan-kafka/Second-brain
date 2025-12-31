import SidebarItem from "./sidebarItem";

<div>
  {treeData.map((node) => {
    <SidebarItem
      key={node.id}
      node={node}
      activeNodeId={activeNode.id}
      onAddChild={handleaddnote}
      onSelect={setActiveNode}
    />;
  })}
</div>;
