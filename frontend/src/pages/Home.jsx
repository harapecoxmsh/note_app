import { useState, useEffect } from "react"
import api from "../api"
import Note from "../components/Note.jsx"
import "../styles/Home.css"



function Home() {
    const [notes, setNotes] = useState([])
    const [content, setContent] = useState("")
    const [show, setShow] = useState(false)
    const [addtag, setAddtag] = useState(false)
    const [file, setFile] = useState(null)
    const [selectedTags, setSelectedTags] = useState("")//create_note
    const [fileName, setFileName] = useState("")
    const [tagName, setTagName] = useState("")//create_tag
    const [tags, setTags] = useState([])//tag list
    const [sortTag, setSortTag] = useState("")



    useEffect(() => {
        document.body.style.overflow = "hidden";
        getNotes();
        getTags();
    }, []);

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const getTags = () => {
        api
            .get("/api/tags/")
            .then((res) => res.data)
            .then((data) => {
                setTags(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const deleteNote = (id) => {
        api.delete(`/api/notes/delete/${id}/`).then((res) => {
            if (res.status === 204) alert("Note deleted");
            else alert("Failed to delete note.");
            getNotes();
        }).catch((error) => alert(error))
    };



    const createNote = (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('content', content);
        if (file) {
            formData.append('file', file);
            formData.append('file_name', fileName);
        }
        if (selectedTags) {
            formData.append('tags', selectedTags);
        }

        api.post("/api/notes/", formData).then((res) => {
            if (res.status === 201) alert("Note created")
            else alert("Failed to create note.")
        }).catch((error) => alert(error));
        getNotes();

    };

    const createTag = (e) => {
        e.preventDefault();
        const tagData = {
            name: tagName
        };
        api.post("/api/tags/", tagData).then((res) => {
            if (res.status === 201) alert("Tag created")
            else alert("Failed to create Tag.")
        }).catch((error) => alert(error));
        getTags();
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile.name)
    };

    const handleClick = () => {
        setShow(!show)
    }

    const handleAddTag = () => {
        setAddtag(!addtag)
    }

    const filteredNotes = sortTag ? notes.filter(note => note.tags.includes(parseInt(sortTag)))
    : notes;


    return (
        <div className="home-body">
                <h2>Hacker's Note</h2>
                <div className="note-list" style={{ width: '600px', height: '400px', overflow: 'auto' }} >
                    {notes.map((note) => (
                        <Note note={note} onDelete={deleteNote} key={note.id} tags={tags}/>
                    ))}
                </div>

            <div className="sort">
                <h3>Sort</h3>
                <select name="tags" id="tags" value={sortTag} onChange={(e) => setSortTag(e.target.value)}>
                <option value="">Undecided</option>
                    {tags.map((tag) => (
                     <option key={tag.id} value={tag.id}>{tag.name}</option>
                    ))}
                </select>

                <div className="note-list" style={{ width: '600px', height: '600px', overflow: 'auto' }} >
                {filteredNotes.map((note) => (
                    <Note note={note} key={note.id} tags={tags} />
                ))}
                </div>
            </div>
            <form className="Home-Form" enctype="multipart/form-data" onSubmit={createNote}>
                <label htmlFor="content">Content:</label>
                <br />
                <textarea
                    id="content"
                    name="content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <button className="media-add" type="button" onClick={handleClick}>+</button>

                {show && (
                    <div>
                        <label className="upload-files">
                        <input type="file" name="file" onChange={handleFileChange} style={{ width: '100px', marginLeft: '5px', marginRight: '5px' }} />
                        </label>
                    </div>
                )}
                <select className="select-tag" name="tags" id="tags" value={selectedTags} onChange={(e) => setSelectedTags(e.target.value)}>
                <option value="">Undecided</option>
                    {tags.map((tag) => (
                        <option key={tag.id} value={tag.id}>{tag.name}</option>
                    ))}
                </select>



                <br />
                <input type="submit" value="Submit"></input>
            </form>

            {addtag && (
                    <div>
                        <label className="newtag">
                        <button className="add-tag-button" onClick={createTag}>+</button>
                        <input id="name" type="text" name="name" value={tagName} onChange={(e) => setTagName(e.target.value)} />
                        </label>
                    </div>
            )}
            <button className="addtag" onClick={handleAddTag}>+tag</button>

        </div>
    )
}

export default Home