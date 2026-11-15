"use client";

import {useEffect} from "react";

/** Restore the catalogue fragment's keyboard destination after route navigation. */
export function BouquetFragmentFocus({targetIds}: {targetIds: readonly string[]}) {
  useEffect(() => {
    const focusFragment = () => {
      const id = window.location.hash.slice(1);
      if (targetIds.includes(id)) {
        document.getElementById(id)?.focus({preventScroll: true});
      }
    };
    focusFragment();
    window.addEventListener("hashchange", focusFragment);
    return () => window.removeEventListener("hashchange", focusFragment);
  }, [targetIds]);
  return null;
}
