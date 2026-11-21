(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/widgets/ContactBlocks/ContactFaq.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "answer": "ContactFaq-module__b-yB9W__answer",
  "item": "ContactFaq-module__b-yB9W__item",
  "sign": "ContactFaq-module__b-yB9W__sign",
  "title": "ContactFaq-module__b-yB9W__title",
  "trigger": "ContactFaq-module__b-yB9W__trigger",
});
}),
"[project]/src/components/widgets/ContactBlocks/ContactFaq.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ContactFaq",
    ()=>ContactFaq
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$ContactBlocks$2f$ContactFaq$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/widgets/ContactBlocks/ContactFaq.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ContactFaq({ items }) {
    _s();
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        0
    ]);
    const buttons = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    function navigate(event, index) {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || !items.length) return;
        let next;
        switch(event.key){
            case "ArrowDown":
                next = (index + 1) % items.length;
                break;
            case "ArrowUp":
                next = (index - 1 + items.length) % items.length;
                break;
            case "Home":
                next = 0;
                break;
            case "End":
                next = items.length - 1;
                break;
            default:
                return;
        }
        event.preventDefault();
        buttons.current[next]?.focus();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: items.map((item, i)=>{
            const expanded = open.includes(i);
            const panelId = `${id}-answer-${i}`;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$ContactBlocks$2f$ContactFaq$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].item,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$ContactBlocks$2f$ContactFaq$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].title,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            ref: (node)=>{
                                buttons.current[i] = node;
                            },
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$ContactBlocks$2f$ContactFaq$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].trigger,
                            type: "button",
                            "aria-expanded": expanded,
                            "aria-controls": panelId,
                            onKeyDown: (event)=>navigate(event, i),
                            onClick: ()=>setOpen((current)=>current.includes(i) ? current.filter((value)=>value !== i) : [
                                        ...current,
                                        i
                                    ]),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: item.question
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/ContactBlocks/ContactFaq.tsx",
                                    lineNumber: 27,
                                    columnNumber: 9
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$ContactBlocks$2f$ContactFaq$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sign,
                                    viewBox: "0 0 16 16",
                                    "aria-hidden": "true",
                                    focusable: "false",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: expanded ? "M3 8h10" : "M3 8h10M8 3v10"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/widgets/ContactBlocks/ContactFaq.tsx",
                                        lineNumber: 27,
                                        columnNumber: 123
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/widgets/ContactBlocks/ContactFaq.tsx",
                                    lineNumber: 27,
                                    columnNumber: 37
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/widgets/ContactBlocks/ContactFaq.tsx",
                            lineNumber: 26,
                            columnNumber: 36
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/ContactBlocks/ContactFaq.tsx",
                        lineNumber: 26,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: panelId,
                        hidden: !expanded,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$widgets$2f$ContactBlocks$2f$ContactFaq$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].answer,
                        children: item.answer
                    }, void 0, false, {
                        fileName: "[project]/src/components/widgets/ContactBlocks/ContactFaq.tsx",
                        lineNumber: 29,
                        columnNumber: 7
                    }, this)
                ]
            }, i, true, {
                fileName: "[project]/src/components/widgets/ContactBlocks/ContactFaq.tsx",
                lineNumber: 25,
                columnNumber: 12
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/components/widgets/ContactBlocks/ContactFaq.tsx",
        lineNumber: 22,
        columnNumber: 10
    }, this);
}
_s(ContactFaq, "XaVpHZiJSAVeNTnKpFlfnxgLK/Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = ContactFaq;
var _c;
__turbopack_context__.k.register(_c, "ContactFaq");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_widgets_ContactBlocks_0nwk91snbkwab._.js.map