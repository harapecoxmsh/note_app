import React from "react";
import "../styles/Note.css"
import api from "../api";




function Note({ note, onDelete, tags }) {
    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US")

    const downloadFile = (id) => {
        api.get(`/api/notes/${id}/download/`).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = note.file_name;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error downloading file:', error);
        });
    }


    return (
        <div className="note-container">
            <p className="note-content">{note.content}</p>
            {note.file && !note.file_name && (
                <img src={note.file} alt="Note File" className="note-image" />
            )}
            {note.file_name && (
                <div>
                    <p className="file-name">{note.file_name}</p>
                    <button className="download-button" onClick={() => downloadFile(note.id)}>Download File</button>
                </div>
            )}
            {tags.filter(tag => note.tags.includes(tag.id)).map(tag => (
                <p key={tag.id} className="tag-name">{tag.name}</p>
            ))}
            <p className="note-date">{formattedDate}</p>
            <button className="delete-button" onClick={() => onDelete(note.id)}>
                Delete
            </button>
        </div>
    );
}

export default Note
