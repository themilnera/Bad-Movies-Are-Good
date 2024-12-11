const login = document.querySelector("#login-button").addEventListener("click", (e) => {
    document.location.href="dashboard.html";
});

const searchButton = document.querySelector("#search-button");
const searchField = document.querySelector("#search-input");

async function search(){
    if(searchField){
        try{
            let title = encodeURIComponent(searchField.value);
            //use encodeURIComponent to pass unicode values for things like &

            const url = `/movies/search?title=${title}`;
            document.location.href=url;
        }
        catch(error){
            console.log("error: "+error);
        }
    }
    else{
        //do like "search field is empty" message
    }
}

searchButton.addEventListener("click", async (e) =>{
    search();
});

document.addEventListener("keydown", (e) => {
    if (document.activeElement === searchField && e.key === "Enter") {
        search();
    }
});