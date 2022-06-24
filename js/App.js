import {Note} from "./Note.js";
import {Helper} from "./Helper.js";


//*-----------------------------------------------------------------
//? two btns DOM's opens dialog
const add_new_btn =document.getElementById("add_new_btn");
const add_btn = document.getElementById("add_btn");
//? dialog insert DOM's
const model = document.getElementById("dialog_insert");

const back_btn = document.getElementById("back_btn");
const save_btn = document.getElementById("save_btn");
const delete_btn = document.getElementById("delete_btn");
const pin_btn = document.getElementById("pin_btn");

//? dialog delete DOM's
const modal_delete = document.getElementById("dialog_delete");
const modal_delete_delete_btn = document.getElementById("delete");
const modal_delete_cancel_btn = document.getElementById("cancel");

//? select deselect DOM's
const select_deselect_all_btn = document.getElementById("select_deselect_all_btn");
const delete_all_btn = document.getElementById("delete_all_btn");
const cancel_select_all_btn = document.getElementById("cancel_select_all_btn");

//? input_box DOM's
const search_box = document.getElementById("search");

//?toast_close
const toast_close = document.getElementById("toast_close");


//*----------------------------------------------------------------- 
//? eventListeners
add_btn.addEventListener("click",()=>{
   Note.ShowInsertModel(model);
});

add_new_btn.addEventListener("click",()=>{
    Note.ShowInsertModel(model);
});

back_btn.addEventListener("click",()=>{
    model.close();
});


//* pin_btn 
pin_btn.addEventListener("click",(e)=>{
    let note_id = model.querySelector("#insert_note_id").value;
    let note_title = model.querySelector("#insert_note_title").value;
    let note_content = model.querySelector("#insert_note_content").value;
    let note_pinned = model.querySelector("#pin_btn").dataset;
    let note_time = Helper.getDateTime();
    let pinned_msg="";

    if(e.target.classList.contains("pinned-clr"))
    {
        e.target.classList.remove("pinned-clr");
        note_pinned.pin_value="";
        pinned_msg = "Selected note unpinned!";
    }
    else
    {
        e.target.classList.add("pinned-clr");
        note_pinned.pin_value="pinned";
        pinned_msg = "Selected note pinned!";
    }

    if(Note.ValidateNote(note_title,note_content))
    {
        if(note_id!="")
        {
            Note.UpdateNote(note_id,note_title,note_content,note_pinned.pin_value,note_time);
            Note.DisplayAllNotes();
            Helper.ShowToast("Info",pinned_msg); 
            
        }
    }
});


//* save_btn
save_btn.addEventListener("click",()=>{
    let note_id = model.querySelector("#insert_note_id").value;
    let note_title = model.querySelector("#insert_note_title").value;
    let note_content = model.querySelector("#insert_note_content").value;
    let note_pinned_value = model.querySelector("#pin_btn").dataset.pin_value; 
    let note_time = Helper.getDateTime();  

    // console.log("save clicked");

    if(Note.ValidateNote(note_title,note_content))
    {
        
        if(note_id=="")
        {
            model.querySelector("#insert_note_id").value = Note.SaveNote(note_title,note_content,note_pinned_value,note_time);
            Helper.ShowToast("Success","Note has been added!");
        }
        else
        {
            Note.UpdateNote(note_id,note_title,note_content,note_pinned_value,note_time);
            Helper.ShowToast("Success","Note has been modified!");
        }
       
        model.close();
        Note.DisplayAllNotes();
        
    }
});


//* delete_btn
delete_btn.addEventListener("click",()=>{
    let note_id = model.querySelector("#insert_note_id").value;

    if(Note.ValidateNote(note_title,note_content))
    {
        if(note_id!="")
        {

            Helper.DeleteMsgBox(modal_delete,1,"Selected notes will be deleted!");

            modal_delete_delete_btn.onclick = ()=>{
                modal_delete.close();
                Note.DeleteNote(note_id);
                Note.DisplayAllNotes();
                Helper.ShowToast("Delete","Selected note has been deleted!"); 
            }
        
            modal_delete_cancel_btn.onclick = ()=>{
             modal_delete.close();   
            } 
        }
    }
});


//* select_deselect_all btn
select_deselect_all_btn.addEventListener("click",(e)=>{
    if(e.target.className=="fa-regular fa-square header-icon"){
        Helper.SelectDeSelectAll(true);
        Helper.countSelected();
    }
    else
    {
        Helper.SelectDeSelectAll(false);
        Helper.countSelected();
    }
}
);

//*delete_all_btn
delete_all_btn.addEventListener("click",()=>{
    var selected = document.querySelectorAll(".selected");
    var selected_note_id =[];
    selected.forEach(i=>{
        let note_id = i.querySelector("#note_title").dataset.note_id;
        selected_note_id.push(Number(note_id));
    });


    Helper.DeleteMsgBox(modal_delete,selected.length,"Selected notes will be deleted!");

    modal_delete_delete_btn.onclick = ()=>{
        Note.DeleteNoteAll(selected_note_id);
        Note.DisplayAllNotes();
        Helper.countSelected();
        modal_delete.close();
        Helper.ShowToast("Delete","Selected notes has been deleted!");  
    }

    modal_delete_cancel_btn.onclick = ()=>{
        modal_delete.close();   
    }
    
});

//* cancel_select_all_btn
cancel_select_all_btn.addEventListener("click",()=>{
    Helper.SelectDeSelectAll(false);
    Helper.countSelected();
});



search_box.addEventListener("input",(e)=>{
    Note.SearchNote(e.target.value);
});


toast_close.addEventListener("click",()=>{
    Helper.CloseToast("close");
});



Helper.CheckInternet();


//?--------------------------- calling ----------------------------------
setInterval(()=>{
    Helper.getDateTime();
},6*1000);
Note.DisplayAllNotes();
 
Helper.getDateTime();
