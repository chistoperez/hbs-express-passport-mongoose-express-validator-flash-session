console.log("Hi");

document.addEventListener("click", (e) => {
  if (e.target.dataset.short) {
    const url = `https://short-url-w-auth.herokuapp.com/${e.target.dataset.short}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log("Text copied to clipboard...");
      })
      .catch((err) => {
        console.log("Something went wrong", err);
      });
  }
});
