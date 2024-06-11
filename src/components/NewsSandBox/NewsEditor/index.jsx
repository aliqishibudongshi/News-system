import React, { useState } from 'react'
import { convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "./index.css"

export default function NewsEditor(props) {
    const [editorState, setEditorState] = useState("")
    return (
        <div>
            {/* 
                1、editorState={editorState}和onEditorStateChange={this.onEditorStateChange} 一起使用，变成受控组件，每次更新把editorState传进去进行修改。
                2、其他属性是控制样式的。
            */}
            <Editor
                editorState={editorState}
                toolbarClassName='toolbarClassName'
                wrapperClassName='wrapperClassName'
                editorClassName='editorClassName'
                onEditorStateChange={(editorState) => setEditorState(editorState)}
                onBlur={() => {
                    props.getEditorContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    )
}
