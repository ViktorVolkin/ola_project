(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/pages/BouquetsPage/BouquetFragmentFocus.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BouquetFragmentFocus",
    ()=>BouquetFragmentFocus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function BouquetFragmentFocus({ targetIds }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BouquetFragmentFocus.useEffect": ()=>{
            const focusFragment = {
                "BouquetFragmentFocus.useEffect.focusFragment": ()=>{
                    const id = window.location.hash.slice(1);
                    if (targetIds.includes(id)) {
                        document.getElementById(id)?.focus({
                            preventScroll: true
                        });
                    }
                }
            }["BouquetFragmentFocus.useEffect.focusFragment"];
            focusFragment();
            window.addEventListener("hashchange", focusFragment);
            return ({
                "BouquetFragmentFocus.useEffect": ()=>window.removeEventListener("hashchange", focusFragment)
            })["BouquetFragmentFocus.useEffect"];
        }
    }["BouquetFragmentFocus.useEffect"], [
        targetIds
    ]);
    return null;
}
_s(BouquetFragmentFocus, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = BouquetFragmentFocus;
var _c;
__turbopack_context__.k.register(_c, "BouquetFragmentFocus");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_pages_BouquetsPage_BouquetFragmentFocus_tsx_12npo94atn5vy._.js.map