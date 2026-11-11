const descriptionField = document.getElementById("description");
const editorElement = document.getElementById("description-editor");

if (descriptionField && editorElement) {
  const quill = new Quill("#description-editor", {
    theme: "snow",
    placeholder: "Write a description for this trail...",
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    },
  });

  // Load the existing description when editing a trail
  if (descriptionField.value) {
    quill.clipboard.dangerouslyPasteHTML(descriptionField.value);
  }

  // Copy the editor's HTML into the hidden input before submission
  const form = descriptionField.closest("form");

  if (form) {
    form.addEventListener("submit", () => {
      descriptionField.value = quill.root.innerHTML;
    });
  }
}
