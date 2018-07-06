

  $("#buttonAssignedTo").click(function() {
    const button = $(this);
    const id = button.data("person")
    const name = button.closest("li").find("h3").text();

   $("#taskAssignedTo").val(name);
   $("#taskAssignedId").val(id);
  })


