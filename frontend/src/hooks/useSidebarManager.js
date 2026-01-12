import { useState } from "react";

export function useSidebarManager(initialSidebar = {}) {
  const [sidebar, setSidebar] = useState(initialSidebar);

  // Add a new section
  const addSection = (sectionName) => {
    if (!sidebar[sectionName]) {
      setSidebar((prev) => ({
        ...prev,
        [sectionName]: []
      }));
    }
  };

  // Remove a section
  const removeSection = (sectionName) => {
    const updatedSidebar = { ...sidebar };
    delete updatedSidebar[sectionName];
    setSidebar(updatedSidebar);
  };

  // Add or update an item in a section
  const upsertItem = (sectionName, item) => {
    setSidebar((prev) => {
      const sectionItems = prev[sectionName] || [];

      const index = sectionItems.findIndex((i) => i.label === item.label);
      if (index !== -1) {
        sectionItems[index] = item; // update
      } else {
        sectionItems.push(item); // insert
      }

      return { ...prev, [sectionName]: [...sectionItems] };
    });
  };

  // Remove item by label
  const removeItem = (sectionName, label) => {
    setSidebar((prev) => {
      const updatedItems =
        prev[sectionName]?.filter((i) => i.label !== label) || [];
      return { ...prev, [sectionName]: updatedItems };
    });
  };

  return {
    sidebar,
    addSection,
    removeSection,
    upsertItem,
    removeItem,
    setSidebar
  };
}
