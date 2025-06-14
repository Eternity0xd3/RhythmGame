console.log("eceee")

fetch("tracks\Armageddom\meta.json")
  .then((response) => response.json())
  .then((json) => console.log(json));
