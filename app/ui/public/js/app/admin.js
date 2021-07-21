const startEvent = async (e) => {
  e.preventDefault();

  const eventName = document.getElementById("eventName").value;
  let eventData = {};
  eventData.eventName = eventName;

  const option = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      eventName,
    }),
    redirect: "follow",
  };

  const response = await fetch("/api/event", option);
  const dataz = await response.json();

  window.location.href = "/ui/event/" + dataz._id + "/showposts";
};

$("button.join").click(function () {
  window.location.href = "/ui/event/" + this.dataset.id + "/showposts";
});

$("button.delete").click(async function () {
    console.log("deleting event " + this.dataset.id);
    const eventId = this.dataset.id;
    const option = {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        redirect: "follow",
      };
      const url = "/api/event/" + eventId + "/delete";
      const response = await fetch(url, option);
      const data = await response.json();
      if(data.ok == 1){ 
        window.location.reload();
      }else{
          alert("Unable to Delete Event" + data.error);
      }
      
  });
