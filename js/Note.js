import {Helper} from "./Helper.js";
export class Note{
    static Note_Title;
    static Note_Content;
    static Note_Pinned;
    static Note_Time;
    static Note_Id;

    constructor(Note_Id,Note_Title,Note_Content,Note_Pinned,Note_Time)
    {   
        this.Note_Id = Note_Id
        this.Note_Title = Note_Title;
        this.Note_Content = Note_Content;
        this.Note_Pinned = Note_Pinned;
        this.Note_Time = Note_Time;
    }

    static SaveNote(title,content,pinned,time)
    {   
        
        var NOTE_BOX = [];
        
        let id = "";

            if(!window.localStorage.getItem("NOTES"))
            {
                id = 1;
                const NEW_NOTE = new Note(id,title,content,pinned,time);
                NOTE_BOX.push(NEW_NOTE);
                window.localStorage.setItem("NOTES",JSON.stringify(NOTE_BOX));
            }
            else
            {
                NOTE_BOX = JSON.parse(window.localStorage.getItem("NOTES")) || [];

                id = NOTE_BOX[NOTE_BOX.length-1].Note_Id+1;
    
                const NEW_NOTE = new Note(id,title,content,pinned,time);
                NOTE_BOX.push(NEW_NOTE);
                
                window.localStorage.setItem("NOTES",JSON.stringify(NOTE_BOX));
            }

        return id;
    }

    static UpdateNote(id,title,content,pinned,time)
    {
        var NOTE_BOX = [];
        if(window.localStorage.getItem("NOTES"))
        {
            NOTE_BOX = JSON.parse(window.localStorage.getItem("NOTES")) || [];

            for(let i=0; i<NOTE_BOX.length; i++)
            {
                if(NOTE_BOX[i].Note_Id==id)
                {
                   
                    NOTE_BOX[i].Note_Title = title;
                    NOTE_BOX[i].Note_Content = content;
                    NOTE_BOX[i].Note_Pinned = pinned;
                    NOTE_BOX[i].Note_Time = time;
                    
                    
                    break;
                }
            }
            window.localStorage.setItem("NOTES",JSON.stringify(NOTE_BOX));
            
        }
    }

    static UpdatePinned(id,pinned,time)
    {
        var NOTE_BOX = [];
        if(window.localStorage.getItem("NOTES"))
        {
            NOTE_BOX = JSON.parse(window.localStorage.getItem("NOTES")) || [];

            for(let i=0; i<NOTE_BOX.length; i++)
            {
                if(NOTE_BOX[i].Note_Id==id)
                {
                
                    NOTE_BOX[i].Note_Pinned = pinned;
                    NOTE_BOX[i].Note_Time = time;
                    break;
                }
            }
            window.localStorage.setItem("NOTES",JSON.stringify(NOTE_BOX));
            
        }
    }


    static DeleteNote(id)
    {
        var NOTE_BOX = [];
        if(window.localStorage.getItem("NOTES"))
        {
            NOTE_BOX = JSON.parse(window.localStorage.getItem("NOTES")) || [];

            for(let i=0; i<NOTE_BOX.length; i++)
            {
                if(NOTE_BOX[i].Note_Id==id)
                {
                    NOTE_BOX.splice(i,1);
                }
            }
            window.localStorage.setItem("NOTES",JSON.stringify(NOTE_BOX));
            
            
        }

        if(window.localStorage.getItem("NOTES")=="[]")
        {
            window.localStorage.removeItem("NOTES");
        }
    }

    static DeleteNoteAll(id_arr)
    {
        id_arr = Helper.SortNumbers(id_arr);
        id_arr.forEach(id=>{
            this.DeleteNote(id);
        });
    }

    static DisplayAllNotes()
    {   
        var NOTE_BOX = [];
        var section_note = document.getElementById("section_note");
        var section_pinned = document.getElementById("section_pinned");
        section_note.innerHTML = "";
        section_pinned.innerHTML = "";

        var section_note_data= "";
        var section_pinned_data = ""

        if(window.localStorage.getItem("NOTES"))
        {
            NOTE_BOX = JSON.parse(window.localStorage.getItem("NOTES")) || [];
            
            for(let i=0; i<NOTE_BOX.length; i++)
            {
                var id = NOTE_BOX[i].Note_Id;
                var title = NOTE_BOX[i].Note_Title;
                var content =NOTE_BOX[i].Note_Content;
                var time =Helper.Date_diff(NOTE_BOX[i].Note_Time);

                var pinned = NOTE_BOX[i].Note_Pinned;

                if(pinned!="")
                {
                    section_pinned_data += `<div class="note-box">
                                               <div class="note-header">
                                                   <h3 id="note_title" data-note_id="${id}">${title}</h3><i class="fa-solid fa-thumbtack note-header-icon"></i>
                                               </div>
                                               <div class="note-body">
                                                   <p id="note_content">${content}</p>
                                               </div>
                                               <div class="note-footer">
                                                   <p>${time}</p>
                                               </div>
                                           </div>`;
                }
                else
                {

                    section_note_data += `<div class="note-box">
                                            <div class="note-header">
                                                <h3 id="note_title" data-note_id="${id}">${title}</h3>
                                            </div>
                                            <div class="note-body">
                                                <p id="note_content">${content}</p>
                                            </div>
                                            <div class="note-footer">
                                                <p>${time}</p>
                                            </div>
                                        </div>`;
                }
            }  

            section_note.innerHTML=section_note_data;
            section_pinned.innerHTML=section_pinned_data;

            Helper.LineCount();
            Helper.NoteBox_ClickEvent();
            
        }
    }

    static DisplaySingleNote(DOM)
    {
        const model = document.getElementById("dialog_insert");
        model.showModal();
        
        if(DOM.parentElement.className=="section-pinned")
        {
            model.querySelector("#pin_btn").classList.add("pinned-clr");
            model.querySelector("#pin_btn").dataset.pin_value="pinned";
        }
        else
        {
            model.querySelector("#pin_btn").classList.remove("pinned-clr");
            model.querySelector("#pin_btn").dataset.pin_value="";
        }

        let note_heading = "Edit Note";
        let note_id = DOM.querySelector("#note_title").dataset.note_id;
        let note_title = DOM.querySelector("#note_title").innerText;
        let note_content = DOM.querySelector("#note_content").innerText;


        model.querySelector("#note_heading").innerText=note_heading;
        model.querySelector("#insert_note_id").value =note_id;
        model.querySelector("#insert_note_title").value = note_title;
        model.querySelector("#insert_note_content").value = note_content;

        model.querySelector("#insert_note_title").blur();
    }

    static SearchNote(value)
    {
        var toSearchFrom = document.querySelectorAll(".note-box");
        let search_value = value.toLowerCase();
        
        for(let i=0; i<toSearchFrom.length; i++)
        {
            let note_title = toSearchFrom[i].querySelector("#note_title").innerText.toLowerCase();
            let note_content = toSearchFrom[i].querySelector("#note_content").innerText.toLowerCase();
        
            if(note_title.indexOf(search_value)>-1 || note_content.indexOf(search_value)>-1)
            {
                toSearchFrom[i].style.display="";
                
            }
            else
            {
                toSearchFrom[i].style.display="none";
            }
        }
    }

    

    static ValidateNote(note_title,note_content)
    {
        if(note_title =="" && note_content=="")
        {
          return false;
        }
        else if(note_title !="" || note_content!="")
        {
          return true;
        }
        else
        {
          return false;
        }
    }

    static EmptyValues()
    {
        document.querySelector("#note_heading").innerText="New Note";
        document.querySelector("#insert_note_id").value ="";
        document.querySelector("#insert_note_title").value="";
        document.querySelector("#insert_note_content").value="";
        document.querySelector("#pin_btn").dataset.pin_value="";
        document.querySelector("#pin_btn").classList.remove("pinned-clr");
    }

    static ShowInsertModel(model_dom)
    {
        model_dom.showModal();
        
        model_dom.querySelector("#insert_note_title").blur();

        this.EmptyValues();
    }
}








// Note.SaveNote("credit","paypal,moneygram");

// // * sitting data to localstorage
// const Note_Data = new Note(1,"shoping","shoes , t-shirt , pants , belt , hat , 3 shorts");



// const NewData = new Note(2,"hangout","shoes , 2 shorts");

// var NOTES = [];

// NOTES.push(Note_Data);

// NOTES.push(NewData);

// window.localStorage.setItem("NOTES",JSON.stringify(NOTES));


// // * getting data from localstorage
// var data = JSON.parse(window.localStorage.getItem("NOTES"));

// // * modefying data
// var id = data[data.length-1].Note_Id+1;
// data[1].Note_Id = id;
// window.localStorage.setItem("NOTES",JSON.stringify(data));
// console.log(data)

