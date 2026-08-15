function buildCategoryTree(categories) {
  const map = new Map();
  const roots = [];

  for (const category of categories) {
    map.set(category.id, {
      ...category,
      children: []
    });
  }

  for (const category of map.values()) {
    if (category.parent_id === null) {
      roots.push(category);
    } else {
      const parent = map.get(category.parent_id);

      if (parent) {
        parent.children.push(category);
      }
    }
  }

  return roots;
}

module.exports = buildCategoryTree;
