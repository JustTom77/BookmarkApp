const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

let bookmarks = [];

// ==> SHOW MODAL; FOCUS ON INPUT <==
function showModal() {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
}

// ==> MODAL EVENTLISTENERS <==
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () =>
  modal.classList.remove("show-modal")
);
window.addEventListener("click", e => {
  e.target === modal ? modal.classList.remove("show-modal") : false;
});

// ==> SET REGEX FOR URL <==
function setRegex(nameValue, urlValue) {
  let expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  let regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Please submit values for both fields");
    return false;
  }
  if (urlValue.match(regex)) {
    console.log("success");
  } else {
    alert("Please insert a valid Url");
    return false;
  }
  // ==> VALID <==
  return true;
}

// ==> BUILD BOOKMARKS DOM <==
function buildBookmarks() {
  // REMOVE ALL BOOKMARK ELEMENTS
  bookmarksContainer.innerText = "";
  // BUILD ITEMS
  bookmarks.forEach(bookmark => {
    const { name, url } = bookmark;
    // ITEM
    const item = document.createElement("div");
    item.classList.add("item");
    // CLOSE ICON
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark("${url}")`);
    // FAVICON / LINK CONTAINER
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");
    // FAVICON
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");
    // LINK
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;
    // APPEND TO BOOKMARKS CONTAINER
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

// ==> FETCH BOOKMARKS <==
function fetchBookmarks() {
  // GET BOOKMARKS FROM LOCALSTORAGE IF AVAILABLE
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    // CREATE A BOOKMARKS ARRAY IN LOCAL STORAGE
    bookmarks = [
      {
        name: "Google",
        url: "https://google.com",
      },
    ];
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

// ==> DELETE BOOKMARK <==
function deleteBookmark(url) {
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url) {
      bookmarks.splice(i, 1);
    }
  });
  // UPDATE BOOKMARKS ARRAY IN LOCALSTORAGE; RE_POPULATE DOM
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
}

// ==> HANDLE DATA FROM FORM <==
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes("http://", "https://")) {
    urlValue = `https://${urlValue}`;
  }
  if (!setRegex(nameValue, urlValue)) {
    return false;
  }
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark);
  console.log(bookmarks);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
}

// ==> EVENTLISTENER <==
bookmarkForm.addEventListener("submit", storeBookmark);

// ==> ON LOAD <==
fetchBookmarks();
