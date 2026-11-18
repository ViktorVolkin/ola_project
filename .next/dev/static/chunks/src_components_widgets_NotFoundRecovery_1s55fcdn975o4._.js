(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/widgets/NotFoundRecovery/NotFoundArtwork.module.css [app-client] (css module)", ((__turbopack_context__) => {

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
"[project]/src/components/widgets/NotFoundRecovery/NotFoundRippleIntro.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotFoundRippleIntro",
    ()=>NotFoundRippleIntro
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$NotFoundRecovery$2f$NotFoundArtwork$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/widgets/NotFoundRecovery/NotFoundArtwork.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function NotFoundRippleIntro({ children, className = "" }) {
    _s();
    const stage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotFoundRippleIntro.useEffect": ()=>{
            const element = stage.current;
            if (!element || typeof window.matchMedia !== "function") return;
            const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
            if (preference.matches || typeof preference.addEventListener !== "function") return;
            const stop = {
                "NotFoundRippleIntro.useEffect.stop": ()=>{
                    element.dataset.motion = "static";
                }
            }["NotFoundRippleIntro.useEffect.stop"];
            element.dataset.motion = "intro";
            // CSS ends at 3950ms including its longest stagger. Retire the lifecycle too.
            const timer = window.setTimeout(stop, 4000);
            const onPreferenceChange = {
                "NotFoundRippleIntro.useEffect.onPreferenceChange": ()=>{
                    if (preference.matches) {
                        window.clearTimeout(timer);
                        stop();
                    }
                // Returning to no-preference must not replay an interrupted intro.
                }
            }["NotFoundRippleIntro.useEffect.onPreferenceChange"];
            preference.addEventListener("change", onPreferenceChange);
            return ({
                "NotFoundRippleIntro.useEffect": ()=>{
                    window.clearTimeout(timer);
                    preference.removeEventListener("change", onPreferenceChange);
                    stop();
                }
            })["NotFoundRippleIntro.useEffect"];
        }
    }["NotFoundRippleIntro.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: stage,
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$NotFoundRecovery$2f$NotFoundArtwork$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].stage} ${className}`,
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
_s(NotFoundRippleIntro, "Y1ReGG+StHPLuxhY0lGxBX4qtcc=");
_c = NotFoundRippleIntro;
var _c;
__turbopack_context__.k.register(_c, "NotFoundRippleIntro");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_widgets_NotFoundRecovery_1s55fcdn975o4._.js.map