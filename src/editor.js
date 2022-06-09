import { EditorState, basicSetup } from "@codemirror/basic-setup";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";

export function createEditor(startCode, codeChangeCallback) {
    let baseTheme = EditorView.theme({
        "&": {
          fontSize: "20pt",
          color: "white",
          backgroundColor: "transparent",
          height: "80vh",
        },
        ".cm-editor, .cm-editor:focused": {
          outline: "0 !important"
        },
        ".cm-content ": {
          caretColor: "#0e9"
        },
        ".cm-scroller": {
            overflow: "scroll",
            border: "none",
        },
        "&.cm-focused ": {
          outline: 0
        },
        "&.cm-focused .cm-cursor": {
          borderLeftColor: "#0e9"
        },
        "&.cm-focused .cm-selectionBackground, ::selection": {
          backgroundColor: "#074",
        },
        ".cm-gutters": {
          backgroundColor: "transparent",
          color: "#ddd",
          border: "none",
          outline: "none"
        }
      }, {dark: true});

    let codeUpdateListener = EditorView.updateListener.of((v)=> {
        if(v.docChanged) {
            const code = v.state.doc.toString();
            codeChangeCallback(code);
        }
    });

    const doc = startCode;
    return new EditorView({
    state: EditorState.create({
        doc,
        extensions: [            
            basicSetup,
            keymap.of([indentWithTab]),
            javascript(),
            baseTheme,
            codeUpdateListener,
           ]
    })});
}