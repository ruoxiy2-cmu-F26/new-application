
const eventForm=document.getElementById("newform")
//class改成id，已改（html+css）
const inputTitle=document.getElementById("inputtitle");
//const descriptionOptional=document.getElementById("input_description");
const inputDescription=document.getElementById("inputdescription");
const inputInvite=document.getElementById("input_invite");





eventForm.addEventListener("submit", function(event) {

    /*new event input*/
    const title = inputTitle.value;
    //const optional = descriptionOptional.value;
    const description = inputDescription.value;
    const invite = inputInvite.value;
    console.log(title);
    //console.log(optional);
    console.log(description);
    console.log(invite);



});

