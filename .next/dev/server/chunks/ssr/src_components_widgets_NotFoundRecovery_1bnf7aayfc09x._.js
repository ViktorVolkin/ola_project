module.exports = [
"[project]/src/components/widgets/NotFoundRecovery/NotFoundArtwork.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "centre": "NotFoundArtwork-module__w5nova__centre",
  "inner": "NotFoundArtwork-module__w5nova__inner",
  "number": "NotFoundArtwork-module__w5nova__number",
  "outer": "NotFoundArtwork-module__w5nova__outer",
  "ring": "NotFoundArtwork-module__w5nova__ring",
  "rippleIntro": "NotFoundArtwork-module__w5nova__rippleIntro",
  "second": "NotFoundArtwork-module__w5nova__second",
  "signature": "NotFoundArtwork-module__w5nova__signature",
  "stage": "NotFoundArtwork-module__w5nova__stage",
  "third": "NotFoundArtwork-module__w5nova__third",
});
}),
"[project]/src/components/widgets/NotFoundRecovery/NotFoundRippleIntro.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotFoundRippleIntro",
    ()=>NotFoundRippleIntro
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$NotFoundRecovery$2f$NotFoundArtwork$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/widgets/NotFoundRecovery/NotFoundArtwork.module.css [app-ssr] (css module)");
"use client";
;
;
;
function NotFoundRippleIntro({ children, className = "" }) {
    const stage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const element = stage.current;
        if (!element || typeof window.matchMedia !== "function") return;
        const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (preference.matches || typeof preference.addEventListener !== "function") return;
        const stop = ()=>{
            element.dataset.motion = "static";
        };
        element.dataset.motion = "intro";
        // CSS ends at 3950ms including its longest stagger. Retire the lifecycle too.
        const timer = window.setTimeout(stop, 4000);
        const onPreferenceChange = ()=>{
            if (preference.matches) {
                window.clearTimeout(timer);
                stop();
            }
        // Returning to no-preference must not replay an interrupted intro.
        };
        preference.addEventListener("change", onPreferenceChange);
        return ()=>{
            window.clearTimeout(timer);
            preference.removeEventListener("change", onPreferenceChange);
            stop();
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: stage,
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$NotFoundRecovery$2f$NotFoundArtwork$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].stage} ${className}`,
        "data-404-artwork": "",
        "data-motion": "static",
        "aria-hidden": "true",
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/NotFoundRecovery/NotFoundRippleIntro.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_components_widgets_NotFoundRecovery_1bnf7aayfc09x._.js.map