import { useRef, useEffect } from "react";

export function getSectionListData(data) {
  const transformedMenuData = data.reduce((acc, item) => {
    const { category, ...rest } = item;
    if (!acc[category]) {
      acc[category] = { name: category, data: [] };
    }
    acc[category].data.push(rest);
    return acc;
  }, {});

  const transformedMenuArray = Object.values(transformedMenuData);

  return transformedMenuArray;
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}
