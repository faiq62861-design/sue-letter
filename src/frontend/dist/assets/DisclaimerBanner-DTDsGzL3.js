import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, X } from "./index-DkssxSHZ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
function DisclaimerBanner({
  dismissible = false,
  className = ""
}) {
  const [dismissed, setDismissed] = reactExports.useState(false);
  if (dismissed) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      role: "alert",
      className: `warning-banner flex items-start justify-between gap-3 ${className}`,
      "data-ocid": "disclaimer.banner",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TriangleAlert,
            {
              className: "w-4 h-4 mt-0.5 shrink-0 text-yellow-700",
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-yellow-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "font-semibold", children: "Disclaimer:" }),
            " This tool does not provide legal advice. The generated letter is a starting point — consult a licensed attorney before sending for complex legal matters. No attorney-client relationship is formed."
          ] })
        ] }),
        dismissible && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setDismissed(true),
            "aria-label": "Dismiss disclaimer",
            className: "shrink-0 text-yellow-700 hover:text-yellow-900 transition-fast",
            "data-ocid": "disclaimer.close_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
          }
        )
      ]
    }
  );
}
export {
  DisclaimerBanner as D,
  TriangleAlert as T
};
