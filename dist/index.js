import A, { useState as N, useRef as D, useCallback as x, useEffect as j } from "react";
import { jsxs as U, jsx as c, Fragment as C } from "react/jsx-runtime";
function T(e = {}) {
  const { onDrop: r, accept: n, disabled: s = !1, noClick: u = !1 } = e, [d, p] = N(!1), a = D(null), t = D(0), o = x(
    (f) => {
      var v, R;
      f.preventDefault(), f.stopPropagation(), !s && (t.current++, (R = (v = f.dataTransfer) == null ? void 0 : v.items) != null && R.length && p(!0));
    },
    [s]
  ), l = x(
    (f) => {
      f.preventDefault(), f.stopPropagation(), !s && (t.current--, t.current === 0 && p(!1));
    },
    [s]
  ), i = x(
    (f) => {
      f.preventDefault(), f.stopPropagation(), !s && (f.dataTransfer.dropEffect = "copy");
    },
    [s]
  ), g = x(
    (f) => {
      var R;
      if (f.preventDefault(), f.stopPropagation(), s) return;
      t.current = 0, p(!1);
      const v = (R = f.dataTransfer) == null ? void 0 : R.files;
      console.log("[useDropzone] Files dropped:", v == null ? void 0 : v.length, v), v != null && v.length && r && r(v);
    },
    [s, r]
  ), k = x(() => {
    var f;
    s || u || (f = a.current) == null || f.click();
  }, [s, u]), z = x(
    (f) => {
      const v = f.target.files;
      console.log("[useDropzone] Files selected via input:", v == null ? void 0 : v.length, v), v != null && v.length && r && r(v), f.target.value = "";
    },
    [r]
  ), $ = x(() => {
    var f;
    (f = a.current) == null || f.click();
  }, []), m = x(
    () => ({
      onDragEnter: o,
      onDragLeave: l,
      onDragOver: i,
      onDrop: g,
      onClick: k,
      role: "button",
      tabIndex: s ? -1 : 0,
      "aria-disabled": s
    }),
    [o, l, i, g, k, s]
  ), b = x(
    () => ({
      type: "file",
      multiple: !0,
      accept: n == null ? void 0 : n.join(","),
      onChange: z,
      style: { display: "none" },
      tabIndex: -1
    }),
    [n, z]
  ), q = x(() => a, []);
  return j(() => () => {
    t.current = 0;
  }, []), {
    getRootProps: m,
    getInputProps: b,
    getInputRef: q,
    isDragging: d,
    open: $
  };
}
function H(e, r) {
  var p;
  if (!r || r.length === 0) return null;
  const n = e.type, u = (p = e.name.split(".").pop()) == null ? void 0 : p.toLowerCase();
  return r.some((a) => {
    if (a.endsWith("/*")) {
      const t = a.replace("/*", "");
      return n.startsWith(t);
    }
    return a.includes("/") ? n === a : a.startsWith(".") ? `.${u}` === a.toLowerCase() : !1;
  }) ? null : {
    file: e,
    type: "type",
    message: `File type "${n || u}" is not allowed. Accepted: ${r.join(", ")}`
  };
}
function V(e, r) {
  if (!r) return null;
  if (e.size > r) {
    const n = (r / 1048576).toFixed(1), s = (e.size / (1024 * 1024)).toFixed(1);
    return {
      file: e,
      type: "size",
      message: `File "${e.name}" (${s}MB) exceeds maximum size of ${n}MB`
    };
  }
  return null;
}
function G(e, r, n) {
  return n && e + r > n ? {
    file: new File([], ""),
    type: "count",
    message: `Cannot add ${r} files. Maximum allowed: ${n}, current: ${e}`
  } : null;
}
function K(e, r) {
  const n = H(e, r.accept);
  if (n) return n;
  const s = V(e, r.maxSize);
  return s || null;
}
function X(e, r, n) {
  const s = [], u = [], d = G(r, e.length, n.maxFiles);
  d && u.push(d);
  const p = n.maxFiles ? Math.min(e.length, n.maxFiles - r) : e.length;
  for (let a = 0; a < e.length; a++) {
    const t = e[a];
    if (a < p) {
      const o = K(t, n);
      o ? u.push(o) : s.push(t);
    }
  }
  return { valid: s, errors: u };
}
function Z() {
  return `file_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}
function J(e) {
  if (e === 0) return "0 B";
  const r = ["B", "KB", "MB", "GB"], n = 1024, s = Math.floor(Math.log(e) / Math.log(n));
  return `${parseFloat((e / Math.pow(n, s)).toFixed(1))} ${r[s]}`;
}
function Q(e) {
  var r;
  return ((r = e.split(".").pop()) == null ? void 0 : r.toLowerCase()) || "";
}
function _(e) {
  return e.type.startsWith("image/");
}
function E(e) {
  return e.type.startsWith("video/");
}
function fe() {
  const [e, r] = N({}), n = x((a, t) => new Promise((o) => {
    if (!_(t) && !E(t)) {
      o(null);
      return;
    }
    const l = URL.createObjectURL(t);
    r((i) => ({ ...i, [a]: l })), o(l);
  }), []), s = x(
    async (a) => {
      const t = {};
      for (const { id: o, file: l } of a)
        _(l) || E(l) ? t[o] = URL.createObjectURL(l) : t[o] = null;
      r((o) => ({ ...o, ...t }));
    },
    []
  ), u = x((a) => {
    r((t) => {
      const o = t[a];
      o && URL.revokeObjectURL(o);
      const { [a]: l, ...i } = t;
      return i;
    });
  }, []), d = x(() => {
    r((a) => (Object.values(a).forEach((t) => {
      t && URL.revokeObjectURL(t);
    }), {}));
  }, []), p = x(
    (a) => e[a] ?? null,
    [e]
  );
  return j(() => () => {
    Object.values(e).forEach((a) => {
      a && URL.revokeObjectURL(a);
    });
  }, []), {
    previews: e,
    generatePreview: n,
    generatePreviews: s,
    removePreview: u,
    clearPreviews: d,
    getPreview: p
  };
}
function I(e) {
  const { url: r, file: n, fieldName: s = "file", headers: u = {}, onProgress: d, signal: p } = e;
  return new Promise((a) => {
    const t = new XMLHttpRequest(), o = new FormData();
    o.append(s, n), t.upload.addEventListener("progress", (l) => {
      if (l.lengthComputable && d) {
        const i = Math.round(l.loaded / l.total * 100);
        console.log("[uploader] XHR progress:", i, "%"), d(i);
      }
    }), t.addEventListener("load", () => {
      if (t.status >= 200 && t.status < 300) {
        let l;
        try {
          l = JSON.parse(t.responseText);
        } catch {
          l = t.responseText;
        }
        a({
          id: "",
          success: !0,
          response: l
        });
      } else
        a({
          id: "",
          success: !1,
          error: `Upload failed with status ${t.status}: ${t.statusText}`
        });
    }), t.addEventListener("error", () => {
      a({
        id: "",
        success: !1,
        error: "Network error occurred during upload"
      });
    }), t.addEventListener("abort", () => {
      a({
        id: "",
        success: !1,
        error: "Upload was cancelled"
      });
    }), p && p.addEventListener("abort", () => {
      t.abort();
    }), t.open("POST", r, !0), Object.entries(u).forEach(([l, i]) => {
      t.setRequestHeader(l, i);
    }), t.send(o);
  });
}
async function Y(e, r) {
  const { concurrent: n = 3, onFileProgress: s, ...u } = r, d = [], p = [...e];
  async function a() {
    const o = p.shift();
    if (!o) return;
    console.log("[uploader] Starting upload for:", o.file.name);
    const l = await I({
      ...u,
      file: o.file,
      onProgress: (i) => {
        console.log("[uploader] Progress for", o.id, ":", i, "%"), s == null || s(o.id, i);
      }
    });
    d.push({ ...l, id: o.id }), await a();
  }
  const t = Array(Math.min(n, e.length)).fill(null).map(() => a());
  return await Promise.all(t), d;
}
async function we(e, r = 3, n = 1e3) {
  let s;
  for (let u = 0; u <= r; u++) {
    const d = await I(e);
    if (d.success || (s = d.error, d.error === "Upload was cancelled"))
      return d;
    if (u < r) {
      const p = n * Math.pow(2, u);
      await new Promise((a) => setTimeout(a, p));
    }
  }
  return {
    id: "",
    success: !1,
    error: `Upload failed after ${r + 1} attempts: ${s}`
  };
}
function ee(e = {}) {
  const {
    accept: r,
    maxFiles: n,
    maxSize: s,
    uploadUrl: u = "/api/upload",
    headers: d,
    fieldName: p = "file",
    onUploadComplete: a,
    onProgress: t,
    onError: o
  } = e, [l, i] = N([]), [g, k] = N({}), [z, $] = N(!1), [m, b] = N([]), q = D(null), f = x((F) => _(F) || E(F) ? URL.createObjectURL(F) : null, []), v = x(
    (F) => {
      console.log("[useFileUploader] addFiles called with:", F);
      const w = Array.from(F);
      console.log("[useFileUploader] fileArray:", w);
      const { valid: h, errors: y } = X(w, l.length, {
        accept: r,
        maxSize: s,
        maxFiles: n
      });
      if (console.log("[useFileUploader] Validation result - valid:", h.length, "errors:", y.length), y.length > 0 && (b((P) => [...P, ...y]), y.forEach((P) => o == null ? void 0 : o(P))), h.length > 0) {
        const P = h.map((L) => ({
          id: Z(),
          file: L,
          preview: f(L),
          progress: 0,
          status: "pending"
        }));
        console.log("[useFileUploader] Adding new file entries:", P), i((L) => [...L, ...P]);
      }
    },
    [l.length, r, s, n, o, f]
  ), R = x((F) => {
    i((w) => {
      const h = w.find((y) => y.id === F);
      return h != null && h.preview && URL.revokeObjectURL(h.preview), w.filter((y) => y.id !== F);
    }), k((w) => {
      const { [F]: h, ...y } = w;
      return y;
    });
  }, []), M = x((F, w) => {
    k((h) => ({ ...h, [F]: w })), i(
      (h) => h.map(
        (y) => y.id === F ? { ...y, progress: w } : y
      )
    ), t == null || t(F, w);
  }, [t]), O = x(async () => {
    const F = l.filter((w) => w.status === "pending");
    if (F.length === 0) return [];
    console.log("[useFileUploader] Starting upload for", F.length, "files"), $(!0), q.current = new AbortController(), i(
      (w) => w.map(
        (h) => h.status === "pending" ? { ...h, status: "uploading", progress: 0 } : h
      )
    );
    try {
      const w = await Y(
        F.map((h) => ({ id: h.id, file: h.file })),
        {
          url: u,
          headers: d,
          fieldName: p,
          signal: q.current.signal,
          onFileProgress: (h, y) => {
            console.log("[useFileUploader] Progress update:", h, y), M(h, y);
          }
        }
      );
      return console.log("[useFileUploader] Upload results:", w), i(
        (h) => h.map((y) => {
          const P = w.find((L) => L.id === y.id);
          return P ? {
            ...y,
            status: P.success ? "success" : "error",
            error: P.error,
            progress: P.success ? 100 : y.progress
          } : y;
        })
      ), w.forEach((h) => {
        h.success ? a == null || a(h) : o == null || o(h);
      }), w;
    } finally {
      $(!1), q.current = null;
    }
  }, [l, u, d, p, M, a, o]), S = x(() => {
    b([]);
  }, []), W = x(() => {
    var F;
    (F = q.current) == null || F.abort(), l.forEach((w) => {
      w.preview && URL.revokeObjectURL(w.preview);
    }), i([]), k({}), $(!1), b([]);
  }, [l]);
  return {
    files: l,
    addFiles: v,
    removeFile: R,
    upload: O,
    uploadProgress: g,
    isUploading: z,
    errors: m,
    clearErrors: S,
    reset: W
  };
}
const re = () => /* @__PURE__ */ U(
  "svg",
  {
    className: "mq-dropzone__icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    children: [
      /* @__PURE__ */ c("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
      /* @__PURE__ */ c("polyline", { points: "17 8 12 3 7 8" }),
      /* @__PURE__ */ c("line", { x1: "12", y1: "3", x2: "12", y2: "15" })
    ]
  }
);
function te({
  onFiles: e,
  accept: r,
  disabled: n = !1,
  className: s = "",
  children: u,
  isDragging: d
}) {
  const p = T({
    onDrop: (i) => {
      console.log("[DropZone] onDrop called with files:", i), e == null || e(i);
    },
    accept: r,
    disabled: n
  }), t = [
    "mq-dropzone",
    (d ?? p.isDragging) && "mq-dropzone--dragging",
    n && "mq-dropzone--disabled",
    s
  ].filter(Boolean).join(" "), o = p.getInputProps(), l = p.getInputRef();
  return /* @__PURE__ */ U("div", { className: t, ...p.getRootProps(), children: [
    /* @__PURE__ */ c(
      "input",
      {
        type: o.type,
        multiple: o.multiple,
        accept: o.accept,
        onChange: o.onChange,
        ref: l,
        style: o.style,
        tabIndex: o.tabIndex
      }
    ),
    u || /* @__PURE__ */ U(C, { children: [
      /* @__PURE__ */ c(re, {}),
      /* @__PURE__ */ U("div", { className: "mq-dropzone__text", children: [
        /* @__PURE__ */ U("p", { className: "mq-dropzone__title", children: [
          "Drag & drop files here, or",
          " ",
          /* @__PURE__ */ c("span", { className: "mq-dropzone__browse", children: "browse" })
        ] }),
        /* @__PURE__ */ c("p", { className: "mq-dropzone__subtitle", children: r != null && r.length ? `Supports: ${r.join(", ")}` : "All file types supported" })
      ] })
    ] })
  ] });
}
function se({
  value: e,
  className: r = "",
  showText: n = !1,
  status: s = "uploading"
}) {
  const u = Math.min(100, Math.max(0, e)), d = s !== "uploading" && s !== "pending" ? `mq-progress--${s}` : "";
  return /* @__PURE__ */ U("div", { className: `mq-progress-wrapper ${r}`, children: [
    /* @__PURE__ */ c("div", { className: `mq-progress ${d}`, children: /* @__PURE__ */ c(
      "div",
      {
        className: "mq-progress__bar",
        style: { width: `${u}%` },
        role: "progressbar",
        "aria-valuenow": u,
        "aria-valuemin": 0,
        "aria-valuemax": 100
      }
    ) }),
    n && /* @__PURE__ */ U("span", { className: "mq-progress__text", children: [
      u,
      "%"
    ] })
  ] });
}
const ne = () => /* @__PURE__ */ U("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
  /* @__PURE__ */ c("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
  /* @__PURE__ */ c("polyline", { points: "14 2 14 8 20 8" })
] }), oe = () => /* @__PURE__ */ U("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", width: "16", height: "16", children: [
  /* @__PURE__ */ c("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
  /* @__PURE__ */ c("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
] }), ae = () => /* @__PURE__ */ c("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", width: "16", height: "16", children: /* @__PURE__ */ c("polyline", { points: "20 6 9 17 4 12" }) }), ie = () => /* @__PURE__ */ U("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { animation: "spin 1s linear infinite" }, children: [
  /* @__PURE__ */ c("circle", { cx: "12", cy: "12", r: "10", opacity: "0.25" }),
  /* @__PURE__ */ c("path", { d: "M12 2a10 10 0 0 1 10 10" }),
  /* @__PURE__ */ c("style", { children: "@keyframes spin { to { transform: rotate(360deg); } }" })
] });
function le({
  file: e,
  onRemove: r,
  className: n = "",
  showRemove: s = !0
}) {
  const u = Q(e.file.name).toUpperCase(), d = e.status === "success" || e.status === "error" ? `mq-file-preview--${e.status}` : "", p = e.status === "uploading";
  return /* @__PURE__ */ U("div", { className: `mq-file-preview ${d} ${n}`, children: [
    /* @__PURE__ */ c("div", { className: "mq-file-preview__thumbnail", children: e.preview ? /* @__PURE__ */ c("img", { src: e.preview, alt: e.file.name }) : /* @__PURE__ */ c("div", { className: "mq-file-preview__icon", children: /* @__PURE__ */ c(ne, {}) }) }),
    /* @__PURE__ */ U("div", { className: "mq-file-preview__info", children: [
      /* @__PURE__ */ c("p", { className: "mq-file-preview__name", title: e.file.name, children: e.file.name }),
      /* @__PURE__ */ U("div", { className: "mq-file-preview__meta", children: [
        /* @__PURE__ */ c("span", { children: J(e.file.size) }),
        u && /* @__PURE__ */ c("span", { children: "•" }),
        u && /* @__PURE__ */ c("span", { children: u }),
        e.status === "pending" && /* @__PURE__ */ U(C, { children: [
          /* @__PURE__ */ c("span", { children: "•" }),
          /* @__PURE__ */ c("span", { style: { color: "var(--mq-gray-400)" }, children: "Ready" })
        ] }),
        e.status === "uploading" && /* @__PURE__ */ U(C, { children: [
          /* @__PURE__ */ c("span", { children: "•" }),
          /* @__PURE__ */ U("span", { style: { color: "var(--mq-primary)", display: "flex", alignItems: "center", gap: "4px" }, children: [
            /* @__PURE__ */ c(ie, {}),
            " Uploading ",
            e.progress,
            "%"
          ] })
        ] }),
        e.status === "success" && /* @__PURE__ */ U(C, { children: [
          /* @__PURE__ */ c("span", { children: "•" }),
          /* @__PURE__ */ U("span", { style: { color: "var(--mq-success)", display: "flex", alignItems: "center", gap: "2px" }, children: [
            /* @__PURE__ */ c(ae, {}),
            " Uploaded"
          ] })
        ] }),
        e.status === "error" && /* @__PURE__ */ U(C, { children: [
          /* @__PURE__ */ c("span", { children: "•" }),
          /* @__PURE__ */ c("span", { style: { color: "var(--mq-error)" }, children: "Failed" })
        ] })
      ] }),
      p && /* @__PURE__ */ c("div", { style: { marginTop: "0.5rem" }, children: /* @__PURE__ */ c(
        se,
        {
          value: e.progress,
          status: "uploading",
          showText: !0
        }
      ) }),
      e.error && /* @__PURE__ */ c("p", { className: "mq-file-preview__error", children: e.error })
    ] }),
    s && r && /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: "mq-file-preview__remove",
        onClick: () => r(e.id),
        "aria-label": `Remove ${e.file.name}`,
        children: /* @__PURE__ */ c(oe, {})
      }
    )
  ] });
}
function ce({
  files: e,
  onRemove: r,
  showPreview: n = !0,
  showProgress: s = !0,
  className: u = ""
}) {
  return e.length === 0 ? null : /* @__PURE__ */ c("div", { className: `mq-file-list ${u}`, children: e.map((d) => /* @__PURE__ */ c(
    le,
    {
      file: {
        ...d,
        progress: s ? d.progress : 0
      },
      onRemove: r,
      showRemove: !0
    },
    d.id
  )) });
}
const ue = () => /* @__PURE__ */ U("svg", { className: "mq-error-item__icon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
  /* @__PURE__ */ c("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ c("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
  /* @__PURE__ */ c("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
] });
function ve({
  uploadUrl: e = "/api/upload",
  accept: r,
  maxFiles: n,
  maxSize: s,
  showPreview: u = !0,
  showProgress: d = !0,
  autoUpload: p = !1,
  className: a = "",
  onComplete: t,
  onError: o,
  children: l,
  disabled: i = !1
}) {
  const g = ee({
    accept: r,
    maxFiles: n,
    maxSize: s,
    uploadUrl: e,
    onError: (m) => {
      o == null || o(m);
    }
  });
  A.useEffect(() => {
    p && g.files.some((m) => m.status === "pending") && g.upload().then((m) => {
      t == null || t(m);
    });
  }, [p, g.files]);
  const k = async () => {
    const m = await g.upload();
    t == null || t(m);
  }, z = g.files.some((m) => m.status === "pending"), $ = g.errors.length > 0;
  return /* @__PURE__ */ U("div", { className: `mq-uploader ${a}`, children: [
    /* @__PURE__ */ c(
      te,
      {
        onFiles: g.addFiles,
        accept: r,
        disabled: i || g.isUploading,
        children: l
      }
    ),
    $ && /* @__PURE__ */ c("div", { className: "mq-error-list", children: g.errors.map((m, b) => /* @__PURE__ */ U("div", { className: "mq-error-item", children: [
      /* @__PURE__ */ c(ue, {}),
      /* @__PURE__ */ c("span", { children: m.message })
    ] }, b)) }),
    /* @__PURE__ */ c(
      ce,
      {
        files: g.files,
        onRemove: g.removeFile,
        showPreview: u,
        showProgress: d
      }
    ),
    z && !p && /* @__PURE__ */ c(
      "button",
      {
        type: "button",
        className: `mq-upload-btn ${g.isUploading ? "mq-upload-btn--loading" : ""}`,
        onClick: k,
        disabled: g.isUploading || i,
        children: g.isUploading ? "Uploading..." : `Upload ${g.files.filter((m) => m.status === "pending").length} file(s)`
      }
    )
  ] });
}
async function de(e, r) {
  const {
    url: n,
    file: s,
    fieldName: u = "file",
    headers: d = {},
    onProgress: p,
    signal: a,
    additionalData: t = {}
  } = r, o = new FormData();
  o.append(u, s), Object.entries(t).forEach(([l, i]) => {
    o.append(l, i);
  });
  try {
    return {
      id: "",
      success: !0,
      response: (await e.post(n, o, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...d
        },
        signal: a,
        onUploadProgress: (i) => {
          if (i.total) {
            const g = Math.round(i.loaded / i.total * 100);
            console.log("[axios-uploader] Progress:", g, "%"), p == null || p(g);
          }
        }
      })).data
    };
  } catch (l) {
    const i = l;
    return i.code === "ERR_CANCELED" || i.name === "CanceledError" ? {
      id: "",
      success: !1,
      error: "Upload was cancelled"
    } : {
      id: "",
      success: !1,
      error: i.response ? `Upload failed with status ${i.response.status}: ${i.response.statusText}` : `Upload failed: ${i.message}`
    };
  }
}
async function ye(e, r, n) {
  const { concurrent: s = 3, onFileProgress: u, ...d } = n, p = [], a = [...r];
  async function t() {
    const l = a.shift();
    if (!l) return;
    const i = await de(e, {
      ...d,
      file: l.file,
      onProgress: (g) => {
        u == null || u(l.id, g);
      }
    });
    p.push({ ...i, id: l.id }), await t();
  }
  const o = Array(Math.min(s, r.length)).fill(null).map(() => t());
  return await Promise.all(o), p;
}
function pe(e, r = 1024 * 1024) {
  const n = [];
  let s = 0;
  for (; s < e.size; ) {
    const u = e.slice(s, s + r);
    n.push(u), s += r;
  }
  return n;
}
async function xe(e) {
  const {
    url: r,
    file: n,
    chunkSize: s = 1024 * 1024,
    // 1MB default
    fieldName: u = "file",
    headers: d = {},
    onProgress: p,
    onChunkComplete: a,
    signal: t
  } = e, o = pe(n, s), l = o.length, i = [];
  let g = 0;
  console.log(`[Chunker] Starting chunked upload: ${n.name}, ${l} chunks`);
  for (let k = 0; k < o.length; k++) {
    if (t != null && t.aborted)
      return {
        success: !1,
        responses: i,
        error: "Upload was cancelled"
      };
    const z = o[k], $ = new FormData();
    $.append(u, z, n.name), $.append("chunkIndex", String(k)), $.append("totalChunks", String(l)), $.append("fileName", n.name), $.append("fileSize", String(n.size));
    try {
      const m = await fetch(r, {
        method: "POST",
        headers: d,
        body: $,
        signal: t
      });
      if (!m.ok)
        return {
          success: !1,
          responses: i,
          error: `Chunk ${k + 1}/${l} failed: ${m.statusText}`
        };
      const b = await m.json().catch(() => ({}));
      i.push(b), g += z.size;
      const q = Math.round(g / n.size * 100);
      p == null || p(q), a == null || a(k, l), console.log(`[Chunker] Chunk ${k + 1}/${l} uploaded (${q}%)`);
    } catch (m) {
      return m.name === "AbortError" ? {
        success: !1,
        responses: i,
        error: "Upload was cancelled"
      } : {
        success: !1,
        responses: i,
        error: `Chunk ${k + 1}/${l} failed: ${m.message}`
      };
    }
  }
  return {
    success: !0,
    responses: i
  };
}
function Ue(e, r = 5 * 1024 * 1024) {
  return e.size > r;
}
async function ge(e, r = {}) {
  const {
    maxWidth: n = 1920,
    maxHeight: s = 1080,
    quality: u = 0.8,
    format: d = "image/jpeg"
  } = r;
  return e.type.startsWith("image/") ? new Promise((p, a) => {
    const t = new Image(), o = document.createElement("canvas"), l = o.getContext("2d");
    if (!l) {
      a(new Error("Failed to get canvas context"));
      return;
    }
    t.onload = () => {
      let { width: i, height: g } = t;
      i > n && (g = g * n / i, i = n), g > s && (i = i * s / g, g = s), o.width = i, o.height = g, l.drawImage(t, 0, 0, i, g), o.toBlob(
        (k) => {
          if (!k) {
            a(new Error("Failed to compress image"));
            return;
          }
          const z = d.split("/")[1], $ = e.name.replace(/\.[^/.]+$/, `.${z}`), m = new File([k], $, { type: d }), b = e.size, q = m.size;
          console.log(
            `[Compression] ${e.name}: ${B(b)} → ${B(q)} (${Math.round((1 - q / b) * 100)}% reduction)`
          ), p({
            file: m,
            originalSize: b,
            compressedSize: q,
            compressionRatio: q / b
          });
        },
        d,
        u
      ), URL.revokeObjectURL(t.src);
    }, t.onerror = () => {
      URL.revokeObjectURL(t.src), a(new Error("Failed to load image for compression"));
    }, t.src = URL.createObjectURL(e);
  }) : {
    file: e,
    originalSize: e.size,
    compressedSize: e.size,
    compressionRatio: 1
  };
}
async function Fe(e, r = {}) {
  return await Promise.all(
    e.map((s) => ge(s, r))
  );
}
function B(e) {
  if (e === 0) return "0 B";
  const r = ["B", "KB", "MB", "GB"], n = 1024, s = Math.floor(Math.log(e) / Math.log(n));
  return `${parseFloat((e / Math.pow(n, s)).toFixed(1))} ${r[s]}`;
}
function ke(e, r = 500 * 1024) {
  return e.type.startsWith("image/") && e.size > r;
}
function $e(e) {
  return e.size > 5 * 1024 * 1024 ? {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.7,
    format: "image/jpeg"
  } : e.size > 1 * 1024 * 1024 ? {
    maxWidth: 2560,
    maxHeight: 1440,
    quality: 0.8,
    format: "image/jpeg"
  } : {
    maxWidth: 3840,
    maxHeight: 2160,
    quality: 0.9,
    format: "image/webp"
  };
}
export {
  te as DropZone,
  ce as FileList,
  le as FilePreview,
  ve as FileUploader,
  se as ProgressBar,
  ge as compressImage,
  Fe as compressImages,
  J as formatFileSize,
  Q as getFileExtension,
  $e as getOptimalCompressionOptions,
  _ as isImageFile,
  E as isVideoFile,
  ke as shouldCompress,
  Ue as shouldUseChunkedUpload,
  pe as splitFileIntoChunks,
  I as uploadFile,
  xe as uploadFileChunked,
  Y as uploadFiles,
  ye as uploadFilesWithAxios,
  de as uploadWithAxios,
  we as uploadWithRetry,
  T as useDropzone,
  fe as useFilePreview,
  ee as useFileUploader,
  K as validateFile,
  X as validateFiles
};
