const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.getElementById("submitUpdate")
      updateBtn.removeAttribute("disabled")
    })