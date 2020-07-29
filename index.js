// 123MKV functions
function getPosts123MKV(){
    const mkvWorldJsonPosts = 'https://123mkv.world/wp-json/wp/v2/posts/';
    $.get(mkvWorldJsonPosts, function(data){
        var items = [];
        $.each(data, function(key,val){
            // console.log(val);
            htmlContent = `
            <a href="index.html?id=${val.id}&site=mkv123" class="column is-half-mobile is-one-quarter-tablet">
                <div class="">
                <figure class="image is-2by4">
                    <img src="${val.jetpack_featured_media_url}" alt="${val.title.rendered}">
                </figure>
                <p class="text" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-shadow: 0px 0px 1.5px #000000;">
                    ${val.title.rendered}
                </p>
                </div>
            </a>
            <!-- THIS DIV HAS ENDED HERE -->
            `;
            items.push(htmlContent);
        });
        $("#postsContainer").append(items);
    }, "json")
};

function searchPosts123MKV(search){
    const searchUrl = 'https://123mkv.world/?feed=rss&s='+search;
    // const searchUrl = 'feed.txt';
    console.log(searchUrl);
    fetch(searchUrl)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            const searches = data.querySelectorAll("item");
            searches.forEach(el => {
                url = 'https://123mkv.world/wp-json/wp/v2/posts/'+el.querySelector("post-id").innerHTML;
                // url = 'post.json';
                $.get(url, function(data){
                    html = `
                        <a href="index.html?id=${data.id}&site=mkv123" class="column is-half-mobile is-one-quarter-tablet">
                            <div class="">
                            <figure class="image is-2by4">
                                <img src="${data.jetpack_featured_media_url}" alt="${data.title.rendered}">
                            </figure>
                            <p class="text" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-shadow: 0px 0px 1.5px #000000;">
                                ${data.title.rendered}
                            </p>
                            </div>
                        </a>
                        <!-- THIS DIV HAS ENDED HERE -->
                    `;
                    $("#postsContainer").append(html);
                }, "json");
            });
        })
};

function getPost123MKV(postId){
    var url = 'https://123mkv.world/wp-json/wp/v2/posts/'+postId;
    // var url = "post.json";
    $.get(url, function(data){
        $("#postContainer").html('');
        htmls = new window.DOMParser().parseFromString(data.content.rendered, "text/html");
        var imageHTML = `
        <div class="card-image" style="margin: .5rem;">
            <figure class="image is-2by4">
                <img src="${data.jetpack_featured_media_url}" alt="alt text" id="${data.title.rendered}">
            </figure>
        </div>`;
        var movieTitle = `
        <div class="card-content">
            <div class="media-content">
                <p class="title is-4">${data.title.rendered}</p>
            </div>`;
            var infoTable = `
            <div class="content"><br>
                <table class="table is-fullwidth is-bordered" id="infoTable">
                </table>
            </div>
        </div>`;
        $("#postContainer").append(imageHTML+movieTitle+infoTable);
        var strongs = htmls.getElementsByTagName("strong");
        $("#infoTable").html('');
        var informations = {};
        $.each(strongs, function(key, val){
            var langPatt = /^Language:/;
            var sizePatt = /^Size:/;
            var qualityPatt = /^Quality:/;
            var releasePatt = /^Release Date:/;
            var countryPatt = /^Country:/;
            if(val.innerText.match(countryPatt)){
                result = val.innerText.replace(countryPatt, '');
                if(!result.length <=0){
                    // console.log(result);
                    informations["country"] = result;
                    content = `
                    <tr>
                        <th>Country</th>
                        <td>${result}</td>
                    </tr>`;
                    $("#infoTable").append(content);
                }
            }
            if(val.innerText.match(releasePatt)){
                result = val.innerText.replace(releasePatt, '');
                if(!result.length <=0){
                    // console.log(result);
                    informations["releaseDate"] = result;
                    content = `
                    <tr>
                        <th>Release Date</th>
                        <td>${result}</td>
                    </tr>`;
                    $("#infoTable").append(content);
                }
            }
            if(val.innerText.match(qualityPatt)){
                result = val.innerText.replace(qualityPatt, '');
                if(!result.length <=0){
                    // console.log(result);
                    informations["quality"] = result;
                    content = `
                    <tr>
                        <th>Quality</th>
                        <td>${result}</td>
                    </tr>`;
                    $("#infoTable").append(content);
                }
            }
            if(val.innerText.match(sizePatt)){
                result = val.innerText.replace(sizePatt, '');
                if(!result.length <=0){
                    // console.log(result);1
                    informations["size"] = result;
                    content = `
                    <tr>
                        <th>Size</th>
                        <td>${result}</td>
                    </tr>`;
                    $("#infoTable").append(content);
                }
            }
            if(val.innerText.match(langPatt)){
                result = val.innerText.replace(langPatt, '');
                if(!result.length <=0){
                    // console.log(result);
                    informations["language"] = result;
                    content = `
                    <tr>
                        <th>Language</th>
                        <td>${result}</td>
                    </tr>`;
                    $("#infoTable").append(content);
                }
            }
        });
        var formHTML = htmls.getElementsByTagName("form")[0].innerHTML;
        var formContents = new window.DOMParser().parseFromString(htmls.getElementsByTagName("form")[0].innerHTML, "text/html");
        var fname = formContents.getElementsByTagName("input")[0].value;
        var fsip = formContents.getElementsByTagName("input")[1].value;
        getDownloadLink123MKV(fname, fsip, data.title.rendered);
    }, "json");
};

function getDownloadLink123MKV(fname, fsip, title){
    console.log(title);
    fetch("https://123mkv.world/start-downloading/", {
    // fetch("start-downloading.html", {
        method: "POST",
        body: `fname=${fname}&fsip=${fsip}`,
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    })
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/html"))
    .then(data => {
        var metas = data.getElementsByTagName("meta");
        $.each(metas, function(key, val){
            var urlPatt = /^5; url=/;
            if(val.content.match(urlPatt)){
                result = val.content.replace(urlPatt, '');
                content = `<td colspan="2"><a href="${result}" class="button is-warning is-fullwidth">DOWNLOAD</a></td>`;
                $("#infoTable").append(content);
            }
        })
    })
}
// 123MKV function end

// uncutHD functions
function getPostsUncutHD(search){
    if(search){
        var uncutHD = 'https://www.uncuthd.space/wp-json/wp/v2/posts?search='+search;
        console.log("im working");
    }else{
        var uncutHD = 'https://www.uncuthd.space/wp-json/wp/v2/posts/';
    }
    // var mkvWorldJsonPosts = 'post.json'
    $.get(uncutHD, function(data){
        var items = [];
        $.each(data, function(key,val){
            // console.log(val);
            postContents = new window.DOMParser().parseFromString(val.content.rendered, "text/html");
            // console.log(postContents);
            imgs = postContents.getElementsByTagName("img");
            // console.log(imgs);
            // console.log(imgs[0].src);
            htmlContent = `
            <a href="index.html?id=${val.id}&site=uncuthd" class="column is-half-mobile is-one-quarter-tablet">
                <div class="">
                <figure class="image is-2by4">
                    <img src="${imgs[0].src}" alt="${val.title.rendered}" onerror="imgError(this);"/>
                </figure>
                <p class="text" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-shadow: 0px 0px 1.5px #000000;">
                    ${val.title.rendered}
                </p>
                </div>
            </a>
            <!-- THIS DIV HAS ENDED HERE -->
            `;
            items.push(htmlContent);
        });
        $("#postsContainer").append(items);
    }, "json")
};

function getPostUncutHD(postId){
    var url = 'https://www.uncuthd.space/wp-json/wp/v2/posts/'+postId;
    // var url = "post2.json";
    $.get(url, function(data){
        $("#postContainer").html('');
        postContents = new window.DOMParser().parseFromString(data.content.rendered, "text/html");
        // console.log(postContents);
        imgs = postContents.getElementsByTagName("img");
        // console.log(postContents.getElementsByClassName("imdb_container")[0].innerHTML)
        var imageHTML = `
        <div class="card-image" style="margin: .5rem;">
            <figure class="image is-2by4">
                <img src="${postContents.getElementsByTagName("img")[0].src}" width="100px" height="auto" alt="${data.title.rendered}" onerror="imgError(this);"/>
            </figure>
        </div>`;
        var movieTitle = `
        <div class="card-content">
            <div class="media-content">
                <p class="title is-4">${data.title.rendered}</p>
            </div>`;
            var infoTable = `
            <div class="content"><br>
                <table class="table is-fullwidth is-bordered" id="infoTable">
                </table>
            </div>
        </div>`;
        $("#postContainer").append(imageHTML+movieTitle+infoTable);
        var spans = postContents.getElementsByClassName("crew");
        var strongs = postContents.getElementsByTagName("strong");
        var h3s = postContents.getElementsByTagName("h3");
        // console.log(spans.length);
        $("#infoTable").html('');
        var informations = {};
        if(spans.length){
            $.each(spans, function(key, val){
                var directorPatt = /^Director:/;
                var writersPatt = /^Writers:/;
                var starsPatt = /^Stars:/;
                if(val.innerText.match(directorPatt)){
                    result = val.innerText.replace(directorPatt, '');
                    if(!result.length <=0){
                        // console.log(result);
                        informations["directors"] = result;
                        content = `
                        <tr>
                            <th>Directors</th>
                            <td>${result}</td>
                        </tr>`;
                        $("#infoTable").append(content);
                    }
                }
                if(val.innerText.match(writersPatt)){
                    result = val.innerText.replace(writersPatt, '');
                    if(!result.length <=0){
                        // console.log(result);
                        informations["writers"] = result;
                        content = `
                        <tr>
                            <th>Writers</th>
                            <td>${result}</td>
                        </tr>`;
                        $("#infoTable").append(content);
                    }
                }
                if(val.innerText.match(starsPatt)){
                    result = val.innerText.replace(starsPatt, '');
                    if(!result.length <=0){
                        // console.log(result);
                        informations["stars"] = result;
                        content = `
                        <tr>
                            <th>Stars</th>
                            <td>${result}</td>
                        </tr>`;
                        $("#infoTable").append(content);
                    }
                }
            });
            var moreInfo = postContents.getElementById("genres");
            var genres = moreInfo.innerText.split("|");
            if(genres.length){
                $.each(genres, function(key, val){
                    if(val.length){
                        content = `
                        <tr>
                            <th></th>
                            <td>${val}</td>
                        </tr>`;
                        $("#infoTable").append(content);
                    }
                });
                //
                var downloadLinks = postContents.getElementsByTagName("a");
                // console.log(downloadLinks)
                $("#infoTable").append(`<tr><td colspan="2" id="downloadLinks"><p class="text">Direct Download Links:</p></td></tr>`);
                $.each(downloadLinks, function(key, val){
                    // console.log(val.href);
                    if(val.innerText.match(/^Torre/)){
                        var directLink = val.href;
                        content = `<a href="${val.href}" class="button is-warning is-fullwidth">Torrent Download</a><br>`;
                        $("#downloadLinks").append(content);
                    }
                    if(val.href.match(/^https:\/\/w\./)){
                        getDownloadLink(val.href);
                        // console.log(val.href);
                    }
                });

            }
        }else if(strongs.length){
            // console.log(strongs);
            var releasePatt = /^Release Date:/;
            var directorPatt = /^Director:/;
            var languagePatt = /^Language:/;
            var qualityPatt = /^Quality:/;
            $.each(strongs, function(key, val){
                if(val.innerText.match(qualityPatt)){
                    result = val.innerText.replace(qualityPatt, '');
                    if(!result.length <=0){
                        // console.log(result);
                        informations["language"] = result;
                        content = `
                        <tr>
                            <th>Quality</th>
                            <td>${result}</td>
                        </tr>`;
                        $("#infoTable").append(content);
                    }
                }
                if(val.innerText.match(languagePatt)){
                    result = val.innerText.replace(languagePatt, '');
                    if(!result.length <=0){
                        // console.log(result);
                        informations["language"] = result;
                        content = `
                        <tr>
                            <th>Language</th>
                            <td>${result}</td>
                        </tr>`;
                        $("#infoTable").append(content);
                    }
                }
                if(val.innerText.match(directorPatt)){
                    result = val.innerText.replace(directorPatt, '');
                    if(!result.length <=0){
                        // console.log(result);
                        informations["directors"] = result;
                        content = `
                        <tr>
                            <th>Directors</th>
                            <td>${result}</td>
                        </tr>`;
                        $("#infoTable").append(content);
                    }
                }
                if(val.innerText.match(releasePatt)){
                    result = val.innerText.replace(releasePatt, '');
                    if(!result.length <=0){
                        // console.log(result);
                        informations["releaseDate"] = result;
                        content = `
                        <tr>
                            <th>Release Date</th>
                            <td>${result}</td>
                        </tr>`;
                        $("#infoTable").append(content);
                    }
                }
            })
            h3sLinks = h3s[1].getElementsByTagName("a");
            $("#infoTable").append(`<tr><td colspan="2" id="downloadLinks"><p class="text">Download Links:</p></td></tr>`);
            $.each(h3s, function(h3sKey, h3sLinks){
                h3sLinks = h3sLinks.getElementsByTagName("a");
                if(h3sLinks.length >= 2){
                    var colors = ["primary", "link", "info", "success", "warning", "danger"];
                    $.each(h3sLinks, function(key, val){
                        title = val.innerHTML;
                        if(val.innerHTML.match(/Play Online/) || val.innerHTML.match(/Watch Online/)){
                            title = "Direct Link";
                        }
                        content = `<a href="${val.href}" class="button is-${colors[Math.floor(Math.random() * Math.floor(6))]} is-fullwidth">${title}</a><br>`;
                        $("#downloadLinks").append(content);
                    })
                };
            })
        }
    }, "json");
};
// getPost();

function getDownloadLink(directLink){
    // fetch("example1.html", {
    fetch(directLink, {
        method: "GET",
        // body: `fname=${fname}&fsip=${fsip}`,
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    })
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/html"))
    .then(data => {
        if(data.getElementsByTagName("form").length){
            var inputName = data.getElementsByTagName("form")[0].elements[0].name;
            var inputValue = data.getElementsByTagName("form")[0].elements[0].value;
            // console.log(directLink);
            fetch(directLink, {
                method: "POST",
                body: `${inputName}=${inputValue}`,
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                }
            })
            .then(response => response.text())
            .then(str2 => new window.DOMParser().parseFromString(str2, "text/html"))
            .then(data2 => listLinks(data2))
        }else{
            console.log("no neede to hurry");
            listLinks(data)
        }
    })
    function listLinks(dataPassed){
        var links = dataPassed.getElementsByClassName("view-links")[0].getElementsByTagName("a");
        var colors = ["primary", "link", "info", "success", "warning", "danger"];
        $.each(links, function(key, val){
            content = `<a href="${val.href}" class="button is-${colors[Math.floor(Math.random() * Math.floor(6))]} is-fullwidth">${val.host}</a><br>`;
            $("#downloadLinks").append(content);
        })
    };
}
// uncutHD functions end
function getPosts(){
    html = `
    <div class="columns is-multiline is-mobile" id="postsContainer" style="margin: auto;">
    </div>`;
    $("#container").html(html);
        getPosts123MKV();
        getPostsUncutHD();
};
function searchPosts(search){
    html = `
    <div class="columns is-multiline is-mobile" id="postsContainer" style="margin: auto;">
    </div>`;
    $("#container").html(html);
    searchPosts123MKV(search);
    getPostsUncutHD(search);
};
function getPost(postId, site){
    html = `
    <div class="card" id="postContainer" style="margin: auto;">
    </div>`;
    $("#container").html(html);
    if(site == "mkv123"){
        getPost123MKV(postId);
    }else{
        getPostUncutHD(postId);
    }
};

// function playVideo(videoUrl, title){
//     html = `
//     <div class="playVideo">
//       <video id="player" playsinline controls>
//           <source src="${videoUrl}"/>
//       </video><br>
//       <div class="videoDetails" style="padding: 0.5rem;">
//           <h1 class="title is-4">${title}</h1>
//           <a href="${videoUrl}" class="button is-fullwidth is-warning">Download</a>
//       </div>
//     </div>
//     <link rel="stylesheet" href="plyr.css">
//     <script src="plyr.js"></script>`;
//     $(".container").html(html);
//     const player = new Plyr('#player');
// }

let urlParams = new URLSearchParams(window.location.search);
if(urlParams.has('search')){
    var search = urlParams.get('search');
    if(search.length >= 3){
        // console.log("now search");
        searchPosts(search);
    }else{
        alert("type atleast 3 characters to search");
    }
}else if(urlParams.has('id')){
    var id = urlParams.get('id');
    getPost(id, urlParams.get('site'));
}else{
    getPosts();
}
