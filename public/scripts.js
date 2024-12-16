const searchButton = document.querySelector("#search-button");
const searchField = document.querySelector("#search-input");

//non-dashboard login button
const login = document.querySelector("#login-button").addEventListener("click", (e) => {
    document.location.href="/dashboard.html";
});

//search stuff
async function search(){
    if(searchField){
        try{
            let title = encodeURIComponent(searchField.value);
            
            const url = `/movies/search?title=${title}&page=1`;
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

document.querySelector("#back-page").addEventListener("click", (e) =>{    
    console.log("back"); 
    let url = document.location.href;
    let grabPage = url.match(/page=(\d+)/);
    let page = parseInt(grabPage[1]);
    console.log("page=" +page);
    if(page > 1){
        page-=1;
        let newUrl = url.replace(grabPage[0], `page=${page}`);
        console.log(newUrl);
        document.location.href = newUrl;
    }
});
document.querySelector("#forward-page").addEventListener("click", (e) =>{
    console.log("forward");
    let url = document.location.href;
    let grabPage = url.match(/page=(\d+)/);
    let page = parseInt(grabPage[1]);
    page+= 1;
    let newUrl = url.replace(grabPage[0], `page=${[page]}`);
    document.location.href = newUrl;
});

document.addEventListener("keydown", (e) => {
    if (document.activeElement === searchField && e.key === "Enter") {
        search();
    }
});

window.addEventListener('load', (e)=>{
    console.log(document.cookie);
    if(document.querySelector(".search-results").innerHTML==''){
        let url = document.location.href;
        let grabPage = url.match(/page=(\d+)/);
        let page = parseInt(grabPage[1]);
        page-= 1;
        let newUrl = url.replace(grabPage[0], `page=${[page]}`);
        document.location.href = newUrl;
    }
    fetch('/users/check-auth')
        .then(response => response.json())
        .then(data => {
            if(data.authenticated){
                document.querySelector("#login-button").textContent = "Account";
            }
        });
});